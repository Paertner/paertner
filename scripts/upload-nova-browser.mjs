import fs from 'node:fs/promises';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const base = process.env.MEDIA_IMPORT_URL || 'http://localhost:3000';
const login = await fetch(base + '/api/users/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.INITIAL_ADMIN_EMAIL, password: process.env.INITIAL_ADMIN_PASSWORD }),
});
if (!login.ok) throw new Error('Admin authentication failed: ' + login.status);
const { token } = await login.json();
const headers = { Authorization: 'JWT ' + token };
const response = await fetch(base + '/api/projects?where[slug][equals]=nova-refrigeration-appliance&depth=0', { headers });
if (!response.ok) throw new Error('Project lookup failed');
const project = (await response.json()).docs[0];
if (!project) throw new Error('Nova project not found');
await fs.mkdir('.local/content-backups', { recursive: true });
await fs.writeFile('.local/content-backups/nova-before-browser-' + Date.now() + '.json', JSON.stringify(project, null, 2));
const form = new FormData();
form.append('_payload', JSON.stringify({ alt: 'Nova appliance repair website on a laptop and phone in a sunlit kitchen with navy service cards and copper repair details' }));
form.append('file', new Blob([await fs.readFile('public/images/project-nova-kitchen-v1.png')], { type: 'image/png' }), 'project-nova-kitchen-v1.png');
const upload = await fetch(base + '/api/media', { method: 'POST', headers, body: form });
if (!upload.ok) throw new Error('Media upload failed: ' + upload.status);
const media = (await upload.json()).doc;
const update = await fetch(base + '/api/projects/' + project.id, {
  method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: media.id }),
});
if (!update.ok) throw new Error('Project update failed: ' + update.status);
console.log(JSON.stringify({ project: project.id, media: media.id, url: media.url }));
