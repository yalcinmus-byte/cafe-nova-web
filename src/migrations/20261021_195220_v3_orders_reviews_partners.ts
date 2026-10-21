import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cafe_nova"."enum_orders_status" AS ENUM('new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled');
  CREATE TYPE "cafe_nova"."enum_orders_fulfilment" AS ENUM('collection', 'delivery');
  CREATE TYPE "cafe_nova"."enum_orders_payment" AS ENUM('unpaid', 'paid', 'counter', 'refunded');
  CREATE TYPE "cafe_nova"."enum_enquiries_equipment" AS ENUM('sound', 'mic', 'projector', 'tv');
  CREATE TYPE "cafe_nova"."enum_reviews_source" AS ENUM('google', 'tripadvisor', 'other');
  CREATE TYPE "cafe_nova"."enum_themes_decor" AS ENUM('none', 'halloween', 'christmas', 'easter', 'summer');
  ALTER TYPE "cafe_nova"."enum_menu_categories_group" ADD VALUE 'shop';
  CREATE TABLE "cafe_nova"."orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar NOT NULL,
  	"qty" numeric NOT NULL,
  	"unit_price" numeric NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ref" varchar NOT NULL,
  	"status" "cafe_nova"."enum_orders_status" DEFAULT 'new' NOT NULL,
  	"fulfilment" "cafe_nova"."enum_orders_fulfilment" NOT NULL,
  	"slot" timestamp(3) with time zone,
  	"subtotal" numeric NOT NULL,
  	"delivery_fee" numeric DEFAULT 0,
  	"total" numeric NOT NULL,
  	"payment" "cafe_nova"."enum_orders_payment" DEFAULT 'unpaid' NOT NULL,
  	"stripe_session" varchar,
  	"customer_name" varchar NOT NULL,
  	"customer_phone" varchar NOT NULL,
  	"customer_email" varchar NOT NULL,
  	"customer_address" varchar,
  	"customer_postcode" varchar,
  	"notes" varchar,
  	"token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."enquiries_equipment" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cafe_nova"."enum_enquiries_equipment",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"quote" varchar NOT NULL,
  	"author" varchar NOT NULL,
  	"source" "cafe_nova"."enum_reviews_source" NOT NULL,
  	"date" timestamp(3) with time zone,
  	"url" varchar,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"description" varchar,
  	"url" varchar,
  	"logo_id" integer,
  	"show_on_site" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cafe_nova"."enquiries" ADD COLUMN "start_time" varchar;
  ALTER TABLE "cafe_nova"."enquiries" ADD COLUMN "occasion" varchar;
  ALTER TABLE "cafe_nova"."events" ADD COLUMN "date_note" varchar;
  ALTER TABLE "cafe_nova"."themes" ADD COLUMN "decor" "cafe_nova"."enum_themes_decor" DEFAULT 'none';
  ALTER TABLE "cafe_nova"."themes" ADD COLUMN "banner_link" varchar;
  ALTER TABLE "cafe_nova"."themes" ADD COLUMN "headline" varchar;
  ALTER TABLE "cafe_nova"."themes" ADD COLUMN "blurb" varchar;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "orders_id" integer;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "first_slot" varchar DEFAULT '08:30';
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "last_slot" varchar DEFAULT '16:15';
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "prep_minutes" numeric DEFAULT 20;
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "pay_at_counter" boolean DEFAULT true;
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "delivery_fee" numeric DEFAULT 3.5;
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "delivery_minimum" numeric DEFAULT 15;
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "delivery_postcodes" varchar DEFAULT 'TW1, TW2, TW9, TW10';
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "content_version" numeric DEFAULT 0;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "reviews_tripadvisor_count" numeric;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "reviews_tripadvisor_rank" varchar;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "links_staycation" varchar;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "links_my_richmond" varchar;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "links_facebook" varchar;
  ALTER TABLE "cafe_nova"."orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cafe_nova"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."enquiries_equipment" ADD CONSTRAINT "enquiries_equipment_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "orders_items_order_idx" ON "cafe_nova"."orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "cafe_nova"."orders_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_ref_idx" ON "cafe_nova"."orders" USING btree ("ref");
  CREATE INDEX "orders_updated_at_idx" ON "cafe_nova"."orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "cafe_nova"."orders" USING btree ("created_at");
  CREATE INDEX "enquiries_equipment_order_idx" ON "cafe_nova"."enquiries_equipment" USING btree ("order");
  CREATE INDEX "enquiries_equipment_parent_idx" ON "cafe_nova"."enquiries_equipment" USING btree ("parent_id");
  CREATE INDEX "reviews_updated_at_idx" ON "cafe_nova"."reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "cafe_nova"."reviews" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "cafe_nova"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "cafe_nova"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "cafe_nova"."partners" USING btree ("created_at");
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "cafe_nova"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "cafe_nova"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "cafe_nova"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("partners_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."orders_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."orders" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."enquiries_equipment" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."partners" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cafe_nova"."orders_items" CASCADE;
  DROP TABLE "cafe_nova"."orders" CASCADE;
  DROP TABLE "cafe_nova"."enquiries_equipment" CASCADE;
  DROP TABLE "cafe_nova"."reviews" CASCADE;
  DROP TABLE "cafe_nova"."partners" CASCADE;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_orders_fk";
  
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reviews_fk";
  
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "cafe_nova"."menu_categories" ALTER COLUMN "group" SET DATA TYPE text;
  ALTER TABLE "cafe_nova"."menu_categories" ALTER COLUMN "group" SET DEFAULT 'breakfast'::text;
  DROP TYPE "cafe_nova"."enum_menu_categories_group";
  CREATE TYPE "cafe_nova"."enum_menu_categories_group" AS ENUM('breakfast', 'turkish', 'lunch', 'sweet', 'drinks', 'kids');
  ALTER TABLE "cafe_nova"."menu_categories" ALTER COLUMN "group" SET DEFAULT 'breakfast'::"cafe_nova"."enum_menu_categories_group";
  ALTER TABLE "cafe_nova"."menu_categories" ALTER COLUMN "group" SET DATA TYPE "cafe_nova"."enum_menu_categories_group" USING "group"::"cafe_nova"."enum_menu_categories_group";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_orders_id_idx";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_reviews_id_idx";
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_partners_id_idx";
  ALTER TABLE "cafe_nova"."enquiries" DROP COLUMN "start_time";
  ALTER TABLE "cafe_nova"."enquiries" DROP COLUMN "occasion";
  ALTER TABLE "cafe_nova"."events" DROP COLUMN "date_note";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "decor";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "banner_link";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "headline";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "blurb";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "orders_id";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "first_slot";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "last_slot";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "prep_minutes";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "pay_at_counter";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "delivery_fee";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "delivery_minimum";
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "delivery_postcodes";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "content_version";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "reviews_tripadvisor_count";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "reviews_tripadvisor_rank";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "links_staycation";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "links_my_richmond";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "links_facebook";
  DROP TYPE "cafe_nova"."enum_orders_status";
  DROP TYPE "cafe_nova"."enum_orders_fulfilment";
  DROP TYPE "cafe_nova"."enum_orders_payment";
  DROP TYPE "cafe_nova"."enum_enquiries_equipment";
  DROP TYPE "cafe_nova"."enum_reviews_source";
  DROP TYPE "cafe_nova"."enum_themes_decor";`)
}
