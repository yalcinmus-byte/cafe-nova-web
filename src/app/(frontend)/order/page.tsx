import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { db, getService, getSettings, orderingState, gbp } from '@/lib/data'

export const metadata: Metadata = { title: 'Order', description: 'Order from Cafe Nova Bistro for collection, or find us on delivery apps.' }

/** Accepts assistant-built baskets: /order?add=turkish-eggs:1,latte:2 */
export default async function OrderPage({ searchParams }: { searchParams: Promise<{ add?: string }> }) {
  const [{ add }, svc, settings] = await Promise.all([searchParams, getService(), getSettings()])
  const state = orderingState(svc)
  const merged = new Map<string, number>()
  for (const [slug, q] of (add ?? '').split(',').map((p) => p.split(':'))) if (slug) merged.set(slug, Math.min(20, (merged.get(slug) ?? 0) + Math.max(1, Number(q) || 1)))
  const wanted = [...merged].map(([slug, qty]) => ({ slug, qty }))
  const found = wanted.length
    ? (await (await db()).find({ collection: 'menu-items', where: { slug: { in: wanted.map((w) => w.slug) }, available: { equals: true } }, limit: 50, depth: 0 })).docs
    : []
  const basket = wanted.map((w) => ({ ...w, item: found.find((f) => f.slug === w.slug) })).filter((b) => b.item && b.item.price != null)
  const total = basket.reduce((s, b) => s + (b.item!.price ?? 0) * b.qty, 0)

  return (
    <>
      <Header />
      <main id="main" className="wrap order-page">
        <header className="page-head">
          <h1>Order</h1>
          {state.paused ? <p className="notice notice--paused">{state.message}</p> : state.live ? <p>Choose your dishes and a collection time.</p> : <p>Ordering on our own website opens in January. Until then, come in and see us, or use a delivery app below.</p>}
        </header>

        {basket.length > 0 && (
          <section className="basket" aria-labelledby="basket-title">
            <h2 id="basket-title">Your selection</h2>
            <ul>{basket.map((b) => <li key={b.slug}><span>{b.qty} × {b.item!.name}</span><span>{gbp((b.item!.price ?? 0) * b.qty)}</span></li>)}</ul>
            <p className="basket__total"><span>Total</span><span>{gbp(total)}</span></p>
            {state.live ? <button className="btn btn--river" type="button">Choose a collection time</button> : <p className="small">Show this list at the counter and we’ll get it started.</p>}
          </section>
        )}

        {state.marketplaces.length > 0 && (
          <section className="apps" aria-labelledby="apps-title">
            <h2 id="apps-title">Delivery apps</h2>
            <ul className="apps__list">{state.marketplaces.map((m) => <li key={m.id ?? m.name}><a className="btn btn--outline" href={m.url!}>{m.name}</a></li>)}</ul>
          </section>
        )}

        <div className="row-ctas"><Link className="btn btn--river" href="/menu">Browse the menu</Link><Link className="btn btn--outline" href="/visit">Find us</Link></div>
      </main>
      <Footer s={settings} />
    </>
  )
}
