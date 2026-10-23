import Link from 'next/link'
import { HeroFilm } from '@/components/HeroFilm'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { PlatesCarousel, type Plate } from '@/components/PlatesCarousel'
import type { Media } from '@/payload-types'
import { getActiveTheme, getEvents, getPartners, getReviews, getService, getSettings, getShop, getShopItems, getSignatures, orderingState } from '@/lib/data'
import { BookEvent, FindUsBar, GoogleSection, Products, Seasonal, SupplierBar, TripadvisorSection, Values, Welcome } from '@/components/HomeSections'
import { ShopSection } from '@/components/ShopSection'
import { deliveryAreas } from '@/lib/ordering'

export default async function Home() {
  const [settings, svc, dishes, events, theme, reviews, partners, shop, shopItems] = await Promise.all([getSettings(), getService(), getSignatures(), getEvents(true), getActiveTheme(), getReviews(), getPartners(), getShop(), getShopItems()])
  const order = orderingState(svc)
  const ORDER = ['istanbul-special-breakfast', 'full-english-breakfast', 'shakshuka-with-eggs', 'smashed-avocado-on-toast', 'turkish-eggs', 'roasted-mixed-vegetables-plate', 'chef-s-salad']
  const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? 99 : i }
  const plates: Plate[] = dishes
    .map((d) => { const m = typeof d.photo === 'object' ? (d.photo as Media | null) : null; return { d, src: m?.url || d.photoPath, alt: m?.alt } })
    .filter((x) => x.src)
    .sort((a, b) => rank(a.d.slug) - rank(b.d.slug))
    .map(({ d, src, alt }) => ({ id: d.id, slug: d.slug, name: d.name, localName: d.localName, description: d.description, price: d.price, photo: src as string, alt: alt || d.name }))
  const shopOpts = {
    live: order.live, paused: order.paused, collection: order.collection, delivery: order.delivery,
    cardPayments: !!process.env.STRIPE_SECRET_KEY, payAtCounter: !!svc.payAtCounter, vendors: order.marketplaces,
    deliveryFee: svc.deliveryFee ?? 0, deliveryAreas: deliveryAreas(svc),
  }

  return (
    <>
      <Header overlay />
      <RestaurantJsonLd s={settings} orderLive={order.live} />
      <main id="main">
        <HeroFilm orderLive={order.live} />

        <PlatesCarousel orderLive={order.live} plates={plates} />
        <ShopSection items={shopItems} opts={shopOpts} />
        <Seasonal theme={theme} />
        <BookEvent />

        {events.length > 0 && (
          <section className="events-strip" aria-labelledby="events-title">
            <div className="wrap">
              <div className="section-head section-head--light">
                <h2 id="events-title">Festive & events</h2>
                <Link href="/events" className="link-light">All dates this year</Link>
              </div>
              <ol className="events-strip__list">
                {events.map((e) => (
                  <li key={e.id}>
                    <time dateTime={e.startsAt}>
                      <span className="d">{e.dateNote ? '—' : new Date(e.startsAt).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Europe/London' })}</span>
                      <span className="m">{new Date(e.startsAt).toLocaleDateString('en-GB', { month: 'short', timeZone: 'Europe/London' })}</span>
                    </time>
                    <div>
                      <h3>{e.title}</h3>
                      <p>{e.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <SupplierBar partners={partners} />
        <Products partners={partners} shop={shop} orderLive={order.live} />
        <Values />
        <GoogleSection s={settings} />
        <TripadvisorSection reviews={reviews} s={settings} />
        <Welcome facilities={settings.facilities ?? []} links={settings.links ?? {}} />
        <FindUsBar links={settings.links ?? {}} />
      </main>
      <Footer s={settings} />
    </>
  )
}
