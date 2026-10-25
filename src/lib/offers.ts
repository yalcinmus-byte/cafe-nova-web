import type { Offer, MenuItem } from '@/payload-types'

const DAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/** Current day, minutes since midnight and date in Europe/London. */
export function londonNow(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d).map((x) => [x.type, x.value]))
  return { day: p.weekday.toLowerCase().slice(0, 3), mins: Number(p.hour) * 60 + Number(p.minute), date: `${p.year}-${p.month}-${p.day}` }
}
const toMins = (t?: string | null) => (t ? Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) : null)

export function isLive(o: Offer, now = londonNow()) {
  if (!o.active) return false
  if (o.days?.length && !o.days.includes(now.day as never)) return false
  const f = toMins(o.from), t = toMins(o.to)
  if (f != null && now.mins < f) return false
  if (t != null && now.mins >= t) return false
  if (o.startDate && now.date < o.startDate.slice(0, 10)) return false
  if (o.endDate && now.date > o.endDate.slice(0, 10)) return false
  return true
}

const ids = (v: unknown) => (Array.isArray(v) ? v.map((x) => (typeof x === 'object' && x ? (x as { id: number }).id : x)) : [])

/** The best live offer for a dish, if any. */
export function offerFor(item: { id: number; category?: MenuItem['category'] | null }, offers: Offer[], now = londonNow()) {
  const cat = typeof item.category === 'object' && item.category ? item.category.id : item.category
  let best: Offer | null = null
  for (const o of offers) {
    if (!o.discount || !isLive(o, now)) continue
    if (ids(o.items).includes(item.id) || (cat != null && ids(o.categories).includes(cat))) if (!best || (o.discount ?? 0) > (best.discount ?? 0)) best = o
  }
  return best
}

export const discounted = (price: number, o: Offer | null) => (o?.discount ? Math.round(price * (100 - o.discount)) / 100 : price)

export function schedule(o: Offer) {
  const d = o.days ?? []
  const wk = ['mon', 'tue', 'wed', 'thu', 'fri']
  const days = !d.length || d.length === 7 ? 'Every day' : d.length === 5 && wk.every((x) => d.includes(x as never)) ? 'Mon–Fri' : d.length === 2 && d.includes('sat') && d.includes('sun') ? 'Weekends' : DAY.filter((x) => d.includes(x as never)).map((x) => x[0].toUpperCase() + x.slice(1)).join(', ')
  const hm = (t: string) => { const h = Number(t.slice(0, 2)), m = t.slice(3); return `${h % 12 || 12}${m !== '00' ? ':' + m : ''}${h < 12 ? 'am' : 'pm'}` }
  const time = o.from && o.to ? `${hm(o.from)}–${hm(o.to)}` : o.from ? `from ${hm(o.from)}` : o.to ? `until ${hm(o.to)}` : 'all day'
  return `${days} · ${time}`
}
