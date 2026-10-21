import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cafe_nova"."enum_enquiries_kind" AS ENUM('general', 'event', 'careers');
  CREATE TYPE "cafe_nova"."enum_enquiries_status" AS ENUM('new', 'replied', 'booked', 'closed');
  CREATE TYPE "cafe_nova"."enum_menu_items_dietary" AS ENUM('v', 'vg', 'gf');
  CREATE TYPE "cafe_nova"."enum_menu_items_allergens" AS ENUM('celery', 'cereals containing gluten', 'crustaceans', 'eggs', 'fish', 'lupin', 'milk', 'molluscs', 'mustard', 'peanuts', 'sesame', 'soya', 'sulphites', 'tree nuts');
  CREATE TYPE "cafe_nova"."enum_menu_categories_group" AS ENUM('breakfast', 'turkish', 'lunch', 'sweet', 'drinks', 'kids');
  CREATE TYPE "cafe_nova"."enum_events_kind" AS ENUM('nova', 'nearby');
  CREATE TYPE "cafe_nova"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "cafe_nova"."enum_jobs_hours" AS ENUM('full-time', 'part-time', 'weekends', 'seasonal');
  CREATE TYPE "cafe_nova"."enum_themes_mode" AS ENUM('auto', 'on', 'off');
  CREATE TYPE "cafe_nova"."enum_users_role" AS ENUM('owner', 'manager', 'staff');
  CREATE TYPE "cafe_nova"."enum_service_control_marketplaces_name" AS ENUM('Deliveroo', 'Uber Eats', 'Just Eat');
  CREATE TABLE "cafe_nova"."enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "cafe_nova"."enum_enquiries_kind" DEFAULT 'general' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"date" timestamp(3) with time zone,
  	"guests" numeric,
  	"message" varchar NOT NULL,
  	"status" "cafe_nova"."enum_enquiries_status" DEFAULT 'new',
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."menu_items_dietary" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cafe_nova"."enum_menu_items_dietary",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."menu_items_allergens" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cafe_nova"."enum_menu_items_allergens",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"local_name" varchar,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"price" numeric,
  	"category_id" integer NOT NULL,
  	"order" numeric DEFAULT 0,
  	"available" boolean DEFAULT true,
  	"signature" boolean,
  	"orderable" boolean,
  	"extras" varchar,
  	"photo_id" integer,
  	"photo_path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."menu_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"group" "cafe_nova"."enum_menu_categories_group" DEFAULT 'breakfast' NOT NULL,
  	"note" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"ends_at" timestamp(3) with time zone,
  	"kind" "cafe_nova"."enum_events_kind" DEFAULT 'nova',
  	"highlight" boolean,
  	"summary" varchar,
  	"link" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "cafe_nova"."enum_posts_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"cover_path" varchar,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"open" boolean DEFAULT true,
  	"hours" "cafe_nova"."enum_jobs_hours",
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar
  );
  
  CREATE TABLE "cafe_nova"."themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"mode" "cafe_nova"."enum_themes_mode" DEFAULT 'auto',
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"accent" varchar DEFAULT '#B23A3A',
  	"banner" varchar,
  	"priority" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "cafe_nova"."enum_users_role" DEFAULT 'staff',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "cafe_nova"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"enquiries_id" integer,
  	"menu_items_id" integer,
  	"menu_categories_id" integer,
  	"events_id" integer,
  	"posts_id" integer,
  	"jobs_id" integer,
  	"media_id" integer,
  	"themes_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "cafe_nova"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "cafe_nova"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."service_control_marketplaces" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" "cafe_nova"."enum_service_control_marketplaces_name" NOT NULL,
  	"url" varchar,
  	"show_on_site" boolean DEFAULT false
  );
  
  CREATE TABLE "cafe_nova"."service_control" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"emergency_pause" boolean,
  	"pause_message" varchar DEFAULT 'We are not taking online orders right now — come and see us instead.',
  	"direct_ordering" boolean DEFAULT false,
  	"collection" boolean DEFAULT true,
  	"delivery" boolean DEFAULT false,
  	"coffee_shop" boolean DEFAULT true,
  	"slot_capacity" numeric DEFAULT 6,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cafe_nova"."site_settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."site_settings_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"link" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "cafe_nova"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Cafe Nova Bistro',
  	"address" varchar DEFAULT '424 Richmond Road
  East Twickenham, Twickenham',
  	"phone" varchar,
  	"email" varchar,
  	"announcement" varchar,
  	"reviews_google_rating" numeric,
  	"reviews_google_count" numeric,
  	"reviews_as_of" timestamp(3) with time zone,
  	"links_google_maps" varchar,
  	"links_tripadvisor" varchar,
  	"links_fsa" varchar,
  	"links_instagram" varchar,
  	"links_wanderlog" varchar,
  	"links_visit_richmond" varchar,
  	"links_pawpal" varchar,
  	"links_tiktok" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "cafe_nova"."menu_items_dietary" ADD CONSTRAINT "menu_items_dietary_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."menu_items_allergens" ADD CONSTRAINT "menu_items_allergens_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."menu_items" ADD CONSTRAINT "menu_items_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "cafe_nova"."menu_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."menu_items" ADD CONSTRAINT "menu_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."events" ADD CONSTRAINT "events_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cafe_nova"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "cafe_nova"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_categories_fk" FOREIGN KEY ("menu_categories_id") REFERENCES "cafe_nova"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "cafe_nova"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "cafe_nova"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "cafe_nova"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cafe_nova"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "cafe_nova"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cafe_nova"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "cafe_nova"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."service_control_marketplaces" ADD CONSTRAINT "service_control_marketplaces_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."service_control"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."site_settings_hours" ADD CONSTRAINT "site_settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."site_settings_facilities" ADD CONSTRAINT "site_settings_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "enquiries_updated_at_idx" ON "cafe_nova"."enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "cafe_nova"."enquiries" USING btree ("created_at");
  CREATE INDEX "menu_items_dietary_order_idx" ON "cafe_nova"."menu_items_dietary" USING btree ("order");
  CREATE INDEX "menu_items_dietary_parent_idx" ON "cafe_nova"."menu_items_dietary" USING btree ("parent_id");
  CREATE INDEX "menu_items_allergens_order_idx" ON "cafe_nova"."menu_items_allergens" USING btree ("order");
  CREATE INDEX "menu_items_allergens_parent_idx" ON "cafe_nova"."menu_items_allergens" USING btree ("parent_id");
  CREATE UNIQUE INDEX "menu_items_slug_idx" ON "cafe_nova"."menu_items" USING btree ("slug");
  CREATE INDEX "menu_items_category_idx" ON "cafe_nova"."menu_items" USING btree ("category_id");
  CREATE INDEX "menu_items_photo_idx" ON "cafe_nova"."menu_items" USING btree ("photo_id");
  CREATE INDEX "menu_items_updated_at_idx" ON "cafe_nova"."menu_items" USING btree ("updated_at");
  CREATE INDEX "menu_items_created_at_idx" ON "cafe_nova"."menu_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_categories_slug_idx" ON "cafe_nova"."menu_categories" USING btree ("slug");
  CREATE INDEX "menu_categories_updated_at_idx" ON "cafe_nova"."menu_categories" USING btree ("updated_at");
  CREATE INDEX "menu_categories_created_at_idx" ON "cafe_nova"."menu_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_slug_idx" ON "cafe_nova"."events" USING btree ("slug");
  CREATE INDEX "events_photo_idx" ON "cafe_nova"."events" USING btree ("photo_id");
  CREATE INDEX "events_updated_at_idx" ON "cafe_nova"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "cafe_nova"."events" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "cafe_nova"."posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "cafe_nova"."posts" USING btree ("cover_id");
  CREATE INDEX "posts_updated_at_idx" ON "cafe_nova"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "cafe_nova"."posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "jobs_slug_idx" ON "cafe_nova"."jobs" USING btree ("slug");
  CREATE INDEX "jobs_updated_at_idx" ON "cafe_nova"."jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "cafe_nova"."jobs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "cafe_nova"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "cafe_nova"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "cafe_nova"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "cafe_nova"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "cafe_nova"."media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "themes_updated_at_idx" ON "cafe_nova"."themes" USING btree ("updated_at");
  CREATE INDEX "themes_created_at_idx" ON "cafe_nova"."themes" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "cafe_nova"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "cafe_nova"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "cafe_nova"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "cafe_nova"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "cafe_nova"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "cafe_nova"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "cafe_nova"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "cafe_nova"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "cafe_nova"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_menu_categories_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("menu_categories_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_themes_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "cafe_nova"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "cafe_nova"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "cafe_nova"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "cafe_nova"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "cafe_nova"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "cafe_nova"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "cafe_nova"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "cafe_nova"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "cafe_nova"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "service_control_marketplaces_order_idx" ON "cafe_nova"."service_control_marketplaces" USING btree ("_order");
  CREATE INDEX "service_control_marketplaces_parent_id_idx" ON "cafe_nova"."service_control_marketplaces" USING btree ("_parent_id");
  CREATE INDEX "site_settings_hours_order_idx" ON "cafe_nova"."site_settings_hours" USING btree ("_order");
  CREATE INDEX "site_settings_hours_parent_id_idx" ON "cafe_nova"."site_settings_hours" USING btree ("_parent_id");
  CREATE INDEX "site_settings_facilities_order_idx" ON "cafe_nova"."site_settings_facilities" USING btree ("_order");
  CREATE INDEX "site_settings_facilities_parent_id_idx" ON "cafe_nova"."site_settings_facilities" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cafe_nova"."enquiries" CASCADE;
  DROP TABLE "cafe_nova"."menu_items_dietary" CASCADE;
  DROP TABLE "cafe_nova"."menu_items_allergens" CASCADE;
  DROP TABLE "cafe_nova"."menu_items" CASCADE;
  DROP TABLE "cafe_nova"."menu_categories" CASCADE;
  DROP TABLE "cafe_nova"."events" CASCADE;
  DROP TABLE "cafe_nova"."posts" CASCADE;
  DROP TABLE "cafe_nova"."jobs" CASCADE;
  DROP TABLE "cafe_nova"."media" CASCADE;
  DROP TABLE "cafe_nova"."themes" CASCADE;
  DROP TABLE "cafe_nova"."users_sessions" CASCADE;
  DROP TABLE "cafe_nova"."users" CASCADE;
  DROP TABLE "cafe_nova"."payload_kv" CASCADE;
  DROP TABLE "cafe_nova"."payload_locked_documents" CASCADE;
  DROP TABLE "cafe_nova"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "cafe_nova"."payload_preferences" CASCADE;
  DROP TABLE "cafe_nova"."payload_preferences_rels" CASCADE;
  DROP TABLE "cafe_nova"."payload_migrations" CASCADE;
  DROP TABLE "cafe_nova"."service_control_marketplaces" CASCADE;
  DROP TABLE "cafe_nova"."service_control" CASCADE;
  DROP TABLE "cafe_nova"."site_settings_hours" CASCADE;
  DROP TABLE "cafe_nova"."site_settings_facilities" CASCADE;
  DROP TABLE "cafe_nova"."site_settings" CASCADE;
  DROP TYPE "cafe_nova"."enum_enquiries_kind";
  DROP TYPE "cafe_nova"."enum_enquiries_status";
  DROP TYPE "cafe_nova"."enum_menu_items_dietary";
  DROP TYPE "cafe_nova"."enum_menu_items_allergens";
  DROP TYPE "cafe_nova"."enum_menu_categories_group";
  DROP TYPE "cafe_nova"."enum_events_kind";
  DROP TYPE "cafe_nova"."enum_posts_status";
  DROP TYPE "cafe_nova"."enum_jobs_hours";
  DROP TYPE "cafe_nova"."enum_themes_mode";
  DROP TYPE "cafe_nova"."enum_users_role";
  DROP TYPE "cafe_nova"."enum_service_control_marketplaces_name";`)
}
