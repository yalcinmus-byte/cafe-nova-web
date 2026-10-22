import { getPayload } from 'payload'
import config from '@payload-config'
import { MENU } from './menu-data'

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const CONTENT_VERSION = 2
const SHOP = ['istanbul-special-breakfast', 'full-english-breakfast', 'turkish-eggs', 'shakshuka-with-eggs', 'smashed-avocado-on-toast', 'eggs-royale', 'two-american-pancakes', 'hot-mezze-platter', 'roasted-mixed-vegetables-plate', 'meatball-wrap', 'chef-s-salad', 'cigar-borek', 'latte', 'flat-white', 'turkish-tea', 'alchemy-coffee-kenya-nandi-ab']

const payload = await getPayload({ config })
for (const c of ['menu-items', 'menu-categories', 'events', 'themes', 'posts', 'reviews', 'partners'] as const) await payload.delete({ collection: c, where: { id: { exists: true } } })

let ci = 0
for (const cat of MENU) {
  const c = await payload.create({ collection: 'menu-categories', data: { name: cat.name, slug: cat.slug, group: cat.group as never, note: cat.note, order: ci++ } })
  let i = 0
  for (const [name, local, desc, price, diet, extras, sig, photo] of cat.items) {
    await payload.create({
      collection: 'menu-items',
      // Everything on the menu can be ordered online once ordering is switched on (no alcohol on this menu).
      data: { name, localName: local ?? undefined, slug: slugify(name), description: desc, price: price ?? undefined, category: c.id, order: i++, dietary: (diet ?? []) as never, extras, signature: !!sig, photoPath: photo, available: true, orderable: true, inShop: SHOP.includes(slugify(name)) },
    })
  }
}

// The year at Nova. Dates are editable in the CMS; nearby events link to their organisers.
const ev = [
  { title: 'Halloween half-term breakfasts', slug: 'halloween-2026', startsAt: '2026-10-24T08:00:00+01:00', endsAt: '2026-11-01T17:00:00Z', kind: 'nova', highlight: true, summary: 'Half-term mornings with the kids: pancakes, babyccinos and breakfast served all day.' },
  { title: 'Christmas party season', slug: 'christmas-parties', startsAt: '2026-11-20T17:00:00Z', endsAt: '2026-12-23T22:00:00Z', kind: 'nova', highlight: true, summary: 'Evening hire for teams, families and friends — breakfast-for-dinner, Turkish meze or a big-screen night, with sound system, microphone and projector.', link: '/private-hire' },
  { title: 'Festive breakfast menu', slug: 'festive-breakfast', startsAt: '2026-12-01T08:00:00Z', endsAt: '2026-12-24T15:00:00Z', kind: 'nova', highlight: true, summary: 'Seasonal specials alongside the full breakfast menu all December.' },
  { title: 'New Year’s Day brunch', slug: 'new-year-brunch-2027', startsAt: '2027-01-01T09:00:00Z', kind: 'nova', highlight: false, summary: 'Start the year slowly: a Full English or a Turkish breakfast and a strong coffee. Please check our opening hours over the holidays.' },
  { title: 'Pancake Week', slug: 'pancake-week-2027', startsAt: '2027-02-08T08:00:00Z', endsAt: '2027-02-12T16:00:00Z', kind: 'nova', highlight: true, summary: 'Supernova pancakes all week, Shrove Tuesday on 9 February.' },
  { title: 'Valentine’s breakfast', slug: 'valentines-2027', startsAt: '2027-02-14T08:00:00Z', kind: 'nova', highlight: false, summary: 'Breakfast for two on a Sunday morning — French toast, Çılbır and two flat whites.' },
  { title: 'Mother’s Day brunch', slug: 'mothers-day-2027', startsAt: '2027-03-07T08:00:00Z', kind: 'nova', highlight: true, summary: 'Treat Mum to brunch by Richmond Bridge. Larger groups: tell us you’re coming.', link: '/contact' },
  { title: 'Easter brunch', slug: 'easter-2027', startsAt: '2027-03-26T08:00:00Z', endsAt: '2027-03-29T17:00:00+01:00', kind: 'nova', highlight: true, summary: 'Easter weekend at Nova: brunch for the whole family.' },
  { title: 'Father’s Day breakfast', slug: 'fathers-day-2027', startsAt: '2027-06-20T08:00:00+01:00', kind: 'nova', highlight: false, summary: 'The English Feast was made for this.' },
  { title: 'The Great River Race', slug: 'great-river-race-2027', startsAt: '2027-09-01T08:00:00+01:00', dateNote: 'September — date to be announced', kind: 'nearby', highlight: true, summary: 'London’s River Marathon comes up the Thames towards Ham. Breakfast with us first, then find a spot on the bank by Richmond Bridge.', link: 'https://www.greatriverrace.co.uk/' },
  { title: 'Match days at Allianz Stadium Twickenham', slug: 'twickenham-match-days', startsAt: '2027-06-29T08:00:00+01:00', endsAt: '2027-06-30T18:00:00+01:00', dateNote: 'Through the season — see the fixtures', kind: 'nearby', highlight: false, summary: 'Big game at Twickenham? Fuel up with a proper breakfast before you head to the stadium.', link: 'https://allianzstadiumtwickenham.com/whats-on' },
]
for (const e of ev) await payload.create({ collection: 'events', data: e as never })

const themes = [
  { name: 'Halloween', decor: 'halloween', startsAt: '2026-10-17T00:00:00+01:00', endsAt: '2026-11-01T00:00:00Z', accent: '#3A2A5C', banner: 'Half-term? Breakfast is served all day.', bannerLink: '/events', headline: 'Spooky-season mornings', blurb: 'Half-term pancakes, babyccinos for the little ones and a strong flat white for everyone else.' },
  { name: 'Christmas', decor: 'christmas', startsAt: '2026-12-01T00:00:00Z', endsAt: '2027-01-02T00:00:00Z', accent: '#1F5A43', banner: 'Festive breakfasts and evening parties — book your date.', bannerLink: '/private-hire', headline: 'Christmas at Nova', blurb: 'Festive breakfasts all December, and the café is yours after 5pm for team and family parties.' },
  { name: 'Easter', decor: 'easter', startsAt: '2027-03-07T00:00:00Z', endsAt: '2027-03-30T00:00:00+01:00', accent: '#6E4F96', banner: 'Easter brunch at Nova.', bannerLink: '/events', headline: 'Spring brunch season', blurb: 'Mother’s Day and Easter weekend brunch by Richmond Bridge.' },
  { name: 'Summer', decor: 'summer', startsAt: '2027-05-15T00:00:00+01:00', endsAt: '2027-09-01T00:00:00+01:00', accent: '#237A76', banner: 'Iced coffee weather.', bannerLink: '/menu#iced', headline: 'Iced coffee weather', blurb: 'Iced lattes, smoothies and the terrace in the sun.' },
]
for (const t of themes) await payload.create({ collection: 'themes', data: { ...t, mode: 'auto' } as never })

const ta = 'https://www.tripadvisor.co.uk/Restaurant_Review-g191301-d27110449-Reviews-Cafe_Nova_Bistro-Richmond_upon_Thames_Greater_London_England.html'
const reviews = [
  { title: 'Great food, lovely welcome!', quote: 'Popped by for late lunch and we tried the hot mezze sharer plate and a nova wrap - all well presented and really delicious!!', author: 'GLond', source: 'tripadvisor', date: '2024-08-05', url: ta },
  { title: 'The best spot for brunch or lunch in Richmond', quote: 'This little spot is the best spot in Richmond to have a coffee, brunch or lunch.', author: 'Rex T', source: 'tripadvisor', date: '2024-06-20', url: ta },
  { title: 'Morning coffee', quote: 'Very friendly clean and yummy also they do very fast serving with all fresh traditional Turkish Simit', author: 'NeamRaouf', source: 'tripadvisor', date: '2024-05-17', url: ta },
  { title: 'Best cafe in Richmond', quote: 'Can’t recommend this place enough! Fantastic food, friendly staff, and a lovely ambience.', author: 'Truman G', source: 'tripadvisor', date: '2024-05-13', url: ta },
  { title: 'Amazing food, amazing staff', quote: 'Amazing place to eat a delicious tipical british breakfast!', author: 'Joana P', source: 'tripadvisor', date: '2024-04-26', url: ta },
]
for (const r of reviews) await payload.create({ collection: 'reviews', data: { ...r, featured: true } as never })

const partners = [
  { name: 'Alchemy Coffee', role: 'Coffee roaster', description: 'London speciality roaster, roasting by hand with Direct Trade sourcing. Every cup — and the beans to take home.', url: 'https://alchemycoffee.co.uk/', order: 0 },
  { name: 'Waitrose', role: 'Organic milk', description: 'Organic milk for every latte, flat white and babyccino.', url: 'https://www.waitrose.com/', order: 1 },
  { name: 'Local farm markets', role: 'Fresh produce', description: 'Vegetables, herbs and fruit bought fresh from local markets.', order: 2 },
  { name: 'Costco', role: 'Quality essentials', description: 'Selected quality essentials for the kitchen.', url: 'https://www.costco.co.uk/', order: 3 },
]
for (const p of partners) await payload.create({ collection: 'partners', data: { ...p, showOnSite: true } as never })

// Café details belong to the café: only fill what is still empty (and add new links).
const seedSettings: Record<string, unknown> = {
  name: 'Cafe Nova Bistro', address: '424 Richmond Road\nEast Twickenham, Twickenham TW1 2EB',
  hours: [{ days: 'Monday – Friday', time: '7am – 5pm' }, { days: 'Saturday & Sunday', time: '8am – 5pm' }],
  phone: '07453 302323',
  contentVersion: CONTENT_VERSION,
  reviews: { googleRating: 4.9, googleCount: 685, asOf: '2026-10-17', tripadvisorCount: 30, tripadvisorRank: '#3 of 67 Coffee & Tea in Richmond-upon-Thames' },
  facilities: [
    { title: 'Dogs welcome', text: 'Dog friendly — bring the four-legged regulars too. Find us on PawPal.', link: 'https://pawpal.onelink.me/nDVX/wysxaf9j?type=listing&id=Fy2jQh&u=V2D5jE&c=l&s=l&h=497731' },
    { title: 'Runners, cyclists & walkers', text: 'A natural meeting spot before or after Richmond Park, the Thames path and the Richmond Park cycle routes.', link: 'https://www.royalparks.org.uk/visit/parks/richmond-park' },
    { title: 'Families & groups', text: 'A kids’ menu, babyccinos and room for families and groups — just let us know you’re coming.', link: '/contact' },
    { title: 'Evenings & private hire', text: 'Sound system, microphone, projector and a big-screen TV for parties, talks and match nights.', link: '/private-hire' },
    { title: 'Five-star food hygiene', text: 'Rated 5 — Very good by the Food Standards Agency, inspected July 2026.', link: 'https://ratings.food.gov.uk/business/1768280/cafe-nova-bistro-twickenham' },
    { title: 'The Great River Race', text: 'London’s River Marathon comes up the Thames every September — breakfast first, then find a spot on the bank.', link: 'https://www.greatriverrace.co.uk/' },
  ],
  links: {
    googleMaps: 'https://maps.app.goo.gl/TUpboGm9tRepdiSK7',
    tripadvisor: 'https://www.tripadvisor.co.uk/Restaurant_Review-g191301-d27110449-Reviews-Cafe_Nova_Bistro-Richmond_upon_Thames_Greater_London_England.html',
    fsa: 'https://ratings.food.gov.uk/business/1768280/cafe-nova-bistro-twickenham',
    instagram: 'https://www.instagram.com/cafenovabistro/',
    wanderlog: 'https://wanderlog.com/place/details/10134487/cafe-nova-bistro',
    visitRichmond: 'https://www.visitrichmond.co.uk/food-and-drink/cafe-nova-p2072381',
    pawpal: 'https://pawpal.onelink.me/nDVX/wysxaf9j?type=listing&id=Fy2jQh&u=V2D5jE&c=l&s=l&h=497731',
    staycation: 'https://staycation.co.uk/richmond-upon-thames/restaurants/cafe-nova-bistro',
    myRichmond: 'https://myrichmond.london/offer/cafe-nova-bistro/',
    facebook: 'https://www.facebook.com/watch/?v=1112275508625374',
  },
}
{
  const cur = (await payload.findGlobal({ slug: 'site-settings' })) as unknown as Record<string, unknown>
  const empty = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0)
  const out: Record<string, unknown> = { contentVersion: CONTENT_VERSION }
  const older = ((cur.contentVersion as number) ?? 0) < CONTENT_VERSION
  for (const [k, v] of Object.entries(seedSettings)) {
    if (k === 'contentVersion') continue
    // Starter lists written by an older content version are refreshed (the caller already checked nothing was edited).
    if (older && (k === 'facilities' || k === 'reviews')) { out[k] = v; continue }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const g = { ...((cur[k] as Record<string, unknown>) ?? {}) }
      for (const [gk, gv] of Object.entries(v)) if (empty(g[gk])) g[gk] = gv
      out[k] = g
    } else if (empty(cur[k])) out[k] = v
  }
  await payload.updateGlobal({ slug: 'site-settings', data: out as never })
}
{
  // Service control belongs to the café: only fill settings that are still empty.
  const svc = (await payload.findGlobal({ slug: 'service-control' })) as unknown as Record<string, unknown>
  const defaults: Record<string, unknown> = { directOrdering: true, collection: true, delivery: true, coffeeShop: true, payAtCounter: true, deliveryFee: 3.5, deliveryMinimum: 15, deliveryPostcodes: 'TW1, TW2, TW9, TW10', firstSlot: '07:30', weekendFirstSlot: '08:30', lastSlot: '16:15', prepMinutes: 20, slotCapacity: 6,
    marketplaces: [{ name: 'Deliveroo', showOnSite: true }, { name: 'Uber Eats', showOnSite: true }, { name: 'Just Eat', showOnSite: true }] }
  const patch: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(defaults)) if (svc[k] == null || (Array.isArray(svc[k]) && (svc[k] as unknown[]).length === 0)) patch[k] = v
  if (Object.keys(patch).length) await payload.updateGlobal({ slug: 'service-control', data: patch as never })
}

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
