import { HeroFilm } from '@/components/HeroFilm'
import { Header, Footer } from '@/components/Chrome'
import { RestaurantJsonLd } from '@/components/JsonLd'
import { PlatesCarousel, type Plate } from '@/components/PlatesCarousel'
import type { Media } from '@/payload-types'
import { getActiveTheme, getHomeEvents, getHomepage, getJobs, getReviews, getService, getSettings, getShop, getShopItems, getSignatures, orderingState } from '@/lib/data'
import { BookEvent, CareersTeaser, EventsStrip, FindUsBar, GoogleSection, NewOnMenu, Products, Seasonal, TripadvisorSection, Values, Welcome } from '@/components/HomeSections'
import { ShopSection } from '@/components/ShopSection'
import { deliveryAreas } from '@/lib/ordering'

export default async function Home() {
  const [settings, svc, dishes, events, theme, reviews, shop, shopItems, home, jobs] = await Promise.all([getSettings(), getService(), getSignatures(), getHomeEvents(), getActiveTheme(), getReviews(), getShop(), getShopItems(), getHomepage(), getJobs()])
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
        <HeroFilm orderLive={order.live} title={home.hero?.title} text={home.hero?.text} captions={home.hero?.captions} />
        {home.plates?.show !== false && <PlatesCarousel orderLive={order.live} plates={plates} head={home.plates} />}
        {home.shop?.show !== false && <ShopSection items={shopItems} opts={shopOpts} head={home.shop} />}
        <NewOnMenu c={home.newOnMenu} />
        <Seasonal theme={theme} />
        <BookEvent c={home.book} />
        <EventsStrip c={home.events} events={events} />
        <Products c={home.products} shop={shop} orderLive={order.live} />
        <Values c={home.values} />
        <GoogleSection c={home.google} s={settings} reviews={reviews} />
        <TripadvisorSection c={home.tripadvisor} reviews={reviews} s={settings} />
        <Welcome c={home.welcome} facilities={settings.facilities ?? []} fsa={settings.links?.fsa} />
        <CareersTeaser c={home.careers} fallback={jobs[0]} />
        {home.findUs?.show !== false && <FindUsBar title={home.findUs?.title} links={settings.links ?? {}} />}
      </main>
      <Footer s={settings} />
    </>
  )
}
