import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { getMenu, getService, getSettings, gbp, orderingState } from '@/lib/data'
import { AddToBasket, BasketBar } from '@/components/AddToBasket'
import { Badges } from '@/components/Icons'

export const metadata: Metadata = { title: 'Menu', description: 'Full breakfast, Turkish, lunch, drinks and kids’ menu with prices — Cafe Nova Bistro, East Twickenham.' }


export default async function MenuPage() {
  const [menu, settings, svc] = await Promise.all([getMenu(), getSettings(), getService()])
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
                  {c.items.map((i) => (
                    <li key={i.id} id={i.slug} className={`menu-item ${i.available ? '' : 'is-out'}`}>
                      <div className="menu-item__top">
                        <h3>{i.badges?.includes('new') && <span className="new-flag">New</span>}{i.name}{i.localName && <span className="dish__local"> {i.localName}</span>}</h3>
                        <span className="menu-item__price">{gbp(i.price)}</span>
                        {live && i.available && i.orderable && i.price != null && <AddToBasket slug={i.slug} name={i.name} price={i.price} compact />}
                      </div>
                      {i.description && <p>{i.description}</p>}
                      <p className="menu-item__meta">
                        {!i.available && <span className="tag tag--out">Sold out today</span>}
                        <Badges badges={i.badges} diet={i.dietary} max={4} />
                        {i.extras && <span className="menu-item__extras">{i.extras}</span>}
                      </p>
                    </li>
                  ))}
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
