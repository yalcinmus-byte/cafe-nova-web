import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// New dish photos under versioned file names so cached optimised images refresh.
const NAMES = ['shakshuka', 'cilbir', 'avocado', 'full-english']

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const n of NAMES) {
    await db.execute(sql`UPDATE "cafe_nova"."menu_items" SET "photo_path" = ${`/img/dishes/${n}-v2.webp`} WHERE "photo_path" = ${`/img/dishes/${n}.webp`}`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const n of NAMES) {
    await db.execute(sql`UPDATE "cafe_nova"."menu_items" SET "photo_path" = ${`/img/dishes/${n}.webp`} WHERE "photo_path" = ${`/img/dishes/${n}-v2.webp`}`)
  }
}
