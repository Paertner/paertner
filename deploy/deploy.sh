#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
cd /opt/paertner
exec 9>/opt/paertner/deploy.lock
flock -w 1800 9

# This entry point is installed separately from the checkout. SSH's forced
# command permits the Actions key to trigger only this deployment.
git -C repo fetch origin main
sha=$(git -C repo rev-parse origin/main)
if [[ -f deployed-sha ]] && [[ $(cat deployed-sha) == "$sha" ]]; then
    echo "Already deployed: $sha"
    exit 0
fi
git -C repo checkout --detach "$sha"
image="paertner:$sha"
docker build --build-arg NEXT_PUBLIC_SERVER_URL=https://paertner.com -t "$image" repo

previous=""
[[ ! -f release.env ]] || previous=$(sed -n 's/^APP_IMAGE=//p' release.env)
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/opt/paertner/backups/$stamp-$sha"
mkdir -p "$backup"
snapshot_ready=false
compose() { docker compose --env-file /opt/paertner/release.env -f /opt/paertner/compose.yml "$@"; }

rollback() {
    status=$?
    trap - ERR
    echo "Deployment failed; restoring pre-release data and application." >&2
    compose stop app || true
    if [[ "$snapshot_ready" == true ]]; then
        # Move the failed data aside; never delete CMS files on a failed release.
        mv shared/data "$backup/failed-data"
        mkdir shared/data
        tar -xzf "$backup/data.tar.gz" -C shared/data
        chown -R 1000:1000 shared/data
    fi
    if [[ -n "$previous" ]]; then
        printf 'APP_IMAGE=%s\n' "$previous" > release.env
        compose up -d --no-deps app || true
    fi
    exit "$status"
}

if [[ -n "$previous" ]]; then
    compose stop app
fi
printf 'APP_IMAGE=%s\n' "$image" > release.env
trap rollback ERR
# App is stopped while copying SQLite and uploads, so the snapshot is consistent.
tar -czf "$backup/data.tar.gz" -C shared/data .
snapshot_ready=true
cp shared/app.env "$backup/app.env"
[[ -z "$previous" ]] || printf '%s\n' "$previous" > "$backup/previous-image"
compose run --rm --no-deps app node node_modules/payload/bin.js migrate
compose up -d --no-deps app
healthy=false
for attempt in $(seq 1 60); do
    if curl --fail --silent --max-time 10 http://127.0.0.1:3000/ -o /dev/null; then
        healthy=true
        break
    fi
    sleep 2
done
[[ "$healthy" == true ]]
compose up -d --no-deps proxy
printf '%s\n' "$sha" > deployed-sha
trap - ERR
echo "Deployed successfully: $sha"
