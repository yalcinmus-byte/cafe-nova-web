import { applyV10Content } from '../seed/v10-content'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cafe_nova"."enum_offers_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TABLE "cafe_nova"."offers_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "cafe_nova"."enum_offers_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"active" boolean DEFAULT true,
  	"show_on_home" boolean DEFAULT true,
  	"discount" numeric,
  	"order" numeric DEFAULT 0,
  	"from" varchar,
  	"to" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cafe_nova"."offers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_categories_id" integer,
  	"menu_items_id" integer
  );
  
  ALTER TABLE "cafe_nova"."menu_items" ADD COLUMN "allergy_note" varchar;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD COLUMN "offers_id" integer;
  ALTER TABLE "cafe_nova"."offers_days" ADD CONSTRAINT "offers_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."offers_rels" ADD CONSTRAINT "offers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cafe_nova"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."offers_rels" ADD CONSTRAINT "offers_rels_menu_categories_fk" FOREIGN KEY ("menu_categories_id") REFERENCES "cafe_nova"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cafe_nova"."offers_rels" ADD CONSTRAINT "offers_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "cafe_nova"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offers_days_order_idx" ON "cafe_nova"."offers_days" USING btree ("order");
  CREATE INDEX "offers_days_parent_idx" ON "cafe_nova"."offers_days" USING btree ("parent_id");
  CREATE INDEX "offers_updated_at_idx" ON "cafe_nova"."offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "cafe_nova"."offers" USING btree ("created_at");
  CREATE INDEX "offers_rels_order_idx" ON "cafe_nova"."offers_rels" USING btree ("order");
  CREATE INDEX "offers_rels_parent_idx" ON "cafe_nova"."offers_rels" USING btree ("parent_id");
  CREATE INDEX "offers_rels_path_idx" ON "cafe_nova"."offers_rels" USING btree ("path");
  CREATE INDEX "offers_rels_menu_categories_id_idx" ON "cafe_nova"."offers_rels" USING btree ("menu_categories_id");
  CREATE INDEX "offers_rels_menu_items_id_idx" ON "cafe_nova"."offers_rels" USING btree ("menu_items_id");
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "cafe_nova"."offers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "cafe_nova"."payload_locked_documents_rels" USING btree ("offers_id");`)
  await applyV10Content(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."offers_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."offers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cafe_nova"."offers_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cafe_nova"."offers_days" CASCADE;
  DROP TABLE "cafe_nova"."offers" CASCADE;
  DROP TABLE "cafe_nova"."offers_rels" CASCADE;
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_offers_fk";
  
  DROP INDEX "cafe_nova"."payload_locked_documents_rels_offers_id_idx";
  ALTER TABLE "cafe_nova"."menu_items" DROP COLUMN "allergy_note";
  ALTER TABLE "cafe_nova"."payload_locked_documents_rels" DROP COLUMN "offers_id";
  DROP TYPE "cafe_nova"."enum_offers_days";`)
}
