import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "whatsapp_show" boolean DEFAULT true;
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "whatsapp_number" varchar DEFAULT '447453302323';
  ALTER TABLE "cafe_nova"."site_settings" ADD COLUMN "whatsapp_message" varchar DEFAULT 'Hi Cafe Nova, ';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "whatsapp_show";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "whatsapp_number";
  ALTER TABLE "cafe_nova"."site_settings" DROP COLUMN "whatsapp_message";`)
}
