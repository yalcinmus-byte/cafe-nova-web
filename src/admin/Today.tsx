import React from 'react'
import { getSample } from './hq-sample'
import Link from 'next/link'
import type { Payload } from 'payload'

type Props = { payload: Payload }

const Pill = ({ on, label }: { on: boolean; label: string }) => (
  <span className={`nova-pill ${on ? 'is-on' : 'is-off'}`}>
    <i aria-hidden="true" />
    {label}: {on ? 'On' : 'Off'}
  </span>
)

export async function Today({ payload }: Props) {
  const hq = getSample()
  const startOfDay = new Date(); startOfDay.setUTCHours(0, 0, 0, 0)
  const [svc, items, events, themes, enq, orders] = await Promise.all([
    payload.findGlobal({ slug: 'service-control' }),
    payload.find({ collection: 'menu-items', limit: 0, pagination: false, depth: 0 }),
    payload.find({ collection: 'events', where: { startsAt: { greater_than: new Date().toISOString() } }, limit: 3, sort: 'startsAt', depth: 0 }),
    payload.find({ collection: 'themes', limit: 20, depth: 0 }),
    payload.find({ collection: 'enquiries', where: { status: { equals: 'new' } }, limit: 3, sort: '-createdAt', depth: 0, overrideAccess: true }),
    payload.find({ collection: 'orders', where: { createdAt: { greater_than: startOfDay.toISOString() }, status: { not_equals: 'cancelled' } }, limit: 200, depth: 0, overrideAccess: true }),
  ])
  const openOrders = orders.docs.filter((o) => ['new', 'accepted', 'preparing', 'ready'].includes(o.status) && o.payment !== 'unpaid').length
  const takings = orders.docs.filter((o) => o.payment !== 'unpaid').reduce((s, o) => s + o.total, 0)
  const all = items.docs
  const soldOut = all.filter((d) => !d.available).length
  const noPrice = all.filter((d) => d.price == null).length
  const noAllergens = all.filter((d) => !d.allergens || d.allergens.length === 0).length
  const now = Date.now()
  const active = themes.docs.find(
    (t) => t.mode === 'on' || (t.mode === 'auto' && t.startsAt && t.endsAt && Date.parse(t.startsAt) <= now && now < Date.parse(t.endsAt)),
  )
  const hour = new Date().toLocaleString('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' })
  const greet = Number(hour) < 12 ? 'Good morning' : Number(hour) < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <section className="nova-today">
      <header className="nova-today__head">
        <div>
          <h1>{greet}.</h1>
          <p>Here is how Cafe Nova looks online right now.</p>
        </div>
        <a className="nova-btn nova-btn--ghost" href="/" target="_blank" rel="noreferrer">Open the website</a>
      </header>

      <div className="nova-today__grid">
        <article className={`nova-card nova-card--service ${svc.emergencyPause ? 'is-paused' : ''}`}>
          <h2>Online ordering</h2>
          {svc.emergencyPause ? (
            <p className="nova-big">Paused</p>
          ) : (
            <p className="nova-big">{svc.directOrdering ? 'Taking orders' : 'Not live yet'}</p>
          )}
          <div className="nova-pills">
            <Pill on={!!svc.directOrdering && !svc.emergencyPause} label="Website orders" />
            <Pill on={!!svc.collection} label="Collection" />
            <Pill on={!!svc.delivery} label="Delivery" />
            <Pill on={!!svc.coffeeShop} label="Coffee shop" />
          </div>
          <Link className="nova-btn" href="/admin/globals/service-control">Change service</Link>
        </article>

        <article className="nova-card">
          <h2>Menu health</h2>
          <p className="nova-big">{all.length} dishes</p>
          <ul className="nova-list">
            <li><b>{soldOut}</b> marked unavailable today</li>
            <li><b>{noPrice}</b> missing a price (hidden on the site)</li>
            <li><b>{noAllergens}</b> waiting for kitchen allergen check</li>
          </ul>
          <Link className="nova-btn nova-btn--ghost" href="/admin/collections/menu-items">Edit the menu</Link>
        </article>

        <article className="nova-card">
          <h2>Coming up</h2>
          {events.docs.length === 0 ? (
            <p className="nova-muted">No events scheduled. Add one so the homepage highlights stay fresh.</p>
          ) : (
            <ul className="nova-list">
              {events.docs.map((e) => (
                <li key={e.id}>
                  <b>{new Date(e.startsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/London' })}</b> {e.title}
                </li>
              ))}
            </ul>
          )}
          <Link className="nova-btn nova-btn--ghost" href="/admin/collections/events/create">Add an event</Link>
        </article>

        <article className="nova-card nova-card--hq">
          <h2>Nova HQ</h2>
          <p className="nova-big">{hq.score}<small style={{ fontSize: '0.45em', opacity: 0.7 }}>/100 health</small></p>
          <p className="nova-muted">{hq.urgent.filter((u) => u.level === 'critical' || u.level === 'serious').length} urgent · {hq.urgent.length} need you · {hq.insights.length} suggestions from your AI team (sample data)</p>
          <a className="nova-btn" href="/admin/hq">Open Nova HQ</a>
        </article>

        <article className="nova-card">
          <h2>Online orders today</h2>
          <p className="nova-big">{orders.docs.length}</p>
          <p className="nova-muted">{openOrders} open · £{takings.toFixed(2)} ordered today</p>
          <a className="nova-btn" href="/admin/kitchen">Open kitchen screen</a>
        </article>

        <article className="nova-card">
          <h2>New enquiries</h2>
          <p className="nova-big">{enq.totalDocs}</p>
          {enq.docs.length > 0 ? (
            <ul className="nova-list">{enq.docs.map((e) => <li key={e.id}><Link href={`/admin/collections/enquiries/${e.id}`}>{e.name}</Link> · {e.kind === 'event' ? `event${e.guests ? `, ${e.guests} guests` : ''}` : e.kind}</li>)}</ul>
          ) : <p className="nova-muted">All caught up.</p>}
          <Link className="nova-btn nova-btn--ghost" href="/admin/collections/enquiries">Open inbox</Link>
        </article>

        <article className="nova-card">
          <h2>Seasonal theme</h2>
          <p className="nova-big">{active ? active.name : 'Everyday Nova'}</p>
          <p className="nova-muted">
            {active?.endsAt ? `Switches off ${new Date(active.endsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'Europe/London' })}.` : 'Themes switch on and off by themselves.'}
          </p>
          <Link className="nova-btn nova-btn--ghost" href="/admin/collections/themes">Manage themes</Link>
        </article>
      </div>
    </section>
  )
}
