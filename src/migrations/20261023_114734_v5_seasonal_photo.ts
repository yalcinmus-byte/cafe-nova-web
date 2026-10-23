import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."themes" ADD COLUMN "image_id" integer;
  ALTER TABLE "cafe_nova"."themes" ADD COLUMN "image_path" varchar;
  ALTER TABLE "cafe_nova"."themes" ADD CONSTRAINT "themes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "cafe_nova"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "themes_image_idx" ON "cafe_nova"."themes" USING btree ("image_id");`)

  // Halloween photo supplied by Yalcin (23 Oct 2026); Alchemy Opus Espresso added to coffee to take home (alchemycoffee.co.uk, 250g from £13).
  await db.execute(sql`
  UPDATE "cafe_nova"."themes" SET "image_path" = '/img/seasonal/halloween.webp' WHERE "name" = 'Halloween' AND "image_path" IS NULL;
  INSERT INTO "cafe_nova"."menu_items" ("name", "slug", "description", "price", "category_id", "order", "available", "orderable", "in_shop", "signature", "photo_path")
    SELECT 'Alchemy Coffee — Opus Espresso', 'alchemy-coffee-opus-espresso', 'Alchemy’s Opus espresso blend: dark chocolate, Brazil nut and red apple. 250g whole beans.', 13, c."id", -1, true, true, true, false, NULL
    FROM "cafe_nova"."menu_categories" c WHERE c."slug" = 'coffee-to-take-home'
    AND NOT EXISTS (SELECT 1 FROM "cafe_nova"."menu_items" WHERE "slug" = 'alchemy-coffee-opus-espresso');`)

}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."themes" DROP CONSTRAINT "themes_image_id_media_id_fk";
  
  DROP INDEX "cafe_nova"."themes_image_idx";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "image_id";
  ALTER TABLE "cafe_nova"."themes" DROP COLUMN "image_path";`)
}
