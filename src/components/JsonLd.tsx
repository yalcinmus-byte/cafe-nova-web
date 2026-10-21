import type { MenuSection } from '@/lib/data'

type S = { address?: string | null; phone?: string | null; links?: Record<string, string | null | undefined> | null }

export function RestaurantJsonLd({ s, menu, orderLive = false }: { s: S; menu?: MenuSection[]; orderLive?: boolean }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Cafe Nova Bistro',
    alternateName: 'Cafe Nova Bistro, East Twickenham',
    url: base,
    image: `${base}/img/place/drone.webp`,
    servesCuisine: ['British', 'Turkish', 'Breakfast', 'Brunch', 'Coffee'],
    priceRange: '££',
    address: { '@type': 'PostalAddress', streetAddress: '424 Richmond Road', addressLocality: 'East Twickenham', addressRegion: 'London', addressCountry: 'GB' },
    telephone: s.phone || undefined,
    sameAs: Object.values(s.links ?? {}).filter(Boolean),
    hasMenu: `${base}/menu`,
    acceptsReservations: false,
    potentialAction: orderLive ? { '@type': 'OrderAction', target: { '@type': 'EntryPoint', urlTemplate: `${base}/order?add={dish-slug}:{quantity}`, inLanguage: 'en-GB' } } : undefined,
    ...(menu && {
      hasMenu: {
        '@type': 'Menu',
        name: 'Cafe Nova menu',
        hasMenuSection: menu.map((c) => ({
          '@type': 'MenuSection',
          name: c.name,
          hasMenuItem: c.items.map((i) => ({
            '@type': 'MenuItem',
            name: i.localName ? `${i.name} (${i.localName})` : i.name,
            description: i.description || undefined,
            offers: { '@type': 'Offer', price: i.price?.toFixed(2), priceCurrency: 'GBP' },
            suitableForDiet: i.dietary?.map((d) => ({ v: 'https://schema.org/VegetarianDiet', vg: 'https://schema.org/VeganDiet', gf: 'https://schema.org/GlutenFreeDiet' })[d]),
          })),
        })),
      },
    }),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
