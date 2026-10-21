import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/Chrome'
import { OrderStatus } from '@/components/OrderStatus'
import { db, getSettings, gbp } from '@/lib/data'

export const metadata: Metadata = { title: 'Your order', robots: { index: false } }

export default async function OrderThanks({ params, searchParams }: { params: Promise<{ ref: string }>; searchParams: Promise<{ t?: string }> }) {
  const [{ ref }, { t }, settings] = await Promise.all([params, searchParams, getSettings()])
  const r = await (await db()).find({ collection: 'orders', overrideAccess: true, where: { ref: { equals: ref } }, limit: 1, depth: 0 })
  const o = r.docs[0]
  if (!o || !t || o.token !== t) notFound()
  const when = o.slot ? new Date(o.slot).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) : ''
  return (
    <>
      <Header />
      <main id="main" className="wrap order-page order-thanks">
        <header className="page-head">
          <p className="eyebrow">Order {o.ref}</p>
          <h1>Thank you, {o.customer.name.split(' ')[0]}.</h1>
          <p>{o.fulfilment === 'delivery' ? `We’ll bring it to ${o.customer.postcode} at about ${when}.` : `It’ll be ready to collect at ${when} from 424 Richmond Road.`} {o.payment === 'counter' ? `Please pay ${gbp(o.total)} at the counter.` : ''}</p>
        </header>
        <OrderStatus refCode={o.ref} token={t} initial={o.status} payment={o.payment} />
        <section className="basket">
          <h2>Your order</h2>
          <ul>{o.items.map((i) => <li key={i.id ?? i.slug}><span>{i.qty} × {i.name}</span><span>{gbp(i.qty * i.unitPrice)}</span></li>)}</ul>
          {o.deliveryFee ? <p className="basket__total"><span>Delivery</span><span>{gbp(o.deliveryFee)}</span></p> : null}
          <p className="basket__total"><span>Total</span><span>{gbp(o.total)}</span></p>
          {o.notes && <p className="small">Notes: {o.notes}</p>}
        </section>
        <p className="small">Keep this page open, or bookmark it, to follow your order. Questions? Pop in or call us.</p>
      </main>
      <Footer s={settings} />
    </>
  )
}
