import { NextResponse } from 'next/server'
import { db, getService, orderingState } from '@/lib/data'
import { deliveryAreas, todaysSlots } from '@/lib/ordering'

export const dynamic = 'force-dynamic'

export async function GET() {
  const svc = await getService()
  const state = orderingState(svc)
  const slots = state.live ? await todaysSlots(await db(), svc) : []
  return NextResponse.json({
    live: state.live, paused: state.paused, message: state.message,
    collection: state.collection, delivery: state.delivery,
    payAtCounter: !!svc.payAtCounter, cardPayments: !!process.env.STRIPE_SECRET_KEY,
    deliveryFee: svc.deliveryFee ?? 0, deliveryMinimum: svc.deliveryMinimum ?? 0, deliveryAreas: deliveryAreas(svc),
    slots,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
