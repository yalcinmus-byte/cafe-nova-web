import Link from 'next/link'
import type { Media, Partner, Review, MenuItem, Theme } from '@/payload-types'
import { FsaBadge } from './FsaBadge'
import { NovaArcs } from './NovaLogo'
import { AddToBasket } from './AddToBasket'

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
        <ul className="partners">
          {partners.map((p) => {
            const logo = typeof p.logo === 'object' ? (p.logo as Media | null) : null
            const body = (
              <>
                <span className="partners__mark">{logo?.url ? <img src={logo.url} alt={p.name} /> : <span className="partners__word">{p.name}</span>}</span>
                <span className="partners__role">{p.role}</span>
                <span className="partners__desc">{p.description}</span>
              </>
            )
            return <li key={p.id}>{p.url ? <a href={p.url} rel="noopener" target="_blank">{body}</a> : <div>{body}</div>}</li>
          })}
        </ul>
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
          {links.wanderlog && (
            <a className="perk" href={links.wanderlog} rel="noopener" target="_blank">
              <b>Planning a day in Richmond?</b>
              <span>Add Cafe Nova to your trip on Wanderlog →</span>
            </a>
          )}
          {links.visitRichmond && (
            <a className="perk" href={links.visitRichmond} rel="noopener" target="_blank">
              <b>Visit Richmond</b>
              <span>Find us in the official Richmond visitor guide →</span>
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
