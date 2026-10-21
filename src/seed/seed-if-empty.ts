// Runs on every Vercel build.
// 1. Empty database → seed the starter content.
// 2. Older starter content that nobody has edited yet → refresh it to the new content version.
// 3. Anything the café team has edited → never touched again.
import { getPayload } from 'payload'
import config from '@payload-config'

const CONTENT_VERSION = 2
const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'menu-items' })
const settings = await payload.findGlobal({ slug: 'site-settings' })
const current = (settings as { contentVersion?: number }).contentVersion ?? 0

if (totalDocs > 0 && current >= CONTENT_VERSION) {
  console.log(`Content v${current} in place — nothing to seed.`)
  process.exit(0)
}

if (totalDocs > 0) {
  // Has anyone edited content since it was seeded? (updatedAt later than createdAt)
  const edited = async (collection: 'menu-items' | 'menu-categories' | 'events' | 'posts' | 'themes') => {
    const r = await payload.find({ collection, limit: 500, depth: 0, pagination: false })
    return r.docs.some((d) => Date.parse(d.updatedAt) - Date.parse(d.createdAt) > 5000)
  }
  for (const c of ['menu-items', 'menu-categories', 'events', 'posts', 'themes'] as const) {
    if (await edited(c)) {
      console.log(`The café has edited ${c} — keeping their content and skipping the v${CONTENT_VERSION} refresh.`)
      process.exit(0)
    }
  }
  console.log(`Refreshing untouched starter content v${current} → v${CONTENT_VERSION}.`)
} else if (!process.env.SEED_OWNER_PASSWORD) {
  console.error('SEED_OWNER_PASSWORD is not set — refusing to create the owner account with a default password.')
  process.exit(1)
}
await import('./seed')
