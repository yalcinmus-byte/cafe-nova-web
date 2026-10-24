import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."homepage" ADD COLUMN "careers_show" boolean DEFAULT true;
  ALTER TABLE "cafe_nova"."homepage" ADD COLUMN "careers_eyebrow" varchar DEFAULT 'Join the team';
  ALTER TABLE "cafe_nova"."homepage" ADD COLUMN "careers_title" varchar DEFAULT 'Work with us';
  ALTER TABLE "cafe_nova"."homepage" ADD COLUMN "careers_text" varchar DEFAULT 'We’re a friendly, family-run café — and we’re hiring.';
  ALTER TABLE "cafe_nova"."homepage" ADD COLUMN "careers_job_id" integer;
  ALTER TABLE "cafe_nova"."homepage" ADD CONSTRAINT "homepage_careers_job_id_jobs_id_fk" FOREIGN KEY ("careers_job_id") REFERENCES "cafe_nova"."jobs"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_careers_careers_job_idx" ON "cafe_nova"."homepage" USING btree ("careers_job_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cafe_nova"."homepage" DROP CONSTRAINT "homepage_careers_job_id_jobs_id_fk";
  
  DROP INDEX "cafe_nova"."homepage_careers_careers_job_idx";
  ALTER TABLE "cafe_nova"."homepage" DROP COLUMN "careers_show";
  ALTER TABLE "cafe_nova"."homepage" DROP COLUMN "careers_eyebrow";
  ALTER TABLE "cafe_nova"."homepage" DROP COLUMN "careers_title";
  ALTER TABLE "cafe_nova"."homepage" DROP COLUMN "careers_text";
  ALTER TABLE "cafe_nova"."homepage" DROP COLUMN "careers_job_id";`)
}
