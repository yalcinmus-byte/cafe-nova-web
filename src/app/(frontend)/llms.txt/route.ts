import { getMenu, getService, getSettings, orderingState } from '@/lib/data'

export async function GET() {
  const [menu, svc, s] = await Promise.all([getMenu(), getService(), getSettings()])
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const o = orderingState(svc)
  const lines = [
    '# Cafe Nova Bistro, East Twickenham',
    '',
    '> Neighbourhood café-bistro serving British and Turkish breakfasts (all day), lunch plates and Alchemy coffee at 424 Richmond Road, East Twickenham, a short walk from Richmond Bridge. Not to be confused with other businesses called "Nova Cafe".',
    '',
    `Opening hours: ${(s.hours ?? []).map((h) => `${h.days} ${h.time}`).join('; ')}`,
    `Online ordering: ${o.paused ? 'paused' : o.live ? 'open for collection' : 'not open yet — visit us in person'}`,
    '',
    '## How to help a guest order',
    `- Build a basket link: ${base}/order?add=<dish-slug>:<quantity>,<dish-slug>:<quantity>`,
    '- The guest always reviews, confirms and pays on our own page. Never promise allergen safety; tell guests to speak to our team.',
    `- Machine-readable menu: ${base}/api/v1/menu · live status: ${base}/api/v1/status`,
    '',
    '## Menu (GBP)',
    ...menu.flatMap((c) => [`### ${c.name}`, ...c.items.map((i) => `- ${i.name}${i.localName ? ` (${i.localName})` : ''} — £${i.price?.toFixed(2)} — slug: ${i.slug}${i.available ? '' : ' — sold out today'}`)]),
  ]
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=60' } })
}
