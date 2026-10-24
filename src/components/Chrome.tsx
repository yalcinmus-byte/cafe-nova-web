import Link from 'next/link'
import { NovaLogo } from './NovaLogo'
import { SiteHeader } from './SiteHeader'
import { BrandIcon } from './BrandIcon'
import { HygieneRating } from './HygieneRating'


export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <NovaLogo className={light ? 'nova-lockup--light' : ''} />
  )
}

export function Header({ overlay = false }: { overlay?: boolean; banner?: string | null }) {
  return <SiteHeader overlay={overlay} />
}

type Settings = { address?: string | null; hours?: { days: string; time: string }[] | null; phone?: string | null; links?: Record<string, string | null | undefined> | null }

const MAP_SRC = 'https://www.google.com/maps?q=Cafe+Nova+Bistro,+424+Richmond+Road,+Twickenham+TW1+2EB&output=embed'

export function Footer({ s }: { s: Settings; map?: boolean }) {
  const l = s.links ?? {}
  const ext = { rel: 'noopener', target: '_blank' }
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Wordmark light />
          <p>Come as a guest, leave as a friend.</p>
          <div className="site-footer__social">
            {l.instagram && <a href={l.instagram} {...ext} aria-label="Instagram"><BrandIcon name="instagram" size={20} color="currentColor" /></a>}
            {l.facebook && <a href={l.facebook} {...ext} aria-label="Facebook"><BrandIcon name="facebook" size={20} color="currentColor" /></a>}
            {l.tiktok && <a href={l.tiktok} {...ext} aria-label="TikTok"><BrandIcon name="tiktok" size={20} color="currentColor" /></a>}
            {l.tripadvisor && <a href={l.tripadvisor} {...ext} aria-label="Tripadvisor"><BrandIcon name="tripadvisor" size={20} color="currentColor" /></a>}
            {l.googleMaps && <a href={l.googleMaps} {...ext} aria-label="Google"><BrandIcon name="google" size={20} color="currentColor" /></a>}
          </div>
        </div>
        <div className="site-footer__ctas">
          <Link className="btn btn--turq" href="/#order">Order online</Link>
          <Link className="btn btn--ghost-light" href="/private-hire">Book an event</Link>
        </div>
      </div>

      <div className="site-footer__main">
        <div className="site-footer__visit">
          <h2>Visit us</h2>
          <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
          {s.phone && <p><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p>}
          <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
        </div>
        <div className="site-footer__map">
          <iframe title="Map showing Cafe Nova Bistro on Richmond Road, East Twickenham" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          {l.googleMaps && <a className="site-footer__directions" href={l.googleMaps} {...ext}>Get directions →</a>}
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          <div>
            <h2>Explore</h2>
            <ul>
              <li><Link href="/menu">Food menu</Link></li>
              <li><Link href="/#order">Order online</Link></li>
              <li><Link href="/events">Festive & events</Link></li>
              <li><Link href="/private-hire">Book an event</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/blog">Journal</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2>Find us on</h2>
            <ul>
              {l.googleMaps && <li><a href={l.googleMaps} {...ext}>Google</a></li>}
              {l.tripadvisor && <li><a href={l.tripadvisor} {...ext}>Tripadvisor</a></li>}
              {l.wanderlog && <li><a href={l.wanderlog} {...ext}>Wanderlog</a></li>}
              {l.visitRichmond && <li><a href={l.visitRichmond} {...ext}>Visit Richmond</a></li>}
              {l.myRichmond && <li><a href={l.myRichmond} {...ext}>My Richmond</a></li>}
              {l.pawpal && <li><a href={l.pawpal} {...ext}>PawPal</a></li>}
              {l.staycation && <li><a href={l.staycation} {...ext}>Staycation</a></li>}
              {l.fsa && <li><a href={l.fsa} {...ext}>Food hygiene: 5</a></li>}
            </ul>
          </div>
        </nav>
      </div>
      <div className="site-footer__trust">
        <div className="site-footer__pay" aria-label="We accept">
          <span>We accept</span>
          {(['visa', 'mastercard', 'applepay', 'googlepay'] as const).map((n) => <span key={n} className="pay-chip"><BrandIcon name={n} size={30} /></span>)}
          <span className="pay-chip pay-chip--text">Cash</span>
        </div>
        <div className="site-footer__fsa"><HygieneRating rating={5} href={l.fsa} compact /></div>
      </div>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} Cafe Nova Bistro · 424 Richmond Road, East Twickenham</span>
        <span><Link href="/llms.txt">For AI assistants</Link> · <Link href="/admin">Team login</Link></span>
      </div>
    </footer>
  )
}
