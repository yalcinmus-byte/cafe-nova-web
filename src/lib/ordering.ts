import 'server-only'
import crypto from 'node:crypto'
import type { Payload } from 'payload'

type Svc = {
  firstSlot?: string | null; lastSlot?: string | null; prepMinutes?: number | null; slotCapacity?: number | null
  deliveryPostcodes?: string | null; deliveryFee?: number | null; deliveryMinimum?: number | null
}

const TZ = 'Europe/London'

/** Offset (minutes) of Europe/London from UTC at a given instant. */
function londonOffset(at: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, timeZoneName: 'shortOffset' }).formatToParts(at)
  const off = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT'
  const m = off.match(/GMT([+-]\d+)(?::(\d+))?/)
  return m ? Number(m[1]) * 60 + Math.sign(Number(m[1])) * Number(m[2] ?? 0) : 0
}

function londonDateParts(at: Date) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at)
  return p // YYYY-MM-DD
}

/** A London wall-clock time today → real instant. */
function londonInstant(day: string, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const guess = new Date(`${day}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`)
  return new Date(guess.getTime() - londonOffset(guess) * 60000)
}

export type Slot = { iso: string; label: string; full: boolean }

/** Today's 15-minute collection/delivery slots from now + prep time, with capacity applied. */
export async function todaysSlots(payload: Payload, svc: Svc, now = new Date()): Promise<Slot[]> {
  const day = londonDateParts(now)
  const first = londonInstant(day, svc.firstSlot || '08:30')
  const last = londonInstant(day, svc.lastSlot || '16:15')
  const earliest = new Date(now.getTime() + (svc.prepMinutes ?? 20) * 60000)
  const slots: Date[] = []
  for (let t = first.getTime(); t <= last.getTime(); t += 15 * 60000) if (t >= earliest.getTime()) slots.push(new Date(t))
  if (!slots.length) return []
  const taken = await payload.find({
    collection: 'orders', overrideAccess: true, depth: 0, limit: 1000, pagination: false,
    where: { and: [{ slot: { greater_than_equal: slots[0].toISOString() } }, { slot: { less_than_equal: slots[slots.length - 1].toISOString() } }, { status: { not_equals: 'cancelled' } }] },
  })
  const cap = svc.slotCapacity ?? 6
  const count = new Map<string, number>()
  for (const o of taken.docs) if (o.slot) count.set(new Date(o.slot).toISOString(), (count.get(new Date(o.slot).toISOString()) ?? 0) + 1)
  return slots.map((d) => ({
    iso: d.toISOString(),
    label: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }),
    full: (count.get(d.toISOString()) ?? 0) >= cap,
  }))
}

/** "TW1 3AB" → "TW1". */
export function outwardCode(postcode: string) {
  const p = postcode.toUpperCase().replace(/\s+/g, '')
  return p.length > 3 ? p.slice(0, -3) : p
}

export function deliveryAreas(svc: Svc) {
  return (svc.deliveryPostcodes ?? '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)
}

export const newToken = () => crypto.randomBytes(18).toString('base64url')

export function newRef() {
  const n = crypto.randomInt(0, 36 ** 4).toString(36).toUpperCase().padStart(4, '0')
  return `N${n}`
}

/** Minimal Stripe Checkout via the REST API (no SDK). Active only when STRIPE_SECRET_KEY is set. */
export async function createStripeSession(opts: {
  ref: string; lines: { name: string; qty: number; unitPrice: number }[]; deliveryFee: number; email: string; successUrl: string; cancelUrl: string
}) {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  const f = new URLSearchParams()
  f.set('mode', 'payment')
  f.set('success_url', opts.successUrl)
  f.set('cancel_url', opts.cancelUrl)
  f.set('customer_email', opts.email)
  f.set('client_reference_id', opts.ref)
  f.set('metadata[ref]', opts.ref)
  const all = [...opts.lines, ...(opts.deliveryFee > 0 ? [{ name: 'Delivery', qty: 1, unitPrice: opts.deliveryFee }] : [])]
  all.forEach((l, i) => {
    f.set(`line_items[${i}][quantity]`, String(l.qty))
    f.set(`line_items[${i}][price_data][currency]`, 'gbp')
    f.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.unitPrice * 100)))
    f.set(`line_items[${i}][price_data][product_data][name]`, l.name)
  })
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: f,
  })
  if (!r.ok) throw new Error(`Stripe ${r.status}: ${await r.text()}`)
  return (await r.json()) as { id: string; url: string }
}

/** Verify a Stripe webhook signature header (t=…,v1=…). */
export function verifyStripe(raw: string, header: string | null, secret: string, toleranceSec = 300) {
  if (!header) return false
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.split('=') as [string, string]))
  const t = Number(parts.t)
  if (!t || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex')
  const sigs = header.split(',').filter((kv) => kv.startsWith('v1=')).map((kv) => kv.slice(3))
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)))
}
