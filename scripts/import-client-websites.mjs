import fs from 'node:fs/promises';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const base = process.env.MEDIA_IMPORT_URL || 'http://localhost:3000';
const projects = JSON.parse(await fs.readFile('scripts/content/client-website-projects.json', 'utf8'));
const login = await fetch(base + '/api/users/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: process.env.INITIAL_ADMIN_EMAIL, password: process.env.INITIAL_ADMIN_PASSWORD }),
});
if (!login.ok) throw new Error('Admin authentication failed: ' + login.status);
const { token } = await login.json();
async function api(route, options = {}) {
  const r = await fetch(base + '/api/' + route, { ...options, headers: { Authorization: 'JWT ' + token, ...options.headers } });
  if (!r.ok) throw new Error(route + ': ' + r.status + ' ' + (await r.text()).slice(0, 250));
  return r.json();
}
async function media(stem, alt) {
  const found = (await api('media?where[filename][equals]=' + encodeURIComponent(stem + '.webp') + '&limit=1')).docs[0];
  if (found) return found.id;
  const form = new FormData();
  form.append('_payload', JSON.stringify({ alt }));
  form.append('file', new Blob([await fs.readFile('public/images/' + stem + '.png')], { type: 'image/png' }), stem + '.png');
  return (await api('media', { method: 'POST', body: form })).doc.id;
}
await fs.mkdir('.local/content-backups', { recursive: true });
for (const { key, ...project } of projects) {
  const existing = (await api('projects?where[slug][equals]=' + project.slug + '&depth=0&limit=1')).docs[0];
  if (existing) await fs.writeFile('.local/content-backups/' + project.slug + '-' + Date.now() + '.json', JSON.stringify(existing, null, 2));
  const image = await media('project-' + key + '-studio-v1', project.title + ' website displayed on a laptop and phone in a contextual studio setting');
  const screens = [];
  for (const [section, caption] of [
    ['home', 'Homepage — brand introduction and navigation.'],
    ['about', 'About — company profile and capabilities.'],
    ['services', key === 'iensol' ? 'Product catalogue — categories and product discovery.' : key === 'veloxenergy' ? 'What we trade — commodity lines and product scope.' : 'Services — the offer, organized into clear categories.'],
    ['contact', 'Contact — the next step toward an enquiry.'],
  ]) screens.push({ image: await media('project-' + key + '-' + section, project.title + ': ' + caption), caption });
  const data = { ...project, image, screens, seoTitle: project.title + ' website design', seoDescription: project.descriptor + ' Explore the website design and selected screens in Paertner’s portfolio.' };
  await api(existing ? 'projects/' + existing.id : 'projects', {
    method: existing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  console.log('Published ' + project.title + ' with cover and ' + screens.length + ' gallery images.');
}
