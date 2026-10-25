/**
 * Nova HQ — SAMPLE data.
 * Shaped like a 28-day EPOS export (Sun 27 Sep – Sat 24 Oct 2026) so the dashboard can be designed and judged
 * before the real EPOS is connected. Every figure is derived from this one seeded source, so totals, percentages
 * and charts always agree. Admin-only: never shown on the public site, in schema or in prompts.
 */

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
/** Average takings (inc. VAT) by weekday, index 0 = Sunday. */
const BASE = [2240, 1080, 1020, 1140, 1260, 1520, 2380]
const SPEND = [13.6, 11.2, 11.1, 11.3, 11.5, 11.9, 13.8]
/** Share of the day's takings by opening hour (07:00–16:00 starts). Weekends open at 8. */
export const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
const WEEKDAY_SHAPE = [0.06, 0.13, 0.15, 0.14, 0.11, 0.14, 0.12, 0.07, 0.05, 0.03]
const WEEKEND_SHAPE = [0, 0.08, 0.16, 0.18, 0.17, 0.15, 0.13, 0.07, 0.04, 0.02]

const START = Date.UTC(2026, 8, 27) // Sun 27 Sep 2026
const DAYS = 28
const VAT = 1.2

export type Day = { date: Date; dow: number; takings: number; prior: number; tx: number; spend: number }

export type Status = 'good' | 'warning' | 'serious' | 'critical' | 'missing'

export function getSample() {
  const rnd = mulberry32(20261024)
  const days: Day[] = []
  for (let i = 0; i < DAYS; i++) {
    const date = new Date(START + i * 864e5)
    const dow = date.getUTCDay()
    const trend = 1 + 0.0035 * i
    const takings = Math.round(BASE[dow] * trend * (0.94 + rnd() * 0.12))
    const prior = Math.round((BASE[dow] / 1.03) * (0.94 + rnd() * 0.12))
    const spend = +(SPEND[dow] * (0.97 + rnd() * 0.06)).toFixed(2)
    days.push({ date, dow, takings, prior, spend, tx: Math.round(takings / spend) })
  }
  const sum = (a: number[]) => a.reduce((s, n) => s + n, 0)
  const takings = sum(days.map((d) => d.takings))
  const prior = sum(days.map((d) => d.prior))
  const tx = sum(days.map((d) => d.tx))
  const priorTx = Math.round(prior / 12.05)
  const net = takings / VAT

  // Average takings per weekday (Mon first) and per hour.
  const byDow = [1, 2, 3, 4, 5, 6, 0].map((dow) => {
    const ds = days.filter((d) => d.dow === dow)
    return { dow, label: DOW[dow], avg: Math.round(sum(ds.map((d) => d.takings)) / ds.length) }
  })
  const weekendAvg = (byDow[5].avg + byDow[6].avg) / 2
  const heat = byDow.map((r) => ({
    label: r.label,
    cells: HOURS.map((h, i) => {
      const shape = r.dow === 0 || r.dow === 6 ? WEEKEND_SHAPE : WEEKDAY_SHAPE
      return { hour: h, value: shape[i] ? Math.round(r.avg * shape[i]) : null }
    }),
  }))

  // Channels (share of takings).
  const CH = [
    { name: 'Eat in', share: 0.66 },
    { name: 'Takeaway counter', share: 0.17 },
    { name: 'Delivery apps', share: 0.13, commission: 0.3 },
    { name: 'Website orders', share: 0.04 },
  ]
  const channels = CH.map((c) => ({ ...c, value: Math.round(takings * c.share) }))
  const commission = Math.round(channels[2].value * 0.3)

  // Costs as % of net sales (ex VAT).
  const pct = {
    food: 31.2,
    labour: 34.1,
    commission: +((commission / net) * 100).toFixed(1),
    rent: 10.5,
    energy: 4.6,
    cardFees: 1.3,
    other: 5.0,
  }
  const prime = +(pct.food + pct.labour).toFixed(1)
  const profit = +(100 - Object.values(pct).reduce((s, n) => s + n, 0)).toFixed(1)
  const costs = [
    { name: 'Food & drink', p: pct.food },
    { name: 'Staff wages', p: pct.labour },
    { name: 'Rent & rates', p: pct.rent },
    { name: 'Delivery app commission', p: pct.commission },
    { name: 'Other overheads', p: pct.other },
    { name: 'Energy', p: pct.energy },
    { name: 'Card fees', p: pct.cardFees },
    { name: 'Profit', p: profit, profit: true },
  ]

  // Menu engineering — food items, 28-day quantities, menu price (inc. VAT) and plate cost.
  const dishes = [
    ['Full English Breakfast', 360, 14.75, 4.6],
    ['Istanbul Special Breakfast', 210, 17.5, 6.1],
    ['Turkish Eggs', 230, 13.5, 3.1],
    ['Smashed Avocado', 220, 9.9, 3.4],
    ['Eggs Benedict', 180, 13.5, 3.9],
    ['Shakshuka', 170, 13.5, 2.9],
    ['Club Sandwich', 95, 10.5, 3.9],
    ['Supernova Pancakes', 85, 14.5, 3.6],
    ['Turkish Benedict', 70, 16.5, 4.8],
    ['Mantı', 50, 13.5, 4.9],
    ['Mixed Grill Platter', 45, 17.5, 7.4],
  ].map(([name, qty, price, cost]) => {
    const margin = +((price as number) / VAT - (cost as number)).toFixed(2)
    return { name: name as string, qty: qty as number, price: price as number, cost: cost as number, margin }
  })
  const totalQty = sum(dishes.map((d) => d.qty))
  const popLine = (totalQty / dishes.length) * 0.7
  const marginLine = +(sum(dishes.map((d) => d.margin * d.qty)) / totalQty).toFixed(2)
  const menu = dishes.map((d) => ({
    ...d,
    group: d.qty >= popLine ? (d.margin >= marginLine ? 'Star' : 'Workhorse') : d.margin >= marginLine ? 'Puzzle' : 'Dog',
  }))

  const growth = +(((takings - prior) / prior) * 100).toFixed(1)
  const quietShare = Math.round(((byDow[0].avg + byDow[1].avg + byDow[2].avg) / 3 / weekendAvg) * 100)
  const primeOver = +(prime - 62).toFixed(1)
  const primeCostGbp = Math.round((net * primeOver) / 100)

  const checks: { name: string; status: Status; value: string; note: string; agent: string }[] = [
    { name: 'Sales trend', status: growth >= 0 ? 'good' : 'warning', value: `${growth > 0 ? '+' : ''}${growth}%`, note: 'vs previous 28 days', agent: 'cfo' },
    { name: 'Quiet days', status: 'warning', value: `${quietShare}%`, note: 'Mon–Wed takings vs weekend average', agent: 'growth' },
    { name: 'Food cost', status: 'good', value: `${pct.food}%`, note: 'target 28–32%, rising with milk prices', agent: 'menu' },
    { name: 'Staff cost', status: 'warning', value: `${pct.labour}%`, note: 'target 32% or less', agent: 'rota' },
    { name: 'Prime cost', status: 'serious', value: `${prime}%`, note: 'food + staff, target 62% or less', agent: 'cfo' },
    { name: 'Delivery apps', status: 'warning', value: `${Math.round(CH[2].share * 100)}%`, note: `of takings · £${commission.toLocaleString('en-GB')} commission`, agent: 'growth' },
    { name: 'Reviews', status: 'warning', value: '4.7★', note: '3 Google reviews unanswered', agent: 'reviews' },
    { name: 'Food safety logs', status: 'critical', value: '2 missing', note: 'fridge temperatures, Sat 17 & Sun 18 Oct', agent: 'compliance' },
    { name: 'Cash buffer', status: 'missing', value: '—', note: 'connect the bank feed to see weeks of cover', agent: 'cfo' },
    { name: 'Website orders', status: 'good', value: `${Math.round(CH[3].share * 100)}%`, note: 'of takings, commission-free', agent: 'growth' },
  ]
  const W: Record<Status, number> = { good: 100, warning: 60, serious: 35, critical: 10, missing: 0 }
  const scored = checks.filter((c) => c.status !== 'missing')
  const score = Math.round(sum(scored.map((c) => W[c.status])) / scored.length)

  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`
  const urgent = [
    { level: 'critical' as Status, agent: 'compliance', title: 'Fridge temperature logs missing for Sat 17 and Sun 18 Oct', detail: 'An inspector will ask for them. Fill in what you can from the probe records and sign today’s check.', due: 'Today' },
    { level: 'serious' as Status, agent: 'cfo', title: `Prime cost is ${prime}% — ${primeOver} points over target`, detail: `That’s about ${fmt(primeCostGbp)} this month. Most of the gap is staff hours on Mon–Tue afternoons.`, due: 'This week' },
    { level: 'warning' as Status, agent: 'suppliers', title: 'Milk price up 12% since 1 October', detail: 'Adds about £150 a month at current volumes. Compare one other supplier before the next order.', due: 'Next order' },
    { level: 'warning' as Status, agent: 'reviews', title: '3 Google reviews waiting for a reply (oldest 6 days)', detail: 'Two mention waiting times on Saturday morning. Replies are drafted and ready to approve.', due: 'Today' },
    { level: 'warning' as Status, agent: 'cfo', title: 'VAT return for the quarter to 31 Oct', detail: 'Estimated payment around £12,700. Due 7 December — set it aside now.', due: '7 Dec' },
  ]

  const insights = [
    { agent: 'growth', tag: 'Quiet days', title: 'Mon–Wed take less than half of a weekend day', detail: `Monday to Wednesday average ${fmt((byDow[0].avg + byDow[1].avg + byDow[2].avg) / 3)} a day against ${fmt(weekendAvg)} at weekends. Launching the Nova Weekday Club (6th visit free hot drink) with a £9.50 weekday lunch set is the cheapest lever.`, impact: '+£1,800 / month', confidence: 'Medium' },
    { agent: 'rota', tag: 'Staff hours', title: 'Cut one 2–5pm shift on Mon and Tue', detail: 'After 2pm on Mon–Tue the café takes about £55 an hour with three people on. Two can cover it, and some of the saved hours can go to Saturday 9–12, the busiest window of the week.', impact: '−£300 / month wages', confidence: 'High' },
    { agent: 'menu', tag: 'Pricing', title: 'Add 10p to milk drinks', detail: 'Latte, flat white and cappuccino sell about 2,000 cups a month. 10p each covers the milk increase with room to spare; most guests won’t notice.', impact: '+£165 / month', confidence: 'High' },
    { agent: 'menu', tag: 'Menu', title: 'Turkish Benedict is a hidden gem', detail: 'Highest margin on the breakfast menu but only 70 sold. Give it a photo, a “Chef’s pick” badge and the top spot on the Turkish breakfast list.', impact: '+£350 / month', confidence: 'Medium' },
    { agent: 'growth', tag: 'Delivery', title: 'Move regular delivery guests to the website', detail: `Delivery apps took ${fmt(commission)} in commission this month. Every £100 that moves to Nova’s own ordering keeps about £30. Add a “Order direct next time” card to every delivery bag.`, impact: '+£300 / month', confidence: 'Medium' },
    { agent: 'social', tag: 'Content', title: 'Post the Halloween pancakes before half-term', detail: 'Seasonal posts are the best performers. Three posts and two stories are drafted for the week of 26 Oct.', impact: 'Reach', confidence: 'Medium' },
  ]

  const team: Record<string, { status: 'demo' | 'needs' | 'ready'; label: string; coverage: number; last: string; open: number; next: string }> = {
    cfo: { status: 'demo', label: 'Running on sample data', coverage: 55, last: 'Mon 08:00', open: 3, next: 'Mon 2 Nov, 08:00' },
    growth: { status: 'demo', label: 'Running on sample data', coverage: 60, last: 'Mon 08:00', open: 2, next: 'Mon 2 Nov, 08:00' },
    menu: { status: 'demo', label: 'Running on sample data', coverage: 45, last: 'Mon 08:15', open: 2, next: 'Mon 2 Nov, 08:15' },
    suppliers: { status: 'needs', label: 'Needs invoices', coverage: 30, last: 'Fri 17:00', open: 1, next: 'After next upload' },
    social: { status: 'needs', label: 'Needs Instagram', coverage: 35, last: 'Thu 10:00', open: 1, next: 'Thu 29 Oct, 10:00' },
    reviews: { status: 'needs', label: 'Needs Google profile', coverage: 40, last: 'Daily 09:00', open: 3, next: 'Tomorrow 09:00' },
    rota: { status: 'needs', label: 'Needs rota hours', coverage: 25, last: 'Sun 18:00', open: 1, next: 'Sun 1 Nov, 18:00' },
    compliance: { status: 'demo', label: 'Running on sample data', coverage: 50, last: 'Daily 07:00', open: 2, next: 'Tomorrow 07:00' },
  }

  const threads = [
    { title: 'Fill quiet Mondays', agents: ['growth', 'social', 'rota', 'cfo'], steps: ['Theo plans the Weekday Club', 'Lily drafts the launch posts', 'Kai checks staff cover', 'Ada checks the margin'], state: 'Plan ready for your approval' },
    { title: 'Milk price rise', agents: ['suppliers', 'menu', 'cfo'], steps: ['Mo spots +12% on the invoice', 'Selin suggests +10p on milk drinks', 'Ada confirms the margin is back'], state: 'Waiting for your decision' },
    { title: 'Saturday morning rush', agents: ['reviews', 'rota', 'cfo'], steps: ['Sam sees waiting-time comments', 'Kai adds a 9–12 shift', 'Ada funds it from Mon–Tue hours'], state: 'Draft rota ready' },
    { title: 'Christmas menu', agents: ['menu', 'suppliers', 'compliance', 'social'], steps: ['Selin shortlists dishes', 'Mo prices ingredients', 'Nora updates allergens', 'Lily plans the reveal'], state: 'Starts 9 Nov' },
  ]

  const SOURCES = ['EPOS sales', 'Invoices', 'Bank', 'Rota', 'Menu', 'Reviews', 'Social']
  const uses: Record<string, string[]> = {
    cfo: ['EPOS sales', 'Invoices', 'Bank', 'Rota'],
    growth: ['EPOS sales', 'Reviews', 'Social'],
    menu: ['EPOS sales', 'Invoices', 'Menu'],
    suppliers: ['Invoices', 'EPOS sales'],
    social: ['Menu', 'Social', 'Reviews'],
    reviews: ['Reviews'],
    rota: ['Rota', 'EPOS sales'],
    compliance: ['Menu', 'Invoices'],
  }
  const sourceState: Record<string, 'sample' | 'live' | 'missing'> = { 'EPOS sales': 'sample', Invoices: 'sample', Bank: 'missing', Rota: 'missing', Menu: 'live', Reviews: 'missing', Social: 'missing' }

  const missing = [
    { name: 'EPOS connection', why: 'Replaces this sample with real sales, every 15 minutes', done: false },
    { name: 'Menu, prices & allergens', why: 'Live from the CMS', done: true },
    { name: 'Online orders & bookings', why: 'Live from the website', done: true },
    { name: 'Bank feed', why: 'Cash buffer, bills and VAT set-aside', done: false },
    { name: 'Rota & payroll hours', why: 'Real staff cost by day and hour', done: false },
    { name: 'Supplier invoices (Sept & Oct)', why: 'Food cost and price alerts', done: false },
    { name: 'Recipe costs for 41 dishes', why: 'True margin for every plate', done: false },
    { name: 'Google Business Profile', why: 'Reviews, replies and search views', done: false },
    { name: 'Instagram & TikTok', why: 'What content brings people in', done: false },
    { name: 'Waste log', why: 'What gets thrown away, and why', done: false },
  ]

  return {
    period: { from: days[0].date, to: days[DAYS - 1].date, label: '27 Sep – 24 Oct 2026', compare: 'previous 28 days' },
    days, takings, prior, tx, priorTx, net, growth, byDow, weekendAvg, heat, channels, commission,
    pct, prime, profit, costs, menu, popLine, marginLine, checks, score, urgent, insights, team, threads,
    SOURCES, uses, sourceState, missing,
  }
}
