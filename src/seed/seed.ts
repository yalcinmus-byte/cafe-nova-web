import { getPayload } from 'payload'
import config from '@payload-config'
import { MENU } from './menu-data'

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })
for (const c of ['menu-items', 'menu-categories', 'events', 'themes', 'posts'] as const) await payload.delete({ collection: c, where: { id: { exists: true } } })

let ci = 0
for (const cat of MENU) {
  const c = await payload.create({ collection: 'menu-categories', data: { name: cat.name, slug: cat.slug, group: cat.group as never, note: cat.note, order: ci++ } })
  let i = 0
  for (const [name, local, desc, price, diet, extras, sig, photo] of cat.items) {
    await payload.create({
      collection: 'menu-items',
      data: { name, localName: local ?? undefined, slug: slugify(name), description: desc, price: price ?? undefined, category: c.id, order: i++, dietary: (diet ?? []) as never, extras, signature: !!sig, photoPath: photo, available: true, orderable: false },
    })
  }
}

const y = 2026
const ev = [
  { title: 'Christmas party season', slug: 'christmas-parties', startsAt: `${y}-11-20T17:00:00Z`, endsAt: `${y}-12-23T22:00:00Z`, kind: 'nova', highlight: true, summary: 'Evening hire for teams, families and friends — breakfast-for-dinner, Turkish meze or a big-screen night. Ask us for a date.' },
  { title: 'Festive breakfast menu', slug: 'festive-breakfast', startsAt: `${y}-12-01T08:00:00Z`, endsAt: `${y}-12-24T15:00:00Z`, kind: 'nova', highlight: true, summary: 'Seasonal specials alongside the full breakfast menu all December.' },
  { title: 'Pancake Week', slug: 'pancake-week-2027', startsAt: '2027-02-08T08:00:00Z', endsAt: '2027-02-12T16:00:00Z', kind: 'nova', highlight: true, summary: 'Supernova pancakes all week, Shrove Tuesday on 9 February.' },
  { title: 'England v France at Twickenham', slug: 'england-france-2027', startsAt: '2027-02-14T15:10:00Z', kind: 'nearby', highlight: false, summary: 'Six Nations at Allianz Stadium. Come for breakfast before the match.', link: 'https://allianzstadiumtwickenham.com/whats-on' },
]
for (const e of ev) await payload.create({ collection: 'events', data: e as never })

const themes = [
  { name: 'Halloween', startsAt: `${y}-10-17T00:00:00+01:00`, endsAt: `${y}-11-01T00:00:00Z`, accent: '#5FBDB7', banner: 'Half-term? Breakfast is served all day.' },
  { name: 'Christmas', startsAt: `${y}-12-01T00:00:00Z`, endsAt: '2027-01-02T00:00:00Z', accent: '#B23A3A', banner: 'Festive breakfasts and evening parties — book your date.' },
  { name: 'Easter', startsAt: '2027-03-07T00:00:00Z', endsAt: '2027-03-30T00:00:00+01:00', accent: '#C9A227', banner: 'Easter brunch at Nova.' },
  { name: 'Summer', startsAt: '2027-05-15T00:00:00+01:00', endsAt: '2027-09-01T00:00:00+01:00', accent: '#5FBDB7', banner: 'Iced coffee weather.' },
]
for (const t of themes) await payload.create({ collection: 'themes', data: { ...t, mode: 'auto' } as never })

await payload.updateGlobal({ slug: 'site-settings', data: {
  name: 'Cafe Nova Bistro', address: '424 Richmond Road\nEast Twickenham',
  hours: [{ days: 'Every day', time: '8am – 5pm' }],
  reviews: { googleRating: 4.9, googleCount: 685, asOf: '2026-10-17' },
  facilities: [
    { title: 'Dogs welcome', text: 'Dog friendly, inside and out on the terrace — ask the team.', link: '' },
    { title: 'Runners & cyclists', text: 'A natural meeting point before or after Richmond Park, the Thames path and the Richmond Park cycling routes.', link: '' },
    { title: 'Evenings & private hire', text: 'Sound system, microphone, projector and a big-screen TV for parties, talks and match nights.', link: '/contact?kind=event' },
    { title: 'Great River Race', text: 'London’s River Marathon passes under Richmond Bridge every September — breakfast first, then find a spot on the bank.', link: '' },
  ],
  links: {
    googleMaps: 'https://maps.app.goo.gl/TUpboGm9tRepdiSK7',
    tripadvisor: 'https://www.tripadvisor.co.uk/Restaurant_Review-g191301-d27110449-Reviews-Cafe_Nova_Bistro-Richmond_upon_Thames_Greater_London_England.html',
    fsa: 'https://ratings.food.gov.uk/business/1768280/cafe-nova-bistro-twickenham',
    instagram: 'https://www.instagram.com/cafenovabistro/',
    wanderlog: 'https://wanderlog.com/place/details/10134487/cafe-nova-bistro',
    visitRichmond: 'https://www.visitrichmond.co.uk/food-and-drink/cafe-nova-p2072381',
  },
} as never })
await payload.updateGlobal({ slug: 'service-control', data: { directOrdering: false, collection: true, delivery: false, coffeeShop: true, marketplaces: [{ name: 'Deliveroo', showOnSite: false }, { name: 'Uber Eats', showOnSite: false }, { name: 'Just Eat', showOnSite: false }] } as never })

const existing = await payload.find({ collection: 'users', limit: 1 })
if (existing.totalDocs === 0) await payload.create({ collection: 'users', data: { email: process.env.SEED_OWNER_EMAIL || 'owner@cafenova.local', password: process.env.SEED_OWNER_PASSWORD || 'nova-change-me', name: 'Süleyman', role: 'owner' } as never })
const lex = (paras: string[]) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: paras.map((t) => t.startsWith('## ')
  ? { type: 'heading', tag: 'h2', format: '', indent: 0, version: 1, direction: 'ltr', children: [{ type: 'text', text: t.slice(3), format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }
  : { type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text: t, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }) } })
await payload.create({ collection: 'posts', data: { title: 'Two cultures, one table', slug: 'two-cultures-one-table', status: 'published', publishedAt: '2026-10-17T09:00:00Z', coverPath: '/img/dishes/turkish.webp',
  excerpt: 'Süleyman Demir on 60 years of family hospitality, 20 years in Richmond, and why a Full English and a Turkish breakfast belong on the same menu.',
  body: lex([
    'Great hospitality is more than just serving good food. It’s about passion, tradition, genuine care and making people feel at home.',
    'My journey began with my family’s 60-year heritage in the café and restaurant industry. Growing up surrounded by food, service and hospitality, I learned early on that the secret to a successful café isn’t just what’s on the plate — it’s how you make people feel.',
    '## Twenty years in Richmond',
    'Richmond has been my home for the past 20 years. I’ve worked in five local cafés — as a chef in three and as a manager in two. Those years gave me a deep understanding of British café culture, and my own approach to food, quality and service.',
    '## Why both breakfasts',
    'Cafe Nova Bistro brings together two food traditions: classic British café favourites and authentic Turkish cuisine. From a Full English to Çılbır and a Turkish breakfast to share, our menu celebrates the best of both.',
    'Come as a guest. Leave as a friend. — Süleyman Demir, Founder & Owner',
  ]) } as never })
await payload.create({ collection: 'posts', data: { title: 'Breakfast first, then the river', slug: 'breakfast-first-then-the-river', status: 'published', publishedAt: '2026-10-20T09:00:00Z', coverPath: '/img/place/bridge.webp',
  excerpt: 'A slow Saturday by Richmond Bridge: a proper breakfast on Richmond Road, then the Thames path.',
  body: lex([
    'We’re a short walk from Richmond Bridge, on the Twickenham side of the river. Plenty of our Saturday regulars come in before a walk, a run or a ride.',
    '## Start here',
    'Order a Full English or a Turkish breakfast, a flat white with Alchemy coffee, and settle in.',
    '## Then the river',
    'Cross the bridge for Richmond town and the riverside, or follow the Thames path. In September, the Great River Race comes under the bridge — a good excuse for a second coffee.',
  ]) } as never })
console.log('Seeded.')
process.exit(0)
