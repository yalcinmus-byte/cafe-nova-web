import Link from 'next/link'
import type { Event, Homepage, Job, Media, MenuItem, Partner, Review, Theme } from '@/payload-types'
import { NovaArcs } from './NovaLogo'
import { AddToBasket } from './AddToBasket'
import { BrandIcon } from './BrandIcon'
import { BookingCalendar } from './BookingCalendar'
import { EnquiryForm } from './EnquiryForm'
import { Badges, Icon } from './Icons'
import { HygieneRating } from './HygieneRating'

type Links = Record<string, string | null | undefined>
type L = Links
type Head = { show?: boolean | null; eyebrow?: string | null; title?: string | null; text?: string | null }
const ext = { rel: 'noopener', target: '_blank' } as const
const gbp = (n?: number | null) => (n == null ? '' : `£${n.toFixed(2)}`)

function SectionHead({ h, id, light = false, children }: { h: Head; id: string; light?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`section-head ${light ? 'section-head--light' : ''}`}>
      {h.eyebrow && <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{h.eyebrow}</p>}
      {h.title && <h2 id={id}>{h.title}</h2>}
      {h.text && <p>{h.text}</p>}
      {children}
    </div>
  )
}

export function Values({ c }: { c: Homepage['values'] }) {
  if (c?.show === false) return null
  return (
    <section className="values" aria-labelledby="values-title">
      <div className="wrap values__inner">
        <div className="values__intro">
          {c?.eyebrow && <p className="eyebrow eyebrow--light">{c.eyebrow}</p>}
          <h2 id="values-title">{c?.title}</h2>
          {c?.text && <p>{c.text}</p>}
          <Link href="/about" className="link-light">Our story →</Link>
        </div>
        <ul className="values__list">
          {(c?.items ?? []).map((v) => <li key={v.id ?? v.title}><h3>{v.title}</h3><p>{v.text}</p></li>)}
        </ul>
      </div>
      <NovaArcs className="values__arcs" />
    </section>
  )
}

export function Products({ c, shop, orderLive }: { c: Homepage['products']; shop: MenuItem[]; orderLive: boolean }) {
  if (c?.show === false) return null
  const img = (typeof c?.takeHomeImage === 'object' && (c.takeHomeImage as Media | null)?.url) || c?.takeHomeImagePath || '/img/coffee-pack.svg'
  return (
    <section className="products" aria-labelledby="products-title">
      <div className="wrap">
        <SectionHead h={c ?? {}} id="products-title" />
        {shop.length > 0 && (
          <div className="take-home">
            <div className="take-home__img"><img src={img} alt="A bag of speciality coffee beans to take home" loading="lazy" /></div>
            <div>
              <h3>{c?.takeHomeTitle}</h3>
              <p>{c?.takeHomeText}</p>
              <ul>
                {shop.map((s) => (
                  <li key={s.id}>
                    <span>{s.name.replace('Alchemy Coffee — ', '')}</span>
                    <span className="take-home__price">{gbp(s.price)}</span>
                    {orderLive && <AddToBasket slug={s.slug} name={s.name} price={s.price!} compact />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function Welcome({ c, facilities, fsa }: { c: Homepage['welcome']; facilities: { id?: string | null; title: string; icon?: string | null; text?: string | null; link?: string | null; links?: { id?: string | null; label: string; url: string; note?: string | null }[] | null }[]; fsa?: string | null }) {
  if (c?.show === false) return null
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="wrap">
        <SectionHead h={c ?? {}} id="welcome-title" />
        <ul className="welcome__grid">
          {facilities.map((f) => (
            <li key={f.id ?? f.title} className={`fac fac--${f.icon ?? 'heart'}`}>
              <span className="fac__icon"><Icon name={f.icon ?? 'heart'} size={30} /></span>
              <h3>{f.title}</h3>
              {f.text && <p>{f.text}</p>}
              {f.icon === 'hygiene' && <HygieneRating rating={5} href={f.links?.[0]?.url ?? fsa} />}
              {f.links && f.links.length > 0 && f.icon !== 'hygiene' && (
                <ul className="fac__links">
                  {f.links.map((k) => (
                    <li key={k.id ?? k.label}><a href={k.url} {...(k.url.startsWith('http') ? ext : {})}><b>{k.label}</b>{k.note && <small>{k.note}</small>}<span aria-hidden="true">→</span></a></li>
                  ))}
                </ul>
              )}
              {f.link && !(f.links && f.links.length) && <a className="fac__more" href={f.link} {...(f.link.startsWith('http') ? ext : {})}>{f.link.startsWith('/') ? 'Find out more' : 'Visit website'} →</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Seasonal({ theme }: { theme: Theme | null }) {
  if (!theme || !theme.headline) return null
  const m = typeof theme.image === 'object' ? (theme.image as Media | null) : null
  const src = m?.url || theme.imagePath
  const items = (theme.seasonalItems ?? []).filter((x): x is MenuItem => typeof x === 'object' && !!x && x.available !== false)
  return (
    <section className={`seasonal seasonal--${theme.decor ?? 'none'}`} aria-labelledby="seasonal-title">
      <div className="wrap seasonal__inner">
        <div>
          <p className="eyebrow eyebrow--light">{theme.name}</p>
          <h2 id="seasonal-title">{theme.headline}</h2>
          {theme.blurb && <p>{theme.blurb}</p>}
          {items.length > 0 && (
            <ul className="seasonal__menu" aria-label={`${theme.name} menu`}>
              {items.map((i) => (
                <li key={i.id}>
                  <span className="seasonal__name">{i.name}{i.description && <small>{i.description}</small>}</span>
                  <span className="seasonal__price">{gbp(i.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="row-ctas">
            <Link className="btn btn--light" href={theme.bannerLink || '/events'}>See what’s on</Link>
            <Link className="btn btn--ghost-light" href="/menu#seasonal-specials">Full seasonal menu</Link>
          </div>
        </div>
        {src ? <figure className="seasonal__photo"><img src={src} alt={m?.alt || `Cafe Nova Bistro dressed for ${theme.name}`} loading="lazy" /></figure> : <SeasonArt decor={theme.decor ?? 'none'} />}
      </div>
    </section>
  )
}

export function SeasonArt({ decor, small = false }: { decor: string; small?: boolean }) {
  const cls = `season-art season-art--${decor} ${small ? 'season-art--small' : ''}`
  if (decor === 'halloween' && small) return (
    <svg className={`${cls} season-art--spider`} viewBox="0 0 40 32" aria-hidden="true">
      <circle cx="22" cy="16" r="13" fill="#f4e9c8" />
      <path d="M22 0v15" stroke="#f4e9c8" strokeWidth=".8" />
      <g fill="#1b1230" stroke="#1b1230" strokeWidth="1" strokeLinecap="round">
        <ellipse cx="22" cy="18" rx="2.6" ry="3.2" /><circle cx="22" cy="14.2" r="1.7" />
        <path d="M20 17l-4-3M20 18.5l-4.5 0M20 20l-4 3M21 21l-2.5 4M24 17l4-3M24 18.5l4.5 0M24 20l4 3M23 21l2.5 4" fill="none" />
      </g>
    </svg>
  )
  if (decor === 'halloween') return (
    <svg className={cls} viewBox="0 0 200 160" aria-hidden="true">
      <circle cx="120" cy="70" r="46" className="sa-moon" />
      <path className="sa-ink" d="M40 52c6-8 14-8 18 0 4-6 10-6 12 0-6-2-10 2-12 6-4-6-10-6-18-6z" />
      <path className="sa-ink" d="M150 28c5-6 11-6 14 0 3-5 8-5 10 0-5-2-8 2-10 5-3-5-8-5-14-5z" />
      <path className="sa-ink" d="M20 150c30-40 60-30 90-10s60 10 90-20v40H20z" opacity=".55" />
    </svg>
  )
  if (decor === 'christmas') return (
    <svg className={cls} viewBox="0 0 200 160" aria-hidden="true">
      {[[40, 30], [150, 20], [90, 60], [170, 90], [30, 110], [120, 130], [70, 140]].map(([x, y], i) => (
        <g key={i} className="sa-flake" transform={`translate(${x} ${y})`} style={{ animationDelay: `${i * 0.6}s` }}>
          <path d="M0-9V9M-8-4.5 8 4.5M-8 4.5 8-4.5" />
        </g>
      ))}
      <path className="sa-tree" d="M100 20l34 52h-18l26 40h-84l26-40H66z" />
    </svg>
  )
  if (decor === 'easter') return (
    <svg className={cls} viewBox="0 0 200 160" aria-hidden="true">
      <ellipse cx="80" cy="96" rx="30" ry="40" className="sa-egg1" />
      <ellipse cx="130" cy="104" rx="26" ry="34" className="sa-egg2" />
      {[[40, 30], [160, 40], [110, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" className="sa-bloom" />)}
    </svg>
  )
  if (decor === 'summer') return (
    <svg className={cls} viewBox="0 0 200 160" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="100" y1="76" x2={100 + Math.cos((i / 12) * 2 * Math.PI) * 64} y2={76 + Math.sin((i / 12) * 2 * Math.PI) * 64} className="sa-ray" />)}
      <circle cx="100" cy="76" r="34" className="sa-sun" />
    </svg>
  )
  return null
}


export function NewOnMenu({ c }: { c: Homepage['newOnMenu'] }) {
  const dish = c?.dish && typeof c.dish === 'object' ? (c.dish as MenuItem) : null
  if (c?.show === false || !dish) return null
  const m = typeof dish.photo === 'object' ? (dish.photo as Media | null) : null
  const src = m?.url || dish.photoPath
  return (
    <section className="new-dish" aria-labelledby="new-dish-title">
      <div className="wrap new-dish__inner">
        <figure className="new-dish__img">{src ? <img src={src} alt={dish.name} loading="lazy" /> : <span className="new-dish__ph" aria-hidden="true">{dish.name.charAt(0)}</span>}<span className="new-dish__tag">New</span></figure>
        <div>
          {c?.eyebrow && <p className="eyebrow">{c.eyebrow}</p>}
          <h2 id="new-dish-title">{c?.title}</h2>
          <h3>{dish.name}{dish.localName && <em> {dish.localName}</em>}</h3>
          <p>{dish.description}</p>
          {c?.text && <p className="new-dish__note">{c.text}</p>}
          <p className="new-dish__price">{gbp(dish.price)}</p>
          <div className="row-ctas">
            <Link className="btn btn--river" href={`/menu#${dish.slug}`}>{c?.linkLabel || 'See the menu'}</Link>
            {dish.price != null && dish.orderable && <AddToBasket slug={dish.slug} name={dish.name} price={dish.price} />}
          </div>
        </div>
      </div>
    </section>
  )
}

export function BookEvent({ c }: { c?: Homepage['book'] }) {
  if (c?.show === false) return null
  return (
    <section className="book" id="book" aria-labelledby="book-home-title">
      <div className="wrap book__inner">
        <div className="book__intro">
          {c?.eyebrow && <p className="eyebrow eyebrow--light">{c.eyebrow}</p>}
          <h2 id="book-home-title">{c?.title ?? 'Your party, our café.'}</h2>
          {c?.text && <p>{c.text}</p>}
          <ul className="book__kit">{(c?.kit ?? []).map((k) => <li key={k.id ?? k.text}>{k.text}</li>)}</ul>
          <a className="link-light" href="/private-hire">Everything about private hire →</a>
        </div>
        <div className="book__panel">
          <BookingCalendar />
          <EnquiryForm initialKind="event" lockKind compact />
        </div>
      </div>
    </section>
  )
}

export function EventsStrip({ c, events }: { c: Homepage['events']; events: Event[] }) {
  if (c?.show === false || !events.length) return null
  const nova = events.filter((e) => e.kind !== 'nearby')
  const near = events.filter((e) => e.kind === 'nearby')
  const Card = ({ e }: { e: Event }) => (
    <li>
      <time dateTime={e.startsAt}>
        <span className="d">{e.dateNote ? '—' : new Date(e.startsAt).toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Europe/London' })}</span>
        <span className="m">{e.dateNote && /season|week/i.test(e.dateNote) ? '' : new Date(e.startsAt).toLocaleDateString('en-GB', { month: 'short', timeZone: 'Europe/London' })}</span>
      </time>
      <div>
        <h3>{e.link ? <a href={e.link} {...(e.link.startsWith('http') ? ext : {})}>{e.title}</a> : e.title}</h3>
        {e.dateNote && <p className="events-strip__note">{e.dateNote}</p>}
        <p>{e.summary}</p>
      </div>
    </li>
  )
  return (
    <section className="events-strip" aria-labelledby="events-title">
      <div className="wrap">
        <div className="section-head section-head--light events-strip__head">
          <h2 id="events-title">{c?.title ?? 'Festive & events'}</h2>
          <Link href="/events" className="link-light">All dates this year →</Link>
        </div>
        <ol className="events-strip__list">{nova.map((e) => <Card key={e.id} e={e} />)}</ol>
        {near.length > 0 && (
          <>
            <h3 className="events-strip__sub">{c?.nearbyTitle ?? 'Around Richmond'}</h3>
            <ol className="events-strip__list events-strip__list--near">{near.map((e) => <Card key={e.id} e={e} />)}</ol>
          </>
        )}
      </div>
    </section>
  )
}

export function FindUsBar({ title, links }: { title?: string | null; links: L }) {
  const items: [string, string, string, string?][] = [
    [links.googleMaps ?? '', 'google', 'Google', 'Reviews & directions'],
    [links.tripadvisor ?? '', 'tripadvisor', 'Tripadvisor', 'Reviews & photos'],
    [links.wanderlog ?? '', 'wanderlog', 'Wanderlog', 'Add us to your trip plan'],
    [links.pawpal ?? '', 'paw', 'PawPal', 'Dog-friendly café'],
    [links.visitRichmond ?? '', 'pin', 'Visit Richmond', 'Official visitor guide'],
    [links.myRichmond ?? '', 'tag', 'My Richmond', '10% off Mon–Fri'],
    [links.staycation ?? '', 'bed', 'Staycation', 'Richmond guide'],
    [links.fsa ?? '', 'shield', 'Food hygiene', 'Rated 5 — Very good'],
    [links.instagram ?? '', 'instagram', 'Instagram', '@cafenovabistro'],
    [links.facebook ?? '', 'facebook', 'Facebook', 'Watch our video'],
  ]
  return (
    <section className="findus" aria-labelledby="findus-title">
      <div className="wrap">
        <h2 id="findus-title">{title ?? 'Find us around Richmond'}</h2>
        <ul>
          {items.filter(([u]) => u).map(([u, icon, name, sub]) => (
            <li key={name}><a href={u} {...ext}><span className={`findus__icon findus__icon--${icon}`}><BrandIcon name={icon} size={24} /></span><span><b>{name}</b><small>{sub}</small></span></a></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ReviewCards({ reviews, kind }: { reviews: Review[]; kind: 'google' | 'tripadvisor' }) {
  return (
    <ul className={`rev-cards rev-cards--${kind}`}>
      {reviews.map((q) => (
        <li key={q.id}>
          <figure>
            {kind === 'google' ? <span className="rev-cards__stars" aria-label="Rated 5 of 5">★★★★★</span> : <span className="tasec__bubbles" aria-label="Rated 5 of 5">{Array.from({ length: 5 }).map((_, i) => <i key={i} />)}</span>}
            {q.title && <h3>{q.title}</h3>}
            <blockquote>“{q.quote}”</blockquote>
            <figcaption>{q.author}{q.date ? ` · ${new Date(q.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : ''}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

export function GoogleSection({ c, s, reviews }: { c: Homepage['google']; reviews: Review[]; s: { address?: string | null; phone?: string | null; hours?: { days: string; time: string; id?: string | null }[] | null; reviews?: { googleRating?: number | null; googleCount?: number | null } | null; links?: L | null } }) {
  if (c?.show === false) return null
  const r = s.reviews ?? {}
  const l = s.links ?? {}
  const g = reviews.filter((q) => q.source === 'google')
  return (
    <section className="gsec" aria-labelledby="gsec-title">
      <div className="wrap">
        <div className="gsec__head">
          <div className="gsec__brandbox"><BrandIcon name="google" size={34} /><span>Google</span></div>
          <div>
            <h2 id="gsec-title">{c?.title || 'Loved by our neighbours'}</h2>
            {r.googleRating && <p className="gsec__rating"><b>{r.googleRating.toFixed(1)}</b><span className="gsec__stars" aria-hidden="true">★★★★★</span><span>{r.googleCount} reviews on Google</span></p>}
          </div>
          <div className="tasec__ctas">
            {l.googleMaps && <a className="btn btn--google" href={l.googleMaps} {...ext}><BrandIcon name="google" size={18} color="#fff" /> See Nova on Google</a>}
            {l.googleMaps && <a className="btn btn--outline" href={l.googleMaps} {...ext}>Write a review</a>}
          </div>
        </div>
        {g.length > 0 && <ReviewCards reviews={g} kind="google" />}
        <div className="gsec__facts">
          <span><Icon name="clock" size={18} /> {s.hours?.map((h) => `${h.days} ${h.time}`).join(' · ')}</span>
          {s.phone && <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a>}
          {l.googleMaps && <a href={l.googleMaps} {...ext}>Get directions →</a>}
        </div>
      </div>
    </section>
  )
}

export function TripadvisorSection({ c, reviews, s }: { c: Homepage['tripadvisor']; reviews: Review[]; s: { reviews?: { tripadvisorCount?: number | null; tripadvisorRank?: string | null } | null; links?: L | null } }) {
  if (c?.show === false) return null
  const r = s.reviews ?? {}
  const l = s.links ?? {}
  const ta = reviews.filter((q) => q.source === 'tripadvisor')
  return (
    <section className="tasec" aria-labelledby="tasec-title">
      <div className="wrap">
        <div className="tasec__head">
          <div className="tasec__brand"><BrandIcon name="tripadvisor" size={40} color="#000" /><span>Tripadvisor</span></div>
          <div>
            <h2 id="tasec-title">{c?.title || r.tripadvisorRank?.match(/^#\d+ of \d+/)?.[0] || 'Loved on Tripadvisor'}</h2>
            <p>{r.tripadvisorRank?.replace(/^#\d+ of \d+\s*/, '') ?? ''}{r.tripadvisorCount ? ` · ${r.tripadvisorCount} reviews` : ''}</p>
          </div>
          <div className="tasec__ctas">
            {l.tripadvisor && <a className="btn btn--ta" href={l.tripadvisor} {...ext}><BrandIcon name="tripadvisor" size={18} color="#fff" /> See Nova on Tripadvisor</a>}
            {l.tripadvisor && <a className="btn btn--outline" href={l.tripadvisor} {...ext}>Write a review</a>}
          </div>
        </div>
        <ReviewCards reviews={ta} kind="tripadvisor" />
        <div className="tasec__plan">
          <span>Visiting Richmond?</span>
          {l.wanderlog && <a className="plan-chip plan-chip--wanderlog" href={l.wanderlog} {...ext}><span className="plan-chip__icon"><BrandIcon name="wanderlog" size={20} color="#fff" /></span> Add Cafe Nova to your Wanderlog trip</a>}
          {l.tripadvisor && <a className="plan-chip plan-chip--ta" href={l.tripadvisor} {...ext}><span className="plan-chip__icon"><BrandIcon name="tripadvisor" size={20} color="#000" /></span> Save us on Tripadvisor</a>}
        </div>
      </div>
    </section>
  )
}

const TEAM: Record<string, string> = { front: 'Front of house', kitchen: 'Kitchen', coffee: 'Coffee bar' }

export function CareersTeaser({ c, fallback }: { c: Homepage['careers']; fallback?: Job | null }) {
  const job = (c?.job && typeof c.job === 'object' ? (c.job as Job) : null) ?? fallback
  if (c?.show === false || !job || job.open === false) return null
  const hours = job.hours ? job.hours.replace('-', ' ').replace(/^./, (x) => x.toUpperCase()) : ''
  return (
    <section className="careers-teaser" aria-labelledby="careers-teaser-title">
      <div className="wrap careers-teaser__inner">
        <div>
          {c?.eyebrow && <p className="eyebrow">{c.eyebrow}</p>}
          <h2 id="careers-teaser-title">{c?.title}</h2>
          {c?.text && <p>{c.text}</p>}
          <div className="row-ctas"><Link className="btn btn--outline" href="/careers">See all roles</Link></div>
        </div>
        <Link href={`/careers/${job.slug}`} className="job-card">
          <span className="job-card__meta">{[TEAM[job.team ?? ''], hours].filter(Boolean).join(' · ')}</span>
          <h3>{job.title}</h3>
          {job.schedule && <p className="job-card__when">{job.schedule}</p>}
          <p>{job.summary}</p>
          <span className="job-card__cta">View role & apply →</span>
        </Link>
      </div>
    </section>
  )
}
