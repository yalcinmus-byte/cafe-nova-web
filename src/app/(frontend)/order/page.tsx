import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { OrderApp } from '@/components/OrderApp'
import { DeliveryApps } from '@/components/DeliveryApps'
import { db, getService, getSettings, orderingState } from '@/lib/data'

export const metadata: Metadata = { title: 'Order online', description: 'Order breakfast, lunch and coffee from Cafe Nova Bistro for collection or local delivery in East Twickenham, Richmond and St Margarets.' }

/** Accepts assistant-built baskets: /order?add=turkish-eggs:1,latte:2 */
export default async function OrderPage({ searchParams }: { searchParams: Promise<{ add?: string; cancelled?: string }> }) {
  const [{ add, cancelled }, svc, settings] = await Promise.all([searchParams, getService(), getSettings()])
  const state = orderingState(svc)
  const merged = new Map<string, number>()
  for (const [slug, q] of (add ?? '').split(',').map((p) => p.split(':'))) if (slug) merged.set(slug, Math.min(20, (merged.get(slug) ?? 0) + Math.max(1, Number(q) || 1)))
  const found = merged.size
    ? (await (await db()).find({ collection: 'menu-items', where: { slug: { in: [...merged.keys()] }, available: { equals: true }, orderable: { equals: true }, price: { exists: true } }, limit: 50, depth: 0 })).docs
    : []
  const incoming = found.map((d) => ({ slug: d.slug, name: d.name, price: d.price!, qty: merged.get(d.slug)! }))

  return (
    <>
      <Header />
      <main id="main" className="wrap order-page">
        <header className="page-head">
          <p className="eyebrow">Order online</p>
          <h1>Breakfast, to go</h1>
          <p>Order here and pick it up from the café at 424 Richmond Road{state.delivery ? ', or have it delivered nearby' : ''}. Freshly cooked for your time slot — skip the queue.</p>
          {cancelled && <p className="notice">Payment cancelled — your basket is still here.</p>}
        </header>
        {state.live || state.paused ? <OrderApp incoming={incoming} /> : (
          <p className="notice">Online ordering opens soon. Until then, come in and see us{state.marketplaces.length ? ', or use a delivery app below' : ''}.</p>
        )}

        <section className="apps" aria-label="Delivery apps">
          <DeliveryApps apps={state.marketplaces} title={state.delivery ? 'Also on the delivery apps' : 'Want it delivered? Use the delivery apps'} />
        </section>
        <div className="row-ctas"><Link className="btn btn--outline" href="/menu">Full menu</Link><Link className="btn btn--outline" href="/visit">Find us</Link></div>
      </main>
      <Footer s={settings} />
    </>
  )
}
