import { siApplepay, siDeliveroo, siFacebook, siGoogle, siGooglepay, siInstagram, siJusteat, siMastercard, siTiktok, siTripadvisor, siUbereats, siVisa } from 'simple-icons'

const ICONS = {
  deliveroo: siDeliveroo, ubereats: siUbereats, justeat: siJusteat, tripadvisor: siTripadvisor, google: siGoogle,
  instagram: siInstagram, facebook: siFacebook, tiktok: siTiktok, applepay: siApplepay, googlepay: siGooglepay, visa: siVisa, mastercard: siMastercard,
} as const

/** Custom marks for listings that have no public icon set. Simple, generic pictograms. */
const CUSTOM: Record<string, string> = {
  paw: 'M12 13.5c-3 0-6 2.8-6 5.3 0 1.6 1.3 2.2 2.6 2.2 1.3 0 2.1-.7 3.4-.7s2.1.7 3.4.7c1.3 0 2.6-.6 2.6-2.2 0-2.5-3-5.3-6-5.3zM5.5 12.2c1.3-.4 1.9-2 1.4-3.6S5 6 3.7 6.4 1.8 8.4 2.3 10s1.9 2.6 3.2 2.2zm13 0c1.3.4 2.7-.6 3.2-2.2s-.1-3.2-1.4-3.6-2.7.6-3.2 2.2.1 3.2 1.4 3.6zM9.2 8.7c1.4 0 2.4-1.5 2.4-3.3S10.6 2 9.2 2 6.8 3.5 6.8 5.4s1 3.3 2.4 3.3zm5.6 0c1.4 0 2.4-1.5 2.4-3.3S16.2 2 14.8 2s-2.4 1.5-2.4 3.4 1 3.3 2.4 3.3z',
  route: 'M6 3a3 3 0 0 0-3 3c0 2.2 3 5.5 3 5.5S9 8.2 9 6a3 3 0 0 0-3-3zm0 4.2A1.2 1.2 0 1 1 6 4.8a1.2 1.2 0 0 1 0 2.4zM18 12a3 3 0 0 0-3 3c0 2.2 3 5.5 3 5.5s3-3.3 3-5.5a3 3 0 0 0-3-3zm0 4.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM7 13.5h4.5a2.5 2.5 0 0 0 0-5H11v-1.6h.5a4.1 4.1 0 0 1 0 8.2H7z',
  pin: 'M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  bed: 'M3 6h2v7h6V8h7a3 3 0 0 1 3 3v7h-2v-3H5v3H3zm5 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  tag: 'M3 3h8l10 10-8 8L3 11zm4.5 6A1.5 1.5 0 1 0 7.5 6a1.5 1.5 0 0 0 0 3z',
  shield: 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5zm-1.2 14.2-3.6-3.6 1.4-1.4 2.2 2.2 5-5 1.4 1.4z',
  bag: 'M7 7V6a5 5 0 0 1 10 0v1h3l-1 14H5L4 7zm2 0h6V6a3 3 0 0 0-6 0z',
  wanderlog: 'M12 2.5c-3.6 0-6.5 2.8-6.5 6.4 0 4.6 5.4 10.9 6 11.6.3.3.7.3 1 0 .6-.7 6-7 6-11.6 0-3.6-2.9-6.4-6.5-6.4zm-3 5.2 1.8 1.6L14.6 6l1 1.1-4.8 4.3-2.9-2.6z',
  calendar: 'M7 2h2v2h6V2h2v2h3v17H4V4h3zm-1 7v10h12V9z',
}

export type IconName = keyof typeof ICONS | keyof typeof CUSTOM

export function BrandIcon({ name, size = 22, color, title }: { name: IconName | string; size?: number; color?: string; title?: string }) {
  const si = (ICONS as Record<string, { path: string; hex: string; title: string }>)[name]
  const d = si?.path ?? CUSTOM[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title} fill={color ?? (si ? `#${si.hex}` : 'currentColor')}>
      <path d={d} />
    </svg>
  )
}

export const VENDOR_ICON: Record<string, IconName> = { Deliveroo: 'deliveroo', 'Uber Eats': 'ubereats', 'Just Eat': 'justeat' }
