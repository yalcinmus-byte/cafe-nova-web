import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { getMenu, getSettings, gbp } from '@/lib/data'

export const metadata: Metadata = { title: 'Menu', description: 'Full breakfast, Turkish, lunch, drinks and kids’ menu with prices — Cafe Nova Bistro, East Twickenham.' }

const DIET: Record<string, string> = { v: 'Vegetarian', vg: 'Vegan', gf: 'Gluten-free' }

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()])
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
                        <h3>{i.name}{i.localName && <span className="dish__local"> {i.localName}</span>}</h3>
                        <span className="menu-item__price">{gbp(i.price)}</span>
                      </div>
                      {i.description && <p>{i.description}</p>}
                      <p className="menu-item__meta">
                        {!i.available && <span className="tag tag--out">Sold out today</span>}
                        {i.dietary?.map((d) => <span key={d} className="tag">{DIET[d]}</span>)}
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
      <Footer s={settings} />
    </>
  )
}
