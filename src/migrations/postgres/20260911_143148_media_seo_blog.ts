import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'home' BEFORE 'work';
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'studio' BEFORE 'book';
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'privacy';
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'terms';
  ALTER TYPE "public"."enum_pages_slug" ADD VALUE 'blog';
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"image_id" integer,
  	"body" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"canonical_u_r_l" varchar,
  	"no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_author" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_body" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_canonical_u_r_l" varchar,
  	"version_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "pages" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "canonical_u_r_l" varchar;
  ALTER TABLE "pages" ADD COLUMN "no_index" boolean DEFAULT false;
  ALTER TABLE "projects" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "projects" ADD COLUMN "canonical_u_r_l" varchar;
  ALTER TABLE "projects" ADD COLUMN "no_index" boolean DEFAULT false;
  ALTER TABLE "_projects_v" ADD COLUMN "version_seo_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_canonical_u_r_l" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_no_index" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "seo_image_id" integer;
  ALTER TABLE "services" ADD COLUMN "canonical_u_r_l" varchar;
  ALTER TABLE "services" ADD COLUMN "no_index" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "site" ADD COLUMN "hero_poster_id" integer;
  ALTER TABLE "site" ADD COLUMN "studio_image_id" integer;
  ALTER TABLE "site" ADD COLUMN "social_image_id" integer;
  ALTER TABLE "_site_v" ADD COLUMN "version_hero_poster_id" integer;
  ALTER TABLE "_site_v" ADD COLUMN "version_studio_image_id" integer;
  ALTER TABLE "_site_v" ADD COLUMN "version_social_image_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_image_idx" ON "posts" USING btree ("image_id");
  CREATE INDEX "posts_seo_image_idx" ON "posts" USING btree ("seo_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_image_idx" ON "_posts_v" USING btree ("version_image_id");
  CREATE INDEX "_posts_v_version_version_seo_image_idx" ON "_posts_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_hero_poster_id_media_id_fk" FOREIGN KEY ("hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_studio_image_id_media_id_fk" FOREIGN KEY ("studio_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_social_image_id_media_id_fk" FOREIGN KEY ("social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_v" ADD CONSTRAINT "_site_v_version_hero_poster_id_media_id_fk" FOREIGN KEY ("version_hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_v" ADD CONSTRAINT "_site_v_version_studio_image_id_media_id_fk" FOREIGN KEY ("version_studio_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_v" ADD CONSTRAINT "_site_v_version_social_image_id_media_id_fk" FOREIGN KEY ("version_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_image_idx" ON "pages" USING btree ("image_id");
  CREATE INDEX "pages_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "projects_seo_image_idx" ON "projects" USING btree ("seo_image_id");
  CREATE INDEX "_projects_v_version_version_seo_image_idx" ON "_projects_v" USING btree ("version_seo_image_id");
  CREATE INDEX "services_seo_image_idx" ON "services" USING btree ("seo_image_id");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "site_hero_poster_idx" ON "site" USING btree ("hero_poster_id");
  CREATE INDEX "site_studio_image_idx" ON "site" USING btree ("studio_image_id");
  CREATE INDEX "site_social_image_idx" ON "site" USING btree ("social_image_id");
  CREATE INDEX "_site_v_version_version_hero_poster_idx" ON "_site_v" USING btree ("version_hero_poster_id");
  CREATE INDEX "_site_v_version_version_studio_image_idx" ON "_site_v" USING btree ("version_studio_image_id");
  CREATE INDEX "_site_v_version_version_social_image_idx" ON "_site_v" USING btree ("version_social_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_seo_image_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_seo_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_seo_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_seo_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_hero_poster_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_studio_image_id_media_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_social_image_id_media_id_fk";
  
  ALTER TABLE "_site_v" DROP CONSTRAINT "_site_v_version_hero_poster_id_media_id_fk";
  
  ALTER TABLE "_site_v" DROP CONSTRAINT "_site_v_version_studio_image_id_media_id_fk";
  
  ALTER TABLE "_site_v" DROP CONSTRAINT "_site_v_version_social_image_id_media_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_slug";
  CREATE TYPE "public"."enum_pages_slug" AS ENUM('work', 'services', 'book');
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE "public"."enum_pages_slug" USING "slug"::"public"."enum_pages_slug";
  DROP INDEX "pages_image_idx";
  DROP INDEX "pages_seo_image_idx";
  DROP INDEX "projects_seo_image_idx";
  DROP INDEX "_projects_v_version_version_seo_image_idx";
  DROP INDEX "services_seo_image_idx";
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "site_hero_poster_idx";
  DROP INDEX "site_studio_image_idx";
  DROP INDEX "site_social_image_idx";
  DROP INDEX "_site_v_version_version_hero_poster_idx";
  DROP INDEX "_site_v_version_version_studio_image_idx";
  DROP INDEX "_site_v_version_version_social_image_idx";
  ALTER TABLE "pages" DROP COLUMN "image_id";
  ALTER TABLE "pages" DROP COLUMN "seo_image_id";
  ALTER TABLE "pages" DROP COLUMN "canonical_u_r_l";
  ALTER TABLE "pages" DROP COLUMN "no_index";
  ALTER TABLE "projects" DROP COLUMN "seo_image_id";
  ALTER TABLE "projects" DROP COLUMN "canonical_u_r_l";
  ALTER TABLE "projects" DROP COLUMN "no_index";
  ALTER TABLE "_projects_v" DROP COLUMN "version_seo_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_canonical_u_r_l";
  ALTER TABLE "_projects_v" DROP COLUMN "version_no_index";
  ALTER TABLE "services" DROP COLUMN "seo_image_id";
  ALTER TABLE "services" DROP COLUMN "canonical_u_r_l";
  ALTER TABLE "services" DROP COLUMN "no_index";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "site" DROP COLUMN "hero_poster_id";
  ALTER TABLE "site" DROP COLUMN "studio_image_id";
  ALTER TABLE "site" DROP COLUMN "social_image_id";
  ALTER TABLE "_site_v" DROP COLUMN "version_hero_poster_id";
  ALTER TABLE "_site_v" DROP COLUMN "version_studio_image_id";
  ALTER TABLE "_site_v" DROP COLUMN "version_social_image_id";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";`)
}
