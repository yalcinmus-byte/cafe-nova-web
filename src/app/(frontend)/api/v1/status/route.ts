import { getService, orderingState } from '@/lib/data'
export async function GET() {
  const o = orderingState(await getService())
  return Response.json({ ordering: o.live ? 'open' : o.paused ? 'paused' : 'not-live', collection: o.collection, delivery: o.delivery, checkedAt: new Date().toISOString() }, { headers: { 'cache-control': 'no-store' } })
}
