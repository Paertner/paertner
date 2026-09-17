# Paertner production deployment

Last updated: 2026-09-17. Read this file before changing production infrastructure.
Deployment is being commissioned; see the verification record at the end for actual status.

## Server and domain

| Item | Value |
| --- | --- |
| Repository | https://github.com/Paertner/paertner (public) |
| Production branch | `main` |
| Canonical URL | https://paertner.com |
| Alternative hostname | `www.paertner.com`, redirected to the canonical URL |
| VPS IPv4 | `2.25.127.101` |
| SSH user / port | `root` / `22` |
| Hostname | `srv1966487` |
| OS at setup | Ubuntu 24.04.4 LTS, x86_64 |
| Resources at setup | 2 vCPUs, 7,940 MiB RAM, 96 GB root filesystem, roughly 95 GB initially free |
| Container tools at setup | Docker 29.8.0, Compose v5.5.1 |
| Local project | `F:\Codex GPT\Paertner` |

These resources are sufficient for the initial single-instance site. Capacity
under sustained traffic has not been load-tested.

Cloudflare DNS: `paertner.com` A record points to `2.25.127.101`, DNS only, TTL Auto.
`www.paertner.com` is a CNAME to `paertner.com`. The previous A record was
`82.197.83.210`. Preserve the Microsoft 365 MX, TXT, autodiscover, enrollment and
registration records; they are unrelated to this website move. Check for stale
AAAA records before diagnosing IPv6 connectivity issues.

## Administrator SSH access

The existing local key that worked is `C:\Users\User\.ssh\id_ed25519`.
Use it explicitly: the unrelated `id_rsa` file reports an invalid format.
The unrelated SSH aliases `stage-24ai` and `en-24ai` are not this VPS.

PowerShell:

```powershell
& 'C:/Windows/System32/OpenSSH/ssh.exe' -i "$env:USERPROFILE/.ssh/id_ed25519" -o IdentitiesOnly=yes root@2.25.127.101
```

The sandbox may resolve plain `ssh` to a disabled wrapper. Request normal tool
escalation to run the real OpenSSH executable; do not work around rejected
approval decisions. The VPS host key is recorded in the local `known_hosts`.
Keep host verification enabled. Never replace a changed host key blindly.

## Runtime and persistent data

The application runs on Node 24 in Docker, as the unprivileged `node` user.
Caddy handles HTTPS, certificate renewal and the `www` redirect. The application
port is bound only to `127.0.0.1:3000`; public traffic enters on ports 80/443.
Docker restart policies restart the site after a host reboot.

| Server path | Purpose |
| --- | --- |
| `/opt/paertner/repo` | Git checkout used to build immutable commit-tagged images |
| `/opt/paertner/deploy.sh` | Installed deployment entry point, separate from the checkout |
| `/opt/paertner/compose.yml` | Installed Docker Compose configuration |
| `/opt/paertner/Caddyfile` | Installed HTTPS proxy configuration |
| `/opt/paertner/shared/app.env` | Production environment and PAYLOAD_SECRET; root-readable only |
| `/opt/paertner/shared/data/paertner-v1.db` | Persistent production SQLite database |
| `/opt/paertner/shared/data/media` | Persistent CMS uploads |
| `/opt/paertner/shared/brand` | Four privately supplied website SVG logos |
| `/opt/paertner/release.env` | Current `APP_IMAGE=paertner:<commit SHA>` |
| `/opt/paertner/deployed-sha` | Last successfully deployed Git commit |
| `/opt/paertner/backups` | Pre-deployment database/media snapshots and environment copies |

Production uses SQLite to preserve the existing CMS content and account on this
single persistent VPS. It does not set DATABASE_URI or use PostgreSQL. Generate
and commit SQLite migrations for future schema changes; do not use development
schema push on production. PostgreSQL would require a separate data migration.

The initial database comes from a consistent snapshot of local `data/paertner-v1.db`.
The deployment baseline is checked against a database built from the committed
migrations before replacing the development migration marker in the copied database.
Columns, indexes and foreign-key targets match. The existing database retains
Payload's SET NULL behavior on legacy media references and CASCADE on the locked
document post reference; the older hand-written migration used NO ACTION for
those references. This reviewed difference does not require rewriting live data.
Do not modify the original development database during this process.

Secrets, databases, uploads, source brand assets and local `.local/` files are
excluded from both Git and the Docker build context. Never print or commit them.
The private local setup directory is `.local/deploy/`; it is not a recovery backup
for the live production database. The existing CMS login is retained; local login
details are in ignored `.local/ADMIN.md`. Production bootstrap credentials are
not stored in the runtime environment.

## Automatic deployment

Workflow: `.github/workflows/deploy.yml`, displayed as **Deploy VPS** in
https://github.com/Paertner/paertner/actions . It runs after a push to `main`
and can also be started manually with `workflow_dispatch`.

GitHub Actions secrets:

- `VPS_SSH_KEY`: dedicated deployment private key, separate from the administrator key.
- `VPS_KNOWN_HOSTS`: the verified server host key.

The corresponding server-side public key uses `restrict` and the forced command
`/opt/paertner/deploy.sh` in `/root/.ssh/authorized_keys`. It cannot be used for an
interactive SSH shell, forwarding or arbitrary SSH commands. Deployment itself
executes code from the trusted `main` branch, so write access to that branch is
production access. Never expose these secrets to pull-request code.

The deploy script:

1. Acquires an exclusive lock and fetches the latest `origin/main`.
2. Builds `paertner:<SHA>` while the old application keeps running.
3. Stops the application briefly and snapshots the database and uploads.
4. Runs committed Payload migrations, then starts the new application.
5. Checks the home page for a successful HTTP response before recording success.
6. On migration/startup failure, restores the pre-release data and previous image.

Build failures leave the existing application running. Migration/startup can
cause a short service interruption. Concurrent pushes are serialized and each
deployment uses the latest main commit when it acquires the lock. Database,
uploads, production environment and private logos are never replaced by a Git pull.

The installed deployment script, Compose file and Caddyfile are deliberately
outside the checkout. Changes to `deploy/` in Git require an explicit server
installation and validation. Application code updates deploy automatically.

## Operational commands

Run on the VPS:

```bash
cd /opt/paertner
docker compose --env-file release.env -f compose.yml ps
docker compose --env-file release.env -f compose.yml logs --tail 100 app
docker compose --env-file release.env -f compose.yml logs --tail 100 proxy
cat deployed-sha
curl -I https://paertner.com
curl -I https://www.paertner.com
df -h /
free -m
```

Manual deploy: `/opt/paertner/deploy.sh`. It skips an already successful SHA.
For an intentional retry of the same SHA, preserve/rename `deployed-sha` before
rerunning. Do not use a destructive Git reset or replace shared data to retry.

For initial setup or installing reviewed infrastructure changes, copy the files
from `deploy/` to their installed paths above, set deploy.sh to mode 700, run
`bash -n /opt/paertner/deploy.sh`, then validate Compose and Caddy before restart.
Persistent data must be writable by container UID/GID 1000; app.env stays mode 600.

## Recovery and backups

Each deployment backup contains `data.tar.gz`, `app.env`, and (when there was a
previous release) `previous-image`. Failed deployment data is kept as `failed-data`.
Automatic rollback preserves that failed state for investigation.

For manual rollback, stop the application, keep the current data directory under
a new recovery name, restore the selected archive into `shared/data`, restore
ownership to `1000:1000`, set APP_IMAGE in release.env to the matching
previous-image, and start the app with Compose. Verify both public pages and admin
before returning traffic. Avoid starting an old image against a newer schema.

Backups are currently on this same VPS. They do not protect against loss of the
server. Keep an off-server backup before significant content/schema changes.
Commit-tagged images and backups accumulate; inspect disk use and preserve the
current image, rollback image and needed snapshots before any cleanup.

## Verification record

- SSH connection and server inventory checked on 2026-09-17.
- DNS A record observed pointing to the new VPS on 2026-09-17.
- Docker preflight build compiled application and TypeScript successfully.
- GitHub Actions encrypted deployment secrets installed with user approval.
- Restricted server-side deploy key and production environment installed with explicit user approval.
- Initial CMS import: 33 projects, 6 posts, 81 media records, 1 administrator; integrity and foreign-key checks passed.
- Initial application is live: canonical HTTPS returns 200, www HTTPS redirects with 301; Let's Encrypt certificates issued for both hostnames.
- End-to-end push-triggered workflow verification: pending.
