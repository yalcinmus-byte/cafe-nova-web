import type { Payload, PayloadRequest } from 'payload'

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/**
 * Content added 24 Oct 2026 (Yalcin's v6 brief). Idempotent: safe to run twice.
 * Seasonal dishes, badges and job descriptions are starter content for the owner to edit in the CMS.
 */
export async function applyV6Content(payload: Payload, req?: Partial<PayloadRequest>) {
  const o = { req, overrideAccess: true, depth: 0 } as const

  // 1. Seasonal specials (Halloween) — owner edits names, prices and photos in the CMS.
  let cat = (await payload.find({ collection: 'menu-categories', where: { slug: { equals: 'seasonal-specials' } }, limit: 1, ...o })).docs[0]
  if (!cat) cat = await payload.create({ collection: 'menu-categories', data: { name: 'Seasonal specials', slug: 'seasonal-specials', group: 'sweet', note: 'For a limited time — ask the team what’s new this week.', order: -1 }, ...o })
  const seasonal: [string, string, number, string[], string[]][] = [
    ['Spiced Pumpkin Soup', 'Roasted pumpkin with warm autumn spices, served with toasted sourdough.', 7.5, ['seasonal', 'new'], ['v']],
    ['Pumpkin Spice Latte', 'Alchemy espresso, steamed milk, pumpkin spice and a dusting of cinnamon.', 4.3, ['seasonal', 'limited'], ['v']],
    ['Halloween Pancakes', 'Chocolate and orange pancakes with toffee sauce and spooky sprinkles.', 9.9, ['seasonal', 'kids'], ['v']],
    ['Toffee Apple Crumble', 'Warm apple and cinnamon crumble with toffee sauce and ice cream.', 6.5, ['seasonal'], ['v']],
    ['Spooky Cookies', 'Iced ghost and pumpkin cookies, baked for half-term.', 2.5, ['seasonal', 'kids'], ['v']],
    ['Witch’s Brew Hot Chocolate', 'Rich hot chocolate with marshmallows and cream.', 4.2, ['seasonal', 'kids'], ['v']],
  ]
  const ids: (number | string)[] = []
  for (const [i, [name, description, price, badges, dietary]] of seasonal.entries()) {
    const slug = slugify(name)
    const found = (await payload.find({ collection: 'menu-items', where: { slug: { equals: slug } }, limit: 1, ...o })).docs[0]
    const doc = found ?? await payload.create({ collection: 'menu-items', data: { name, slug, description, price, category: cat.id, order: i, available: true, orderable: true, badges: badges as never, dietary: dietary as never }, ...o })
    ids.push(doc.id)
  }
  const hw = (await payload.find({ collection: 'themes', where: { name: { equals: 'Halloween' } }, limit: 1, ...o })).docs[0]
  if (hw && !(hw.seasonalItems && hw.seasonalItems.length)) await payload.update({ collection: 'themes', id: hw.id, data: { seasonalItems: ids as never }, ...o })

  // 2. Badges on existing dishes (only where none are set yet).
  const badgeMap: Record<string, string[]> = {
    'istanbul-special-breakfast': ['popular', 'turkish'], 'turkish-eggs': ['chefs', 'turkish', 'spicy'], 'full-english-breakfast': ['popular'],
    'smashed-avocado-on-toast': ['popular'], 'pistachio-latte': ['popular'], 'shakshuka-with-eggs': ['turkish'], 'sucuk-cheese': ['spicy'],
    'chef-s-salad': ['healthy'], 'greek-salad': ['healthy'], 'kids-pancake': ['kids'], 'babyccino': ['kids'], 'supernova-pancakes-or-french-toast': ['chefs'],
  }
  for (const [slug, badges] of Object.entries(badgeMap)) {
    const d = (await payload.find({ collection: 'menu-items', where: { slug: { equals: slug } }, limit: 1, ...o })).docs[0]
    if (d && !(d.badges && d.badges.length)) await payload.update({ collection: 'menu-items', id: d.id, data: { badges: badges as never }, ...o })
  }

  // 3. Careers — typical café roles; pay left for the owner to set.
  const jobs = [
    { title: 'Barista', slug: 'barista', team: 'coffee', hours: 'part-time', order: 0, schedule: 'Weekdays from 7am and/or weekends from 8am',
      summary: 'Make Alchemy coffee the way our regulars love it, and keep the coffee bar humming through the morning rush.',
      responsibilities: ['Prepare espresso drinks, teas and our iced and speciality menu to a consistent standard', 'Dial in the grinder each morning and keep the machine spotless', 'Take orders at the counter and online, and keep the queue moving with a smile', 'Help with opening, closing and cleaning routines'],
      requirements: ['Barista experience in a busy café (or a quick learner with a passion for coffee)', 'Friendly, calm under pressure and a real team player', 'Right to work in the UK', 'Available for early starts'],
      benefits: ['Training on speciality coffee from our supplier’s range', 'Daytime hours — the café closes at 5pm', 'A friendly, family-run team'] },
    { title: 'Breakfast & Brunch Chef', slug: 'breakfast-chef', team: 'kitchen', hours: 'full-time', order: 1, schedule: 'Five days a week, including weekends',
      summary: 'Cook our British and Turkish breakfasts and lunch plates — from the Full English to Çılbır and shakshuka.',
      responsibilities: ['Cook breakfast and lunch to order with consistent quality and presentation', 'Prep fresh ingredients daily and manage stock rotation', 'Follow food safety, allergen and HACCP procedures', 'Keep the kitchen clean, organised and ready for inspection'],
      requirements: ['Experience as a breakfast/brunch or line cook', 'Level 2 Food Hygiene certificate (or willing to complete)', 'Knowledge of Turkish breakfast dishes is a big plus', 'Right to work in the UK'],
      benefits: ['Daytime hours — evenings free (except booked private events)', 'Be part of a neighbourhood favourite, rated 4.9 on Google', 'A friendly, family-run team'] },
    { title: 'Front of House / Waiting Staff', slug: 'front-of-house', team: 'front', hours: 'part-time', order: 2, schedule: 'Flexible shifts, weekdays and weekends',
      summary: 'Welcome guests, take orders and look after tables inside and on the terrace.',
      responsibilities: ['Greet and seat guests, take orders and serve food and drinks', 'Answer questions about the menu and allergens (checking with the kitchen)', 'Handle payments at the till', 'Keep tables, terrace and counter clean and tidy'],
      requirements: ['Warm, friendly and well organised', 'Hospitality experience preferred but not essential', 'Right to work in the UK'],
      benefits: ['Flexible hours that fit around study or family', 'Daytime hours — the café closes at 5pm', 'A friendly, family-run team'] },
    { title: 'Kitchen Assistant / Porter', slug: 'kitchen-porter', team: 'kitchen', hours: 'weekends', order: 3, schedule: 'Saturdays and Sundays',
      summary: 'Keep our kitchen running smoothly on our busiest days — washing up, prep and cleaning.',
      responsibilities: ['Wash up and keep equipment and utensils clean', 'Help with basic food prep and deliveries', 'Follow cleaning schedules and food safety rules'],
      requirements: ['Reliable and hard-working', 'No experience needed — we’ll train you', 'Right to work in the UK'],
      benefits: ['A great first step into a kitchen career', 'A friendly, family-run team'] },
  ]
  for (const j of jobs) {
    const exists = (await payload.find({ collection: 'jobs', where: { slug: { equals: j.slug } }, limit: 1, ...o })).docs[0]
    if (exists) continue
    await payload.create({ collection: 'jobs', data: { ...j, open: true, responsibilities: j.responsibilities.map((text) => ({ text })), requirements: j.requirements.map((text) => ({ text })), benefits: j.benefits.map((text) => ({ text })) } as never, ...o })
  }

  // 4. Google review excerpts (shown on Wanderlog's listing, sourced from Google).
  const gmaps = 'https://maps.app.goo.gl/TUpboGm9tRepdiSK7'
  const google = [
    { author: 'Ananya M', date: '2026-06-01', quote: 'The Pistachio Coffee and the Red Velvet Cake were delicious. The service was excellent.' },
    { author: 'Lay J', date: '2026-05-18', quote: 'Lovely atmosphere, friendly staff and amazing food!' },
    { author: 'XEnoN', date: '2026-03-28', quote: 'First time trying Turkish breakfast and I absolutely love it!' },
    { author: 'Arzu G', date: '2026-03-20', quote: 'What a lovely experience it was. We came for a late breakfast and dessert.' },
    { author: 'Magnus M', date: '2026-03-01', quote: 'Poached eggs perfectly cooked and the sauce was creamy and fresh.' },
  ]
  for (const g of google) {
    const exists = (await payload.find({ collection: 'reviews', where: { and: [{ author: { equals: g.author } }, { source: { equals: 'google' } }] }, limit: 1, ...o })).docs[0]
    if (!exists) await payload.create({ collection: 'reviews', data: { ...g, source: 'google', url: gmaps, featured: true }, ...o })
  }

  // 5. Nearby Richmond events.
  const ev = [
    { title: 'Richmond Half Marathon', slug: 'richmond-half-marathon-autumn-2026', startsAt: '2026-11-01T08:00:00Z', kind: 'nearby', highlight: true, summary: 'RunUK’s autumn half marathon starts at Old Deer Park. Runners and supporters: refuel with us after the finish.', link: 'https://www.letsdothis.com/gb/e/richmond-half-marathon-autumn-97069' },
    { title: 'Richmond Christmas lights switch-on', slug: 'richmond-christmas-lights-2026', startsAt: '2026-11-27T17:00:00Z', dateNote: 'Late November — date to be announced', kind: 'nearby', highlight: true, summary: 'The town centre lights up for Christmas. Warm up with a hot chocolate on the way.', link: 'https://www.richmond.org/Whats-On/christmas-lights-switch-on' },
    { title: 'Twickenham Regatta', slug: 'twickenham-regatta-2027', startsAt: '2027-05-22T08:00:00+01:00', dateNote: 'May — date to be announced', kind: 'nearby', highlight: true, summary: 'Twickenham Rowing Club’s regatta on the Thames — over 100 years of racing.', link: 'https://www.twickenhamrc.co.uk/regatta' },
  ]
  for (const e of ev) {
    const exists = (await payload.find({ collection: 'events', where: { slug: { equals: e.slug } }, limit: 1, ...o })).docs[0]
    if (!exists) await payload.create({ collection: 'events', data: e as never, ...o })
  }
  const md = (await payload.find({ collection: 'events', where: { slug: { equals: 'twickenham-match-days' } }, limit: 1, ...o })).docs[0]
  if (md && !md.highlight) await payload.update({ collection: 'events', id: md.id, data: { highlight: true }, ...o })

  // 6. Facilities with icons and links (replace the launch list only if it hasn't been edited).
  const s = await payload.findGlobal({ slug: 'site-settings', ...o })
  const launchTitles = ['Dogs welcome', 'Runners, cyclists & walkers', 'Families & groups', 'Evenings & private hire', 'Five-star food hygiene', 'The Great River Race']
  const titles = (s.facilities ?? []).map((f) => f.title)
  if (!titles.length || titles.join('|') === launchTitles.join('|')) {
    await payload.updateGlobal({ slug: 'site-settings', data: { facilities: [
      { title: 'Dogs welcome', icon: 'dog', text: 'Dog friendly, inside and out on the terrace — bring the four-legged regulars too.', links: [{ label: 'PawPal', url: 'https://pawpal.onelink.me/nDVX/wysxaf9j?type=listing&id=Fy2jQh&u=V2D5jE&c=l&s=l&h=497731', note: 'Dog-friendly places app' }] },
      { title: 'Runners & walkers', icon: 'run', text: 'Our corner is a natural meeting point before or after a run along the Thames path.', links: [
        { label: 'Old Deer Park parkrun', url: 'https://www.richmond.gov.uk/old_deer_park', note: 'Saturday mornings' },
        { label: 'Richmond Half Marathon', url: 'https://www.letsdothis.com/gb/e/richmond-half-marathon-autumn-97069', note: 'RunUK · starts at Old Deer Park' },
      ] },
      { title: 'Cyclists', icon: 'bike', text: 'Stop by after a loop of Richmond Park — coffee and a proper breakfast are waiting.', links: [{ label: 'Richmond Park', url: 'https://www.royalparks.org.uk/visit/parks/richmond-park', note: 'The Royal Parks' }] },
      { title: 'Rowing & the river', icon: 'rowing', text: 'Watch the boats go by — the Thames is a few minutes’ walk away.', links: [
        { label: 'The Great River Race', url: 'https://www.greatriverrace.co.uk/', note: 'London’s River Marathon · September' },
        { label: 'Twickenham Regatta', url: 'https://www.twickenhamrc.co.uk/regatta', note: 'Twickenham Rowing Club · May' },
      ] },
      { title: 'Families & groups', icon: 'family', text: 'A kids’ menu, babyccinos and room for families and groups — just let us know you’re coming.', link: '/contact' },
      { title: 'Evenings & private hire', icon: 'party', text: 'Sound system, microphone, projector and a big-screen TV for parties, talks and match nights.', link: '/private-hire' },
      { title: 'Five-star food hygiene', icon: 'hygiene', text: 'Rated 5 — Very good by the Food Standards Agency.', links: [{ label: 'See our rating', url: 'https://ratings.food.gov.uk/business/1768280/cafe-nova-bistro-twickenham', note: 'food.gov.uk' }] },
    ] } as never, ...o })
  }

  // 7. Homepage & page text globals (create with defaults), and feature the new seasonal plate.
  const home = await payload.findGlobal({ slug: 'homepage', ...o })
  const soup = (await payload.find({ collection: 'menu-items', where: { slug: { equals: 'spiced-pumpkin-soup' } }, limit: 1, ...o })).docs[0]
  if (!home.updatedAt || !home.newOnMenu?.dish) await payload.updateGlobal({ slug: 'homepage', data: { newOnMenu: { ...(home.newOnMenu ?? {}), dish: soup?.id } } as never, ...o })
  const pages = await payload.findGlobal({ slug: 'pages', ...o })
  if (!pages.updatedAt) await payload.updateGlobal({ slug: 'pages', data: {} as never, ...o })
}
