import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { MenuItem, MenuCategory, Theme } from '@/payload-types'

export const db = cache(async () => getPayload({ config }))

export const getSettings = cache(async () => (await db()).findGlobal({ slug: 'site-settings' }))
export const getService = cache(async () => (await db()).findGlobal({ slug: 'service-control' }))

export type MenuSection = MenuCategory & { items: MenuItem[] }

/** Published menu: dishes without a price stay hidden until the team completes them. */
export const getMenu = cache(async (): Promise<MenuSection[]> => {
  const p = await db()
  const [cats, items] = await Promise.all([
    p.find({ collection: 'menu-categories', limit: 0, pagination: false, sort: 'order' }),
    p.find({ collection: 'menu-items', limit: 0, pagination: false, sort: 'order', depth: 1, where: { price: { exists: true } } }),
  ])
  return cats.docs
    .map((c) => ({ ...c, items: items.docs.filter((i) => (typeof i.category === 'object' ? i.category?.id : i.category) === c.id) }))
    .filter((c) => c.items.length > 0)
})

export const getSignatures = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'menu-items', where: { signature: { equals: true }, price: { exists: true } }, limit: 8, sort: 'order', depth: 1 })
  return r.docs
})

export const getEvents = cache(async (onlyHighlights = false) => {
  const p = await db()
  const now = new Date().toISOString()
  const r = await p.find({
    collection: 'events',
    sort: 'startsAt',
    limit: onlyHighlights ? 4 : 50,
    depth: 1,
    where: {
      and: [
        { or: [{ endsAt: { greater_than: now } }, { startsAt: { greater_than: now } }] },
        ...(onlyHighlights ? [{ highlight: { equals: true } }] : []),
      ],
    },
  })
  return r.docs
})

/** Seasonal theme resolver — evaluated on every request (London dates stored as instants). */
export const getActiveTheme = cache(async (): Promise<Theme | null> => {
  const p = await db()
  const r = await p.find({ collection: 'themes', limit: 50, sort: '-priority' })
  const now = Date.now()
  const on = r.docs.find((t) => t.mode === 'on')
  if (on) return on
  return (
    r.docs.find((t) => t.mode === 'auto' && t.startsAt && t.endsAt && Date.parse(t.startsAt) <= now && now < Date.parse(t.endsAt)) ?? null
  )
})

export const orderingState = (svc: Awaited<ReturnType<typeof getService>>) => {
  const live = !!svc.directOrdering && !svc.emergencyPause
  return {
    live,
    paused: !!svc.emergencyPause,
    collection: live && !!svc.collection,
    delivery: live && !!svc.delivery,
    marketplaces: (svc.marketplaces ?? []).filter((m) => m.showOnSite),
    message: svc.pauseMessage,
  }
}

export const gbp = (n?: number | null) => (n == null ? '' : `£${n.toFixed(2)}`)

export const getPosts = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, depth: 1 })
  return r.docs
})

export const getPost = cache(async (slug: string) => {
  const p = await db()
  const r = await p.find({ collection: 'posts', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 1 })
  return r.docs[0] ?? null
})

export const getJobs = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'jobs', where: { open: { equals: true } }, limit: 20, sort: 'order' })
  return r.docs
})

export const getReviews = cache(async () => {
  const p = await db()
  return (await p.find({ collection: 'reviews', where: { featured: { equals: true } }, sort: '-date', limit: 24, depth: 0 })).docs
})

export const getPartners = cache(async () => {
  const p = await db()
  return (await p.find({ collection: 'partners', where: { showOnSite: { equals: true } }, sort: 'order', limit: 12, depth: 1 })).docs
})

export const getShop = cache(async () => {
  const p = await db()
  const cat = await p.find({ collection: 'menu-categories', where: { group: { equals: 'shop' } }, limit: 1, depth: 0 })
  if (!cat.docs[0]) return []
  return (await p.find({ collection: 'menu-items', where: { category: { equals: cat.docs[0].id }, price: { exists: true } }, sort: 'order', limit: 12, depth: 0 })).docs
})

export const getShopItems = cache(async () => {
  const p = await db()
  const r = await p.find({ collection: 'menu-items', where: { inShop: { equals: true }, available: { equals: true }, price: { exists: true } }, limit: 24, depth: 1, sort: 'order' })
  const rank = (d: (typeof r.docs)[number]) => { const c = typeof d.category === 'object' ? (d.category as MenuCategory) : null; return (c?.order ?? 99) * 100 + (d.order ?? 0) }
  return r.docs.sort((a, b) => rank(a) - rank(b)).map((d) => {
    const c = typeof d.category === 'object' ? (d.category as MenuCategory) : null
    const m = typeof d.photo === 'object' && d.photo ? (d.photo as { url?: string | null }) : null
    return { slug: d.slug, name: d.name, localName: d.localName, description: d.description, price: d.price!, photo: m?.url || d.photoPath || null, group: c?.group ?? 'breakfast', category: c?.name ?? '', diet: d.dietary ?? [], badges: d.badges ?? [] }
  })
})


export const getHomepage = cache(async () => (await db()).findGlobal({ slug: 'homepage', depth: 2 }))
export const getPages = cache(async () => (await db()).findGlobal({ slug: 'pages' }))

/** Homepage events: Nova highlights plus nearby Richmond dates. */
export const getHomeEvents = cache(async () => {
  const p = await db()
  const now = new Date().toISOString()
  const r = await p.find({ collection: 'events', sort: 'startsAt', limit: 12, depth: 0, where: { and: [{ or: [{ endsAt: { greater_than: now } }, { startsAt: { greater_than: now } }] }, { highlight: { equals: true } }] } })
  const nova = r.docs.filter((e) => e.kind !== 'nearby').slice(0, 4)
  const near = r.docs.filter((e) => e.kind === 'nearby').slice(0, 4)
  return [...nova, ...near]
})
