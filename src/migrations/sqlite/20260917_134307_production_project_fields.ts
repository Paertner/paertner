import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projects_details\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`eyebrow\` text,
    \`title\` text,
    \`body\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_details_order_idx\` ON \`projects_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_details_parent_id_idx\` ON \`projects_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_screens\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`caption\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_screens_order_idx\` ON \`projects_screens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_screens_parent_id_idx\` ON \`projects_screens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_screens_image_idx\` ON \`projects_screens\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_details\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`eyebrow\` text,
    \`title\` text,
    \`body\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_details_order_idx\` ON \`_projects_v_version_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_details_parent_id_idx\` ON \`_projects_v_version_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_screens\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer,
    \`caption\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_screens_order_idx\` ON \`_projects_v_version_screens\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_screens_parent_id_idx\` ON \`_projects_v_version_screens\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_screens_image_idx\` ON \`_projects_v_version_screens\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`projects\` ADD \`live_u_r_l\` text;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version_live_u_r_l\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`projects_details\`;`)
  await db.run(sql`DROP TABLE \`projects_screens\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_details\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_screens\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`live_u_r_l\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version_live_u_r_l\`;`)
}
