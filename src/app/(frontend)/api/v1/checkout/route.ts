import { NextResponse } from 'next/server'
import { db, getService, orderingState } from '@/lib/data'
import { createStripeSession, deliveryAreas, newRef, newToken, outwardCode, todaysSlots } from '@/lib/ordering'

export const dynamic = 'force-dynamic'

type Body = {
  lines?: { slug: string; qty: number }[]
  fulfilment?: 'collection' | 'delivery'
  slot?: string
  pay?: 'online' | 'counter'
  customer?: { name?: string; phone?: string; email?: string; address?: string; postcode?: string }
  notes?: string
  website?: string
}

const bad = (message: string, status = 400) => NextResponse.json({ error: message }, { status })
const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.trim().slice(0, n) : '')

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body
  if (body.website) return bad('Invalid submission')
  const payload = await db()
  const svc = await getService()
  const state = orderingState(svc)
  if (!state.live) return bad(state.paused ? state.message || 'Online ordering is paused.' : 'Online ordering is not open yet.', 409)

  const fulfilment = body.fulfilment === 'delivery' ? 'delivery' : 'collection'
  if (fulfilment === 'delivery' && !state.delivery) return bad('Delivery isn’t available right now — collection only.')
  if (fulfilment === 'collection' && !state.collection) return bad('Collection isn’t available right now.')

  // Basket: prices always come from the CMS, never from the browser.
  const wanted = new Map<string, number>()
  for (const l of body.lines ?? []) if (l?.slug) wanted.set(String(l.slug), Math.min(20, (wanted.get(String(l.slug)) ?? 0) + Math.max(1, Math.floor(Number(l.qty) || 1))))
  if (!wanted.size) return bad('Your basket is empty.')
  const found = await payload.find({ collection: 'menu-items', depth: 0, limit: 100, where: { slug: { in: [...wanted.keys()] }, available: { equals: true }, orderable: { equals: true }, price: { exists: true } } })
  const items = found.docs.map((d) => ({ slug: d.slug, name: d.name, qty: wanted.get(d.slug)!, unitPrice: d.price! }))
  if (items.length !== wanted.size) return bad('Some dishes in your basket aren’t available any more — please check your basket.')
  const subtotal = Math.round(items.reduce((s, i) => s + i.qty * i.unitPrice, 0) * 100) / 100

  const c = body.customer ?? {}
  const customer = { name: clip(c.name, 80), phone: clip(c.phone, 30), email: clip(c.email, 120), address: clip(c.address, 300), postcode: clip(c.postcode, 10).toUpperCase() }
  if (!customer.name || !customer.phone || !/^\S+@\S+\.\S+$/.test(customer.email)) return bad('Please add your name, phone and email.')

  let deliveryFee = 0
  if (fulfilment === 'delivery') {
    if (!customer.address || !customer.postcode) return bad('Please add your delivery address and postcode.')
    const areas = deliveryAreas(svc)
    if (areas.length && !areas.includes(outwardCode(customer.postcode))) return bad(`Sorry, we deliver to ${areas.join(', ')} only. Collection is always available.`)
    if (subtotal < (svc.deliveryMinimum ?? 0)) return bad(`The minimum for delivery is £${(svc.deliveryMinimum ?? 0).toFixed(2)}.`)
    deliveryFee = svc.deliveryFee ?? 0
  }

  const slots = await todaysSlots(payload, svc)
  const slot = slots.find((s) => s.iso === body.slot) ?? (body.slot === 'asap' ? slots.find((s) => !s.full) : undefined)
  if (!slot) return bad(slots.length ? 'Please choose a time.' : 'We’ve stopped taking orders for today — please come back tomorrow.')
  if (slot.full) return bad('That time has just filled up — please choose another.')

  const stripeOn = !!process.env.STRIPE_SECRET_KEY
  const counter = body.pay === 'counter' && fulfilment === 'collection' && !!svc.payAtCounter
  if (!stripeOn && !counter) return bad(fulfilment === 'delivery' ? 'Card payment for delivery is being set up — please choose collection for now.' : 'Please choose to pay at the counter.')

  const ref = newRef()
  const token = newToken()
  const total = Math.round((subtotal + deliveryFee) * 100) / 100
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  const order = await payload.create({
    collection: 'orders', overrideAccess: true,
    data: { ref, status: 'new', fulfilment, slot: slot.iso, items, subtotal, deliveryFee, total, payment: counter ? 'counter' : 'unpaid', customer, notes: clip(body.notes, 600), token },
  })
  const thanks = `${base}/order/${ref}?t=${token}`
  if (counter) return NextResponse.json({ url: thanks, ref })

  try {
    const session = await createStripeSession({ ref, lines: items, deliveryFee, email: customer.email, successUrl: thanks, cancelUrl: `${base}/order?cancelled=${ref}` })
    await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { stripeSession: session!.id } })
    return NextResponse.json({ url: session!.url, ref })
  } catch (e) {
    await payload.update({ collection: 'orders', id: order.id, overrideAccess: true, data: { status: 'cancelled' } })
    payload.logger.error(e)
    return bad('Card payment is unavailable right now — please try again or pay at the counter.', 502)
  }
}
