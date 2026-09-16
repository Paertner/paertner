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
async function api(route, method = 'GET', data) {
  const r = await fetch(base + '/api/' + route, { method, headers: { Authorization: 'JWT ' + token, 'Content-Type': 'application/json' }, body: data ? JSON.stringify(data) : undefined });
  if (!r.ok) throw new Error(route + ': ' + r.status);
  return r.json();
}
const projects = (await api('projects?limit=100&depth=0')).docs;
await fs.mkdir('.local/content-backups', { recursive: true });
await fs.writeFile('.local/content-backups/portfolio-curation-' + Date.now() + '.json', JSON.stringify(projects, null, 2));
for (const p of projects) {
  if (p.concept) await api('projects/' + p.id, 'PATCH', { _status: 'draft', featured: false });
  if (p.slug === 'equipo-group') await api('projects/' + p.id, 'PATCH', { order: -0.9, featured: true });
  if (p.slug === 'luxora-nova') await api('projects/' + p.id, 'PATCH', { order: -0.6, featured: true });
}
const intro = 'Selected client work across strategy, design, and digital experiences.';
const page = (await api('pages?where[slug][equals]=work&limit=1')).docs[0];
if (page) await api('pages/' + page.id, 'PATCH', { intro, seoDescription: 'Explore Paertner’s client websites in web design and development.' });
await api('globals/site', 'POST', { workDescription: intro });
console.log('EQUIPO and Luxora Nova positions swapped. Placeholder projects unpublished.');
