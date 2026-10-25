import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { migrations } from './migrations'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MenuCategories } from './collections/MenuCategories'
import { MenuItems } from './collections/MenuItems'
import { Events } from './collections/Events'
import { Themes } from './collections/Themes'
import { Posts } from './collections/Posts'
import { Jobs } from './collections/Jobs'
import { Enquiries } from './collections/Enquiries'
import { Orders } from './collections/Orders'
import { Partners } from './collections/Partners'
import { Reviews } from './collections/Reviews'
import { Offers } from './collections/Offers'
import { Suppliers, Purchases, Expenses, Documents } from './collections/hq'
import { ServiceControl } from './globals/ServiceControl'
import { SiteSettings } from './globals/SiteSettings'
import { Homepage } from './globals/Homepage'
import { Pages } from './globals/Pages'

const dbUrl = process.env.DATABASE_URL || ''
const isPostgres = dbUrl.startsWith('postgres')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Nova Studio', icons: [{ url: '/brand/nova-icon.svg', type: 'image/svg+xml' }] },
    components: {
      graphics: { Logo: '@/admin/Logo#Logo', Icon: '@/admin/Logo#Icon' },
      beforeDashboard: ['@/admin/Today#Today'],
      beforeNavLinks: ['@/admin/NovaNav#NovaNav'],
      views: { kitchen: { Component: '@/admin/Kitchen#Kitchen', path: '/kitchen' }, bookings: { Component: '@/admin/Bookings#Bookings', path: '/bookings' }, },
    },
    theme: 'light',
  },
  collections: [Orders, Enquiries, Suppliers, Purchases, Expenses, Documents, MenuItems, MenuCategories, Offers, Events, Posts, Jobs, Reviews, Partners, Media, Themes, Users],
  globals: [ServiceControl, SiteSettings, Homepage, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // SQLite on a laptop (DATABASE_URL=file:...). Online: Supabase Postgres, in its own `cafe_nova` schema
  // inside the shared uniqsense-sites project, with a login that can only see that schema.
  db: isPostgres
    ? postgresAdapter({
        pool: { connectionString: dbUrl, max: 3 },
        schemaName: 'cafe_nova',
        push: false,
        migrationDir: path.resolve(dirname, 'migrations'),
        prodMigrations: migrations,
      })
    : sqliteAdapter({ client: { url: dbUrl } }),
  sharp,
  plugins: [
    // Uploaded photos go to Vercel Blob when its token is set (online); on a laptop they stay in /media.
    vercelBlobStorage({ enabled: !!process.env.BLOB_READ_WRITE_TOKEN, collections: { media: true, documents: true }, token: process.env.BLOB_READ_WRITE_TOKEN }),
  ],
})
