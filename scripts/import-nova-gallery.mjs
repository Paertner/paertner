import fs from 'node:fs/promises';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const base = process.env.MEDIA_IMPORT_URL || 'http://localhost:3000';
const login = await fetch(base + '/api/users/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.INITIAL_ADMIN_EMAIL, password: process.env.INITIAL_ADMIN_PASSWORD }),
});
if (!login.ok) throw new Error('Authentication failed');
const { token } = await login.json();
const headers = { Authorization: 'JWT ' + token };
async function api(route, options = {}) {
  const r = await fetch(base + '/api/' + route, { ...options, headers: { ...headers, ...options.headers } });
  if (!r.ok) throw new Error(route + ': ' + r.status);
  return r.json();
}
const project = (await api('projects?where[slug][equals]=nova-refrigeration-appliance&depth=0')).docs[0];
if (!project) throw new Error('Nova project missing');
await fs.mkdir('.local/content-backups', { recursive: true });
await fs.writeFile('.local/content-backups/nova-gallery-' + Date.now() + '.json', JSON.stringify(project, null, 2));
const additions = [];
for (const [name, caption, alt] of [
  ['homepage', 'Homepage — urgent-service messaging and direct contact paths.', 'Nova appliance repair homepage with same-day service actions'],
  ['services', 'Services — focused appliance categories and refrigeration expertise.', 'Nova appliance repair services page and service-card system'],
  ['about', 'About — expertise and customer reassurance.', 'Nova About page with refrigeration expertise and direct service actions'],
  ['areas', 'Service areas — local coverage across the Austin metro.', 'Nova service areas page with links to twelve Austin-area communities'],
  ['contact', 'Contact — a clear path to requesting a repair.', 'Nova contact page with repair request fields and contact details'],
]) {
  const stem = 'project-nova-' + name + '-gallery' + (['homepage', 'services', 'about'].includes(name) ? '-v2' : '');
  let media = (await api('media?where[filename][equals]=' + stem + '.webp&limit=1')).docs[0];
  if (!media) {
    const form = new FormData();
    form.append('_payload', JSON.stringify({ alt }));
    form.append('file', new Blob([await fs.readFile('public/images/' + stem + '.png')], { type: 'image/png' }), stem + '.png');
    media = (await api('media', { method: 'POST', body: form })).doc;
  }
  additions.push({ image: media.id, caption });
}
await api('projects/' + project.id, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ screens: additions }),
});
console.log('Nova gallery updated: 5 screens; main image preserved.');
