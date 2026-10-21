import { getMenu } from '@/lib/data'
export async function GET() {
  const menu = await getMenu()
  return Response.json({
    currency: 'GBP',
    updatedAt: new Date().toISOString(),
    sections: menu.map((c) => ({ name: c.name, slug: c.slug, items: c.items.map((i) => ({ slug: i.slug, name: i.name, localName: i.localName, description: i.description, pricePence: Math.round((i.price ?? 0) * 100), available: i.available, dietary: i.dietary, allergensConfirmed: (i.allergens?.length ?? 0) > 0 })) })),
  }, { headers: { 'cache-control': 'public, max-age=60' } })
}
