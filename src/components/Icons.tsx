/** Line icons for facilities and badges — one consistent 24px stroke set. */
const P: Record<string, React.ReactNode> = {
  dog: <><path d="M5 11c-1.5 0-2.5-1.3-2.5-3S4 4 5.5 4.5 7 7 7 7" /><path d="M7 7c1-2 3-3 5-3s4 1 5 3" /><path d="M17 7s.5-3 2-2.5S21.5 6.5 21.5 8s-1 3-2.5 3" /><path d="M7 7c-.7 3-.6 6 .5 8.5C8.7 18 10.2 20 12 20s3.3-2 4.5-4.5c1.1-2.5 1.2-5.5.5-8.5" /><circle cx="10" cy="11" r=".6" fill="currentColor" /><circle cx="14" cy="11" r=".6" fill="currentColor" /><path d="M11 15h2l-1 1.2z" /></>,
  run: <><circle cx="14.5" cy="4.5" r="1.8" /><path d="M8 21l3-6 3 2v4" /><path d="M6 12l3-4 4 1 2 3 3 1" /><path d="M11 15l2-6" /></>,
  bike: <><circle cx="6" cy="16" r="3.5" /><circle cx="18" cy="16" r="3.5" /><path d="M6 16l4-7h5l3 7" /><path d="M10 9l2 7h-6" /><path d="M14 6h2.5" /></>,
  rowing: <><path d="M2 17c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1" /><path d="M3 13h18l-2 2.5H5z" /><path d="M8 13l-3-8" /><path d="M16 13l3-8" /><circle cx="12" cy="8.5" r="1.6" /></>,
  river: <><path d="M2 8c2 0 2-1.5 4-1.5S8 8 10 8s2-1.5 4-1.5S16 8 18 8s2-1.5 4-1.5" /><path d="M2 13c2 0 2-1.5 4-1.5S8 13 10 13s2-1.5 4-1.5S16 13 18 13s2-1.5 4-1.5" /><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5S16 18 18 18s2-1.5 4-1.5" /></>,
  family: <><circle cx="7" cy="5" r="2" /><circle cx="17" cy="5" r="2" /><circle cx="12" cy="11" r="1.6" /><path d="M4 21v-7a3 3 0 0 1 6 0v7" /><path d="M14 21v-7a3 3 0 0 1 6 0v7" /><path d="M10.5 21v-4a1.5 1.5 0 0 1 3 0v4" /></>,
  party: <><path d="M4 20l5-14 9 9z" /><path d="M8 11l5 5" /><path d="M15 3v2M19 5l-1.5 1.5M21 9h-2M12 4l.5 1.5" /></>,
  hygiene: <><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  coffee: <><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 3c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  pepper: <><path d="M14 6c3 0 6 2 6 6 0 5-6 9-12 9 0 0 3-3 3-8 0-4 1-7 3-7z" /><path d="M14 6c0-2 1-3 3-3" /></>,
  leaf: <><path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z" /><path d="M5 19l8-8" /></>,
  star: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
  fire: <path d="M12 21c4 0 7-2.7 7-6.5 0-4-3-5.5-4-9-1.5 2-2 3.5-2 5-1-1-2-2-2-4-3 2.5-6 5.5-6 8 0 3.8 3 6.5 7 6.5z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chef: <><path d="M7 14a4 4 0 1 1 1.3-7.8A4 4 0 0 1 16 6a4 4 0 1 1 1 8" /><path d="M7 14h10v6H7z" /></>,
}

export function Icon({ name, size = 28, className = '' }: { name: string; size?: number; className?: string }) {
  const d = P[name] ?? P.heart
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  )
}

export const BADGES: Record<string, { label: string; icon: string; tone: string }> = {
  new: { label: 'New', icon: 'spark', tone: 'new' },
  popular: { label: 'Popular', icon: 'heart', tone: 'popular' },
  bestseller: { label: 'Top seller', icon: 'fire', tone: 'best' },
  chefs: { label: 'Chef’s special', icon: 'chef', tone: 'chef' },
  seasonal: { label: 'Seasonal', icon: 'leaf', tone: 'season' },
  spicy: { label: 'Spicy', icon: 'pepper', tone: 'spicy' },
  healthy: { label: 'Healthy choice', icon: 'leaf', tone: 'healthy' },
  kids: { label: 'Kids’ favourite', icon: 'star', tone: 'kids' },
  limited: { label: 'Limited time', icon: 'clock', tone: 'limited' },
  turkish: { label: 'Signature Turkish', icon: 'star', tone: 'turkish' },
}

export function Badges({ badges, diet, max = 3 }: { badges?: string[] | null; diet?: string[] | null; max?: number }) {
  const DIET: Record<string, string> = { v: 'Vegetarian', vg: 'Vegan', gf: 'Gluten-free', df: 'Dairy-free' }
  const b = (badges ?? []).filter((x) => BADGES[x]).slice(0, max)
  const d = (diet ?? []).filter((x) => DIET[x])
  if (!b.length && !d.length) return null
  return (
    <span className="badges-row">
      {b.map((x) => <span key={x} className={`badge-pill badge-pill--${BADGES[x].tone}`}><Icon name={BADGES[x].icon} size={13} />{BADGES[x].label}</span>)}
      {d.map((x) => <span key={x} className="badge-pill badge-pill--diet">{DIET[x]}</span>)}
    </span>
  )
}
