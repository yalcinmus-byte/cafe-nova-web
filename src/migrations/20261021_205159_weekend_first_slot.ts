import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."service_control" ALTER COLUMN "first_slot" SET DEFAULT '07:30';
  ALTER TABLE "cafe_nova"."service_control" ADD COLUMN "weekend_first_slot" varchar DEFAULT '08:30';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."service_control" ALTER COLUMN "first_slot" SET DEFAULT '08:30';
  ALTER TABLE "cafe_nova"."service_control" DROP COLUMN "weekend_first_slot";`)
}
