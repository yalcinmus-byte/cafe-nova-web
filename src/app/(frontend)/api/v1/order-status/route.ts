import { NextResponse } from 'next/server'
import { db } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** Guest-facing status for one order; needs the private token from the confirmation link. */
export async function GET(req: Request) {
  const u = new URL(req.url)
  const ref = u.searchParams.get('ref') ?? ''
  const t = u.searchParams.get('t') ?? ''
  const payload = await db()
  const r = await payload.find({ collection: 'orders', overrideAccess: true, where: { ref: { equals: ref } }, limit: 1, depth: 0 })
  const o = r.docs[0]
  if (!o || !t || o.token !== t) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ status: o.status, payment: o.payment }, { headers: { 'Cache-Control': 'no-store' } })
}
