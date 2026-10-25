import type { Payload, PayloadRequest } from 'payload'

/** v10: example weekday offer + supplier band as listed by the owner. Safe to run twice. */
export async function applyV10Content(payload: Payload, req?: PayloadRequest) {
  const o = await payload.find({ collection: 'offers', where: { title: { equals: 'Half-price cakes after 3pm' } }, limit: 1, req })
  if (!o.docs.length) {
    await payload.create({ collection: 'offers', req, data: {
      title: 'Half-price cakes after 3pm',
      text: 'Every weekday from 3pm, cakes on the counter are half price. While they last.',
      active: true, showOnHome: true, discount: 50, order: 1,
      days: ['mon', 'tue', 'wed', 'thu', 'fri'], from: '15:00', to: '17:00',
      label: '½ price after 3pm',
    } })
  }
  const want = [
    { name: 'Waitrose', role: 'Organic milk', url: 'https://www.waitrose.com/' },
    { name: 'Booker Wholesale', role: 'Wholesale', url: 'https://www.booker.co.uk/' },
    { name: 'Costco', role: 'Quality essentials', url: 'https://www.costco.co.uk/' },
    { name: 'Mediterranean Food Centre', role: 'Mediterranean pantry', url: null },
    { name: 'Alchemy Coffee', role: 'Coffee roaster', url: 'https://alchemycoffee.co.uk/' },
    { name: 'Rock Star Bakers', role: 'Bakery', url: null },
  ]
  const all = await payload.find({ collection: 'partners', limit: 100, req })
  for (const [i, w] of want.entries()) {
    const hit = all.docs.find((d) => d.name.toLowerCase() === w.name.toLowerCase())
    if (hit) await payload.update({ collection: 'partners', id: hit.id, req, data: { order: i + 1, showOnSite: true } })
    else await payload.create({ collection: 'partners', req, data: { name: w.name, role: w.role, url: w.url ?? undefined, order: i + 1, showOnSite: true } })
  }
  for (const d of all.docs) if (!want.some((w) => w.name.toLowerCase() === d.name.toLowerCase())) await payload.update({ collection: 'partners', id: d.id, req, data: { showOnSite: false } })
}
