import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { getMenu, getOffers, getService, getSettings, gbp, orderingState } from '@/lib/data'
import { discounted, isLive, londonNow, offerFor, schedule } from '@/lib/offers'
import { AddToBasket, BasketBar } from '@/components/AddToBasket'
import { Badges } from '@/components/Icons'

export const metadata: Metadata = { title: 'Menu', description: 'Full breakfast, Turkish, lunch, drinks and kids’ menu with prices — Cafe Nova Bistro, East Twickenham.' }


export default async function MenuPage() {
  const [menu, settings, svc, offers] = await Promise.all([getMenu(), getSettings(), getService(), getOffers()])
  const now = londonNow()
  const live = orderingState(svc).live
  return (
    <>
      <Header />
      <RestaurantJsonLd s={settings} menu={menu} />
      <main id="main" className="menu-page wrap">
        <header className="page-head">
          <h1>Menu</h1>
          <p>Breakfast is served all day. Allergies? Please tell our team before ordering — we’ll check every dish with the kitchen.</p>
        </header>
        {offers.length > 0 && (
          <ul className="offer-strip" aria-label="Offers">
            {offers.map((o) => (
              <li key={o.id} className={isLive(o, now) ? 'is-live' : undefined}>
                <span className="offer-strip__tag">{isLive(o, now) ? 'On now' : 'Offer'}</span>
                <b>{o.title}</b>
                <span>{schedule(o)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="menu">
          <nav className="menu__nav" aria-label="Menu sections">
            <ul>{menu.map((c) => <li key={c.id}><a href={`#${c.slug}`}>{c.name}</a></li>)}</ul>
          </nav>
          <div className="menu__body">
            {menu.map((c) => (
              <section key={c.id} id={c.slug} className="menu__section" aria-labelledby={`h-${c.slug}`}>
                <h2 id={`h-${c.slug}`}>{c.name}</h2>
                {c.note && <p className="menu__note">{c.note}</p>}
                <ul className="menu__items">
                  {c.items.map((i) => {
                    const off = offerFor(i, offers, now)
                    const price = i.price != null ? discounted(i.price, off) : null
                    return (
                    <li key={i.id} id={i.slug} className={`menu-item ${i.available ? '' : 'is-out'}`}>
                      <div className="menu-item__top">
                        <h3>{i.badges?.includes('new') && <span className="new-flag">New</span>}{i.name}{i.localName && <span className="dish__local"> {i.localName}</span>}</h3>
                        <span className="menu-item__price">{off && <s>{gbp(i.price)}</s>}{gbp(price)}</span>
                        {live && i.available && i.orderable && price != null && <AddToBasket slug={i.slug} name={i.name} price={price} compact />}
                      </div>
                      {i.description && <p>{i.description}</p>}
                      <p className="menu-item__meta">
                        {!i.available && <span className="tag tag--out">Sold out today</span>}
                        <Badges badges={i.badges} diet={i.dietary} max={4} />
                        {off && <span className="tag tag--offer">{off.label || `${off.discount}% off now`}</span>}
                        {i.extras && <span className="menu-item__extras">{i.extras}</span>}
                      </p>
                      <p className="menu-item__allergy">
                        {i.allergens?.length ? <><b>Contains:</b> {i.allergens.map((a) => a[0].toUpperCase() + a.slice(1)).join(', ')}</> : <><b>Allergens:</b> please ask our team</>}
                        {i.allergyNote && <span> · {i.allergyNote}</span>}
                      </p>
                    </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      {live && <BasketBar />}
      <Footer s={settings} />
    </>
  )
}
