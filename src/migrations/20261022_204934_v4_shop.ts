import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."menu_items" ADD COLUMN "in_shop" boolean;`)

  // Launch settings agreed with Yalcin (22 Oct 2026): online ordering on (pick-up, pay at the counter),
  // delivery-app tiles shown, Google-listed hours and phone, and the dishes featured in the homepage shop.
  await db.execute(sql`
  UPDATE "cafe_nova"."menu_items" SET "in_shop" = true WHERE "slug" IN (
    'istanbul-special-breakfast','full-english-breakfast','turkish-eggs','shakshuka-with-eggs','smashed-avocado-on-toast',
    'eggs-royale','two-american-pancakes','hot-mezze-platter','roasted-mixed-vegetables-plate','meatball-wrap','chef-s-salad',
    'cigar-borek','latte','flat-white','turkish-tea','alchemy-coffee-kenya-nandi-ab');
  UPDATE "cafe_nova"."menu_items" SET "orderable" = true WHERE "orderable" IS NULL;
  UPDATE "cafe_nova"."service_control" SET "direct_ordering" = true, "collection" = true, "pay_at_counter" = true,
    "first_slot" = '07:30', "weekend_first_slot" = '08:30', "last_slot" = COALESCE("last_slot", '16:15');
  UPDATE "cafe_nova"."service_control_marketplaces" SET "show_on_site" = true;
  UPDATE "cafe_nova"."site_settings" SET "phone" = COALESCE(NULLIF("phone", ''), '07453 302323'),
    "address" = E'424 Richmond Road\nEast Twickenham, Twickenham TW1 2EB';
  DELETE FROM "cafe_nova"."site_settings_hours" WHERE "days" = 'Every day';
  INSERT INTO "cafe_nova"."site_settings_hours" ("_order", "_parent_id", "id", "days", "time")
    SELECT 1, s."id", substr(md5(random()::text), 1, 24), 'Monday – Friday', '7am – 5pm' FROM "cafe_nova"."site_settings" s
    WHERE NOT EXISTS (SELECT 1 FROM "cafe_nova"."site_settings_hours");
  INSERT INTO "cafe_nova"."site_settings_hours" ("_order", "_parent_id", "id", "days", "time")
    SELECT 2, s."id", substr(md5(random()::text), 1, 24), 'Saturday & Sunday', '8am – 5pm' FROM "cafe_nova"."site_settings" s
    WHERE (SELECT count(*) FROM "cafe_nova"."site_settings_hours") = 1;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."menu_items" DROP COLUMN "in_shop";`)
}
