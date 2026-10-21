import Link from 'next/link'
import { HeroFilm } from '@/components/HeroFilm'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { PlatesCarousel, type Plate } from '@/components/PlatesCarousel'
import type { Media } from '@/payload-types'
import { getActiveTheme, getEvents, getPartners, getReviews, getService, getSettings, getShop, getSignatures, orderingState } from '@/lib/data'
import { OrderStrip, Products, Reviews, Seasonal, Values, Welcome } from '@/components/HomeSections'

export default async function Home() {
  const [settings, svc, dishes, events, theme, reviews, partners, shop] = await Promise.all([getSettings(), getService(), getSignatures(), getEvents(true), getActiveTheme(), getReviews(), getPartners(), getShop()])
  const order = orderingState(svc)
  const ORDER = ['istanbul-special-breakfast', 'full-english-breakfast', 'shakshuka-with-eggs', 'smashed-avocado-on-toast', 'turkish-eggs', 'roasted-mixed-vegetables-plate', 'chef-s-salad']
  const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? 99 : i }
  const plates: Plate[] = dishes
    .map((d) => { const m = typeof d.photo === 'object' ? (d.photo as Media | null) : null; return { d, src: m?.url || d.photoPath, alt: m?.alt } })
    .filter((x) => x.src)
    .sort((a, b) => rank(a.d.slug) - rank(b.d.slug))
    .map(({ d, src, alt }) => ({ id: d.id, slug: d.slug, name: d.name, localName: d.localName, description: d.description, price: d.price, photo: src as string, alt: alt || d.name }))
  const l = settings.links ?? {}

  return (
    <>
      <Header overlay />
      <RestaurantJsonLd s={settings} orderLive={order.live} />
      <main id="main">
        <HeroFilm orderLive={order.live} />

        <PlatesCarousel orderLive={order.live} plates={plates} />
        <OrderStrip live={order.live} apps={order.marketplaces} />
        <Seasonal theme={theme} />

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

        <Products partners={partners} shop={shop} orderLive={order.live} />
        <Values />
        <Reviews reviews={reviews} s={settings} />
        <Welcome facilities={settings.facilities ?? []} links={settings.links ?? {}} />

        <section className="place" aria-labelledby="place-title">
          <img src="/img/place/drone.webp" alt="Cafe Nova's corner frontage on Richmond Road with striped awnings and outdoor tables" className="place__img" loading="lazy" />
          <div className="place__card">
            <h2 id="place-title">On the corner of Richmond Road</h2>
            <address>{settings.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            <ul className="hours">{settings.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
            <p>A short walk from Richmond Bridge — good for a breakfast before the river, or a coffee after it.</p>
            <div className="row-ctas">
              <Link className="btn btn--river" href="/visit">Plan your visit</Link>
              {l.googleMaps && <a className="btn btn--outline" href={l.googleMaps}>Directions</a>}
            </div>
          </div>
        </section>

        <section className="hire" aria-labelledby="hire-title">
          <div className="wrap hire__inner">
            <div>
              <h2 id="hire-title">Evenings at Nova</h2>
              <p>After 5pm the café is yours: birthday brunches, Turkish meze nights, team breakfasts-for-dinner or a match on the big screen — with sound system, microphone and projector. Tell us your date and guest numbers.</p>
            </div>
            <Link className="btn btn--river" href="/private-hire">Book an evening</Link>
          </div>
        </section>
      </main>
      <Footer s={settings} />
    </>
  )
}
