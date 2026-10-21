// Runs on every Vercel build: seeds the starter content only on a brand-new, empty database.
// It never touches a database the café team has already edited.
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'menu-items' })
if (totalDocs > 0) {
  console.log(`Database already has ${totalDocs} dishes — skipping seed.`)
  process.exit(0)
}
if (!process.env.SEED_OWNER_PASSWORD) {
  console.error('SEED_OWNER_PASSWORD is not set — refusing to create the owner account with a default password.')
  process.exit(1)
}
await import('./seed')
