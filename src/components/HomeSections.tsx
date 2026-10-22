import Link from 'next/link'
import type { Media, Partner, Review, MenuItem, Theme } from '@/payload-types'
import { FsaBadge } from './FsaBadge'
import { NovaArcs } from './NovaLogo'
import { AddToBasket } from './AddToBasket'
import { DeliveryApps } from './DeliveryApps'
import { BrandIcon } from './BrandIcon'
import { BookingCalendar } from './BookingCalendar'
import { EnquiryForm } from './EnquiryForm'

type Links = Record<string, string | null | undefined>

export function Values() {
  const words = [
    ['Delicious', 'British classics and Turkish favourites, cooked to order.'],
    ['Fresh', 'Real ingredients, home-made in our own kitchen every day.'],
    ['Happy', 'Good mornings, good coffee and a good feeling to take with you.'],
    ['Peaceful', 'A calm corner by the river to slow down, catch up or work a little.'],
  ]
  return (
    <section className="values" aria-labelledby="values-title">
      <div className="wrap values__inner">
        <div className="values__intro">
          <p className="eyebrow eyebrow--light">Our neighbourhood café</p>
          <h2 id="values-title">A local hub, made with love.</h2>
          <p>Fresh, home-made, friendly and welcoming. Come as a guest, leave as a friend.</p>
          <Link href="/about" className="link-light">Our story →</Link>
        </div>
        <ul className="values__list">
          {words.map(([t, d], i) => (
            <li key={t} style={{ '--i': i } as React.CSSProperties}><h3>{t}</h3><p>{d}</p></li>
          ))}
        </ul>
      </div>
      <NovaArcs className="values__arcs" />
    </section>
  )
}

export function Products({ partners, shop, orderLive }: { partners: Partner[]; shop: MenuItem[]; orderLive: boolean }) {
  return (
    <section className="products" aria-labelledby="products-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Products & suppliers</p>
          <h2 id="products-title">Quality you can taste</h2>
          <p>Speciality coffee, organic milk and produce bought fresh — the good stuff, every day.</p>
        </div>
        {shop.length > 0 && (
          <div className="take-home">
            <img src="/img/dishes/latte-heart.webp" alt="A latte with a heart in the foam in Nova's turquoise cup" loading="lazy" />
            <div>
              <h3>Take Alchemy home</h3>
              <p>The same speciality beans we pour, in bags to take home. Ask us to grind them for you.</p>
              <ul>
                {shop.map((s) => (
                  <li key={s.id}>
                    <span>{s.name.replace('Alchemy Coffee — ', '')}</span>
                    <span className="take-home__price">£{s.price!.toFixed(2)}</span>
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

const STARS = (n = 5) => '★'.repeat(Math.round(n))

export function Reviews({ reviews, s }: { reviews: Review[]; s: { reviews?: { googleRating?: number | null; googleCount?: number | null; tripadvisorCount?: number | null; tripadvisorRank?: string | null } | null; links?: Links | null } }) {
  const r = s.reviews ?? {}
  const l = s.links ?? {}
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">What guests say</p>
          <h2 id="reviews-title">Loved in Richmond</h2>
        </div>
        <div className="badges">
          {l.googleMaps && (
            <a className="badge badge--google" href={l.googleMaps} rel="noopener" target="_blank">
              <span className="badge__src">Google reviews</span>
              <span className="badge__score">{r.googleRating?.toFixed(1)}<span className="badge__stars" aria-hidden="true">{STARS(r.googleRating ?? 5)}</span></span>
              <span className="badge__meta">{r.googleCount ? `${r.googleCount} reviews` : 'Read reviews'}</span>
            </a>
          )}
          {l.tripadvisor && (
            <a className="badge badge--ta" href={l.tripadvisor} rel="noopener" target="_blank">
              <span className="badge__src">Tripadvisor</span>
              <span className="badge__score">{r.tripadvisorRank?.match(/^#\d+/)?.[0] ?? '★'}</span>
              <span className="badge__meta">{r.tripadvisorRank?.replace(/^#\d+\s*/, '') ?? 'Reviews and photos'}{r.tripadvisorCount ? ` · ${r.tripadvisorCount} reviews` : ''}</span>
            </a>
          )}
          <div className="badge badge--fsa">
            <FsaBadge />
            {l.fsa && <a className="fsa-fallback" href={l.fsa} rel="noopener" target="_blank">Food hygiene rating on food.gov.uk →</a>}
          </div>
        </div>
        <ul className="quotes">
          {reviews.map((q) => (
            <li key={q.id}>
              <figure>
                <span className="quotes__stars" aria-label="Five stars">★★★★★</span>
                {q.title && <h3>{q.title}</h3>}
                <blockquote>“{q.quote}”</blockquote>
                <figcaption>{q.author} · {q.source === 'tripadvisor' ? 'Tripadvisor' : q.source === 'google' ? 'Google' : 'Review'}{q.date ? `, ${new Date(q.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : ''}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="row-ctas">
          {l.googleMaps && <a className="btn btn--river" href={l.googleMaps} rel="noopener" target="_blank">Leave us a Google review</a>}
          {l.tripadvisor && <a className="btn btn--outline" href={l.tripadvisor} rel="noopener" target="_blank">Review us on Tripadvisor</a>}
        </div>
      </div>
    </section>
  )
}

export function Welcome({ facilities, links }: { facilities: { id?: string | null; title: string; text?: string | null; link?: string | null }[]; links: Links }) {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Everyone’s welcome</p>
          <h2 id="welcome-title">Dogs, bikes, buggies and big groups</h2>
          <p>A neighbourhood meeting spot between Richmond Bridge and the park.</p>
        </div>
        <ul className="welcome__grid">
          {facilities.map((f) => (
            <li key={f.id ?? f.title}>
              <h3>{f.title}</h3>
              {f.text && <p>{f.text}</p>}
              {f.link && <a href={f.link} {...(f.link.startsWith('http') ? { rel: 'noopener', target: '_blank' } : {})}>{f.link.startsWith('/') ? 'Find out more' : 'Visit site'} →</a>}
            </li>
          ))}
        </ul>
        <div className="perks">
          {links.myRichmond && (
            <a className="perk perk--offer" href={links.myRichmond} rel="noopener" target="_blank">
              <b>10% off Monday to Friday</b>
              <span>with the My Richmond card — excludes public holidays, not with other offers.</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export function Seasonal({ theme }: { theme: Theme | null }) {
  if (!theme || !theme.headline) return null
  return (
    <section className={`seasonal seasonal--${theme.decor ?? 'none'}`} aria-labelledby="seasonal-title">
      <div className="wrap seasonal__inner">
        <div>
          <p className="eyebrow eyebrow--light">{theme.name}</p>
          <h2 id="seasonal-title">{theme.headline}</h2>
          {theme.blurb && <p>{theme.blurb}</p>}
          <div className="row-ctas">
            <Link className="btn btn--light" href={theme.bannerLink || '/events'}>See what’s on</Link>
            <Link className="btn btn--ghost-light" href="/private-hire">Book an evening</Link>
          </div>
        </div>
        <SeasonArt decor={theme.decor ?? 'none'} />
      </div>
    </section>
  )
}

export function SeasonArt({ decor, small = false }: { decor: string; small?: boolean }) {
  const cls = `season-art season-art--${decor} ${small ? 'season-art--small' : ''}`
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

export function OrderStrip({ live, apps }: { live: boolean; apps: { id?: string | null; name: string; url?: string | null }[] }) {
  return (
    <section className="order-strip" aria-labelledby="order-strip-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Order online</p>
          <h2 id="order-strip-title">Hungry? Order ahead.</h2>
          <p>Pick it up from the café without the wait, or get it delivered through your favourite app.</p>
        </div>
        <div className="order-strip__grid">
          <div className="order-card">
            <h3>Pick up in the café</h3>
            <p>Choose your breakfast, lunch and coffee, pick a time and it’ll be ready when you arrive.</p>
            <ul><li>Freshly cooked for your time slot</li><li>Pay at the counter — card or cash</li><li>Order from 7am on weekdays, 8am at weekends</li></ul>
            <div className="row-ctas">
              <a className="btn btn--turq" href={live ? '/menu' : '/order'}>{live ? 'Start your order' : 'Ordering opens soon'}</a>
              <a className="btn btn--ghost-light" href="/order">View basket</a>
            </div>
          </div>
          <div className="order-strip__side">
            <DeliveryApps apps={apps} title="Delivery through the apps" />
            <div className="hire-card">
              <div><h3>Planning a party?</h3><p>Book the café for an evening — sound, mic, projector and big screen.</p></div>
              <a className="btn btn--light" href="/private-hire">Check dates</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


export function BookEvent() {
  return (
    <section className="book" id="book" aria-labelledby="book-home-title">
      <div className="wrap book__inner">
        <div className="book__intro">
          <p className="eyebrow eyebrow--light">Book an event</p>
          <h2 id="book-home-title">Your party, our café.</h2>
          <p>Birthdays, team parties, meze nights, quizzes and match nights — after 5pm the café is yours.</p>
          <ul className="book__kit">
            {['Sound system', 'Microphone', 'Projector', 'Big-screen TV'].map((k) => <li key={k}>{k}</li>)}
          </ul>
          <a className="link-light" href="/private-hire">Everything about private hire →</a>
        </div>
        <div className="book__panel">
          <BookingCalendar />
          <EnquiryForm initialKind="event" lockKind />
        </div>
      </div>
    </section>
  )
}

export function SupplierBar({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null
  const row = partners.map((p) => {
    const logo = typeof p.logo === 'object' ? (p.logo as Media | null) : null
    return (
      <li key={p.id}>
        {logo?.url ? <img src={logo.url} alt={p.name} /> : <span className={`wordmark wordmark--${p.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{p.name}</span>}
        <small>{p.role}</small>
      </li>
    )
  })
  return (
    <section className="supplier-bar" aria-label="Our suppliers">
      <p className="supplier-bar__label">Proudly serving</p>
      <div className="supplier-bar__track"><ul>{row}</ul><ul aria-hidden="true">{row}</ul></div>
    </section>
  )
}

type L = Links
const ext = { rel: 'noopener', target: '_blank' } as const

export function FindUsBar({ links }: { links: L }) {
  const items: [string, string, string, string?][] = [
    [links.googleMaps ?? '', 'google', 'Google', 'Reviews & directions'],
    [links.tripadvisor ?? '', 'tripadvisor', 'Tripadvisor', 'Reviews & photos'],
    [links.wanderlog ?? '', 'route', 'Wanderlog', 'Add us to your trip plan'],
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
        <h2 id="findus-title">Find us around Richmond</h2>
        <ul>
          {items.filter(([u]) => u).map(([u, icon, name, sub]) => (
            <li key={name}><a href={u} {...ext}><span className={`findus__icon findus__icon--${icon}`}><BrandIcon name={icon} size={24} /></span><span><b>{name}</b><small>{sub}</small></span></a></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const MAP = 'https://www.google.com/maps?q=Cafe+Nova+Bistro,+424+Richmond+Road,+Twickenham+TW1+2EB&output=embed'

export function GoogleSection({ s }: { s: { address?: string | null; phone?: string | null; hours?: { days: string; time: string; id?: string | null }[] | null; reviews?: { googleRating?: number | null; googleCount?: number | null } | null; links?: L | null } }) {
  const r = s.reviews ?? {}
  const l = s.links ?? {}
  return (
    <section className="gsec" aria-labelledby="gsec-title">
      <div className="gsec__map"><iframe title="Map: Cafe Nova Bistro, 424 Richmond Road, East Twickenham" src={MAP} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      <div className="gsec__card">
        <p className="gsec__brand"><BrandIcon name="google" size={22} /> Google</p>
        <h2 id="gsec-title">Find us by Richmond Bridge</h2>
        {r.googleRating && (
          <p className="gsec__rating"><b>{r.googleRating.toFixed(1)}</b><span className="gsec__stars" aria-hidden="true">★★★★★</span><span>{r.googleCount} Google reviews</span></p>
        )}
        <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
        <ul className="hours">{s.hours?.map((h) => <li key={h.id ?? h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
        {s.phone && <p><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p>}
        <div className="row-ctas">
          {l.googleMaps && <a className="btn btn--river" href={l.googleMaps} {...ext}>Directions</a>}
          {l.googleMaps && <a className="btn btn--outline" href={l.googleMaps} {...ext}>Leave a Google review</a>}
        </div>
      </div>
    </section>
  )
}

export function TripadvisorSection({ reviews, s }: { reviews: Review[]; s: { reviews?: { tripadvisorCount?: number | null; tripadvisorRank?: string | null } | null; links?: L | null } }) {
  const r = s.reviews ?? {}
  const l = s.links ?? {}
  const ta = reviews.filter((q) => q.source === 'tripadvisor')
  return (
    <section className="tasec" aria-labelledby="tasec-title">
      <div className="wrap">
        <div className="tasec__head">
          <div className="tasec__brand"><BrandIcon name="tripadvisor" size={44} color="#000" /><span>Tripadvisor</span></div>
          <div>
            <h2 id="tasec-title">{r.tripadvisorRank?.match(/^#\d+ of \d+/)?.[0] ?? 'Loved on Tripadvisor'}</h2>
            <p>{r.tripadvisorRank?.replace(/^#\d+ of \d+\s*/, '') ?? ''}{r.tripadvisorCount ? ` · ${r.tripadvisorCount} reviews` : ''}</p>
          </div>
          <div className="tasec__ctas">
            {l.tripadvisor && <a className="btn btn--ta" href={l.tripadvisor} {...ext}>Read all reviews</a>}
            {l.tripadvisor && <a className="btn btn--outline" href={l.tripadvisor} {...ext}>Write a review</a>}
          </div>
        </div>
        <ul className="tasec__quotes">
          {ta.map((q) => (
            <li key={q.id}>
              <figure>
                <span className="tasec__bubbles" aria-label="Rated 5 of 5">{Array.from({ length: 5 }).map((_, i) => <i key={i} />)}</span>
                {q.title && <h3>{q.title}</h3>}
                <blockquote>“{q.quote}”</blockquote>
                <figcaption>{q.author}{q.date ? ` · ${new Date(q.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : ''}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="tasec__plan">
          <span>Visiting Richmond?</span>
          {l.wanderlog && <a href={l.wanderlog} {...ext}><BrandIcon name="route" size={20} color="currentColor" /> Add Cafe Nova to your Wanderlog trip</a>}
          {l.tripadvisor && <a href={l.tripadvisor} {...ext}><BrandIcon name="tripadvisor" size={20} color="currentColor" /> Save us on Tripadvisor</a>}
        </div>
      </div>
    </section>
  )
}
