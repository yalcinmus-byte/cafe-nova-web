import { NextResponse } from 'next/server'
import { db } from '@/lib/data'
import { verifyStripe } from '@/lib/ordering'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const raw = await req.text()
  if (!secret || !verifyStripe(raw, req.headers.get('stripe-signature'), secret)) return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  const event = JSON.parse(raw) as { type: string; data: { object: { id: string; payment_status?: string } } }
  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const payload = await db()
    const r = await payload.find({ collection: 'orders', overrideAccess: true, where: { stripeSession: { equals: event.data.object.id } }, limit: 1 })
    if (r.docs[0]) await payload.update({ collection: 'orders', id: r.docs[0].id, overrideAccess: true, data: { payment: 'paid' } })
  }
  return NextResponse.json({ received: true })
}
