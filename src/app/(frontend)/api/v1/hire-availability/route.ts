import { NextResponse } from 'next/server'
import { db } from '@/lib/data'

export const dynamic = 'force-dynamic'

/** Dates already booked for private hire (status "Booked"). Dates only — no guest details. */
export async function GET() {
  const payload = await db()
  const r = await payload.find({
    collection: 'enquiries', overrideAccess: true, depth: 0, limit: 500, pagination: false,
    where: { and: [{ kind: { equals: 'event' } }, { status: { equals: 'booked' } }, { date: { greater_than: new Date(Date.now() - 864e5).toISOString() } }] },
    select: { date: true },
  })
  const booked = [...new Set(r.docs.map((d) => (d.date ? new Date(d.date).toISOString().slice(0, 10) : null)).filter(Boolean))]
  return NextResponse.json({ booked }, { headers: { 'Cache-Control': 'no-store' } })
}
