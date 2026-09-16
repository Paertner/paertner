import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`author\` text,
  	\`published_at\` text,
  	\`image_id\` integer,
  	\`body\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`canonical_u_r_l\` text,
  	\`no_index\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_image_idx\` ON \`posts\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_seo_image_idx\` ON \`posts\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_author\` text,
  	\`version_published_at\` text,
  	\`version_image_id\` integer,
  	\`version_body\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_canonical_u_r_l\` text,
  	\`version_no_index\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_image_idx\` ON \`_posts_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_seo_image_idx\` ON \`_posts_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`canonical_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`no_index\` integer DEFAULT false;`)
  await db.run(sql`CREATE INDEX \`pages_image_idx\` ON \`pages\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_image_idx\` ON \`pages\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`canonical_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`no_index\` integer DEFAULT false;`)
  await db.run(sql`CREATE INDEX \`projects_seo_image_idx\` ON \`projects\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_canonical_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_no_index\` integer DEFAULT false;`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_seo_image_idx\` ON \`_projects_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`canonical_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`services\` ADD \`no_index\` integer DEFAULT false;`)
  await db.run(sql`CREATE INDEX \`services_seo_image_idx\` ON \`services\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_url\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_width\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_height\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_mime_type\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filesize\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filename\` text;`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`posts_id\` integer REFERENCES posts(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`hero_poster_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`studio_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site\` ADD \`social_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_hero_poster_idx\` ON \`site\` (\`hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`site_studio_image_idx\` ON \`site\` (\`studio_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_social_image_idx\` ON \`site\` (\`social_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_site_v\` ADD \`version_hero_poster_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_site_v\` ADD \`version_studio_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_site_v\` ADD \`version_social_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_site_v_version_version_hero_poster_idx\` ON \`_site_v\` (\`version_hero_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_v_version_version_studio_image_idx\` ON \`_site_v\` (\`version_studio_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_v_version_version_social_image_idx\` ON \`_site_v\` (\`version_social_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "slug", "title", "intro", "seo_title", "seo_description", "updated_at", "created_at") SELECT "id", "slug", "title", "intro", "seo_title", "seo_description", "updated_at", "created_at" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`descriptor\` text,
  	\`sector\` text,
  	\`year\` text,
  	\`order\` numeric DEFAULT 0,
  	\`featured\` integer,
  	\`concept\` integer DEFAULT true,
  	\`image_id\` integer,
  	\`art\` text DEFAULT 'portal',
  	\`tone\` text DEFAULT 'stone',
  	\`challenge\` text,
  	\`idea\` text,
  	\`execution\` text,
  	\`result\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_projects\`("id", "title", "slug", "descriptor", "sector", "year", "order", "featured", "concept", "image_id", "art", "tone", "challenge", "idea", "execution", "result", "seo_title", "seo_description", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "descriptor", "sector", "year", "order", "featured", "concept", "image_id", "art", "tone", "challenge", "idea", "execution", "result", "seo_title", "seo_description", "updated_at", "created_at", "_status" FROM \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_projects\` RENAME TO \`projects\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_image_idx\` ON \`projects\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__projects_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_descriptor\` text,
  	\`version_sector\` text,
  	\`version_year\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_featured\` integer,
  	\`version_concept\` integer DEFAULT true,
  	\`version_image_id\` integer,
  	\`version_art\` text DEFAULT 'portal',
  	\`version_tone\` text DEFAULT 'stone',
  	\`version_challenge\` text,
  	\`version_idea\` text,
  	\`version_execution\` text,
  	\`version_result\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__projects_v\`("id", "parent_id", "version_title", "version_slug", "version_descriptor", "version_sector", "version_year", "version_order", "version_featured", "version_concept", "version_image_id", "version_art", "version_tone", "version_challenge", "version_idea", "version_execution", "version_result", "version_seo_title", "version_seo_description", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_descriptor", "version_sector", "version_year", "version_order", "version_featured", "version_concept", "version_image_id", "version_art", "version_tone", "version_challenge", "version_idea", "version_execution", "version_result", "version_seo_title", "version_seo_description", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__projects_v\` RENAME TO \`_projects_v\`;`)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_image_idx\` ON \`_projects_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short\` text NOT NULL,
  	\`intro\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`number\` text,
  	\`art\` text,
  	\`image_id\` integer,
  	\`approach\` text,
  	\`outcome\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_services\`("id", "title", "slug", "short", "intro", "category", "number", "art", "image_id", "approach", "outcome", "seo_title", "seo_description", "updated_at", "created_at") SELECT "id", "title", "slug", "short", "intro", "category", "number", "art", "image_id", "approach", "outcome", "seo_title", "seo_description", "updated_at", "created_at" FROM \`services\`;`)
  await db.run(sql`DROP TABLE \`services\`;`)
  await db.run(sql`ALTER TABLE \`__new_services\` RENAME TO \`services\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_image_idx\` ON \`services\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`pages_id\` integer,
  	\`projects_id\` integer,
  	\`services_id\` integer,
  	\`media_id\` integer,
  	\`inquiries_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "pages_id", "projects_id", "services_id", "media_id", "inquiries_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "users_id", "pages_id", "projects_id", "services_id", "media_id", "inquiries_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_site\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content_version\` numeric,
  	\`method_title\` text,
  	\`name\` text NOT NULL,
  	\`tagline\` text,
  	\`hero_title\` text NOT NULL,
  	\`hero_description\` text NOT NULL,
  	\`intro_title\` text,
  	\`intro_body\` text,
  	\`convergence_title\` text,
  	\`convergence_body\` text,
  	\`work_title\` text,
  	\`work_description\` text,
  	\`studio_title\` text,
  	\`studio_body\` text,
  	\`cta_title\` text,
  	\`cta_body\` text,
  	\`email\` text,
  	\`booking_u_r_l\` text,
  	\`allow_indexing\` integer DEFAULT false,
  	\`privacy\` text,
  	\`terms\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site\`("id", "content_version", "method_title", "name", "tagline", "hero_title", "hero_description", "intro_title", "intro_body", "convergence_title", "convergence_body", "work_title", "work_description", "studio_title", "studio_body", "cta_title", "cta_body", "email", "booking_u_r_l", "allow_indexing", "privacy", "terms", "updated_at", "created_at") SELECT "id", "content_version", "method_title", "name", "tagline", "hero_title", "hero_description", "intro_title", "intro_body", "convergence_title", "convergence_body", "work_title", "work_description", "studio_title", "studio_body", "cta_title", "cta_body", "email", "booking_u_r_l", "allow_indexing", "privacy", "terms", "updated_at", "created_at" FROM \`site\`;`)
  await db.run(sql`DROP TABLE \`site\`;`)
  await db.run(sql`ALTER TABLE \`__new_site\` RENAME TO \`site\`;`)
  await db.run(sql`CREATE TABLE \`__new__site_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_content_version\` numeric,
  	\`version_method_title\` text,
  	\`version_name\` text NOT NULL,
  	\`version_tagline\` text,
  	\`version_hero_title\` text NOT NULL,
  	\`version_hero_description\` text NOT NULL,
  	\`version_intro_title\` text,
  	\`version_intro_body\` text,
  	\`version_convergence_title\` text,
  	\`version_convergence_body\` text,
  	\`version_work_title\` text,
  	\`version_work_description\` text,
  	\`version_studio_title\` text,
  	\`version_studio_body\` text,
  	\`version_cta_title\` text,
  	\`version_cta_body\` text,
  	\`version_email\` text,
  	\`version_booking_u_r_l\` text,
  	\`version_allow_indexing\` integer DEFAULT false,
  	\`version_privacy\` text,
  	\`version_terms\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new__site_v\`("id", "version_content_version", "version_method_title", "version_name", "version_tagline", "version_hero_title", "version_hero_description", "version_intro_title", "version_intro_body", "version_convergence_title", "version_convergence_body", "version_work_title", "version_work_description", "version_studio_title", "version_studio_body", "version_cta_title", "version_cta_body", "version_email", "version_booking_u_r_l", "version_allow_indexing", "version_privacy", "version_terms", "version_updated_at", "version_created_at", "created_at", "updated_at") SELECT "id", "version_content_version", "version_method_title", "version_name", "version_tagline", "version_hero_title", "version_hero_description", "version_intro_title", "version_intro_body", "version_convergence_title", "version_convergence_body", "version_work_title", "version_work_description", "version_studio_title", "version_studio_body", "version_cta_title", "version_cta_body", "version_email", "version_booking_u_r_l", "version_allow_indexing", "version_privacy", "version_terms", "version_updated_at", "version_created_at", "created_at", "updated_at" FROM \`_site_v\`;`)
  await db.run(sql`DROP TABLE \`_site_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__site_v\` RENAME TO \`_site_v\`;`)
  await db.run(sql`CREATE INDEX \`_site_v_created_at_idx\` ON \`_site_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_v_updated_at_idx\` ON \`_site_v\` (\`updated_at\`);`)
  await db.run(sql`DROP INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_url\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_width\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_height\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_mime_type\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filesize\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filename\`;`)
}
