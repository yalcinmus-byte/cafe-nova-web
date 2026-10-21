import Link from 'next/link'
import { NovaLogo } from './NovaLogo'
import { SiteHeader } from './SiteHeader'


export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <NovaLogo className={light ? 'nova-lockup--light' : ''} />
  )
}

export function Header({ overlay = false }: { overlay?: boolean; banner?: string | null }) {
  return <SiteHeader overlay={overlay} />
}

type Settings = { address?: string | null; hours?: { days: string; time: string }[] | null; phone?: string | null; links?: Record<string, string | null | undefined> | null }

const MAP_SRC = 'https://www.google.com/maps?q=Cafe+Nova+Bistro,+424+Richmond+Road,+Twickenham&output=embed'

export function Footer({ s }: { s: Settings }) {
  const l = s.links ?? {}
  const ext = { rel: 'noopener', target: '_blank' }
  return (
    <footer className="site-footer">
      <div className="site-footer__map">
        <iframe title="Map showing Cafe Nova Bistro on Richmond Road, East Twickenham" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        {l.googleMaps && <a className="btn btn--light site-footer__directions" href={l.googleMaps} {...ext}>Get directions</a>}
      </div>
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark light />
          <p>Come as a guest, leave as a friend.</p>
        </div>
        <div>
          <h2>Find us</h2>
          <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
          {s.phone && <p><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p>}
          <h2 className="site-footer__h2-gap">Opening hours</h2>
          <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
        </div>
        <div>
          <h2>Explore</h2>
          <ul className="plain">
            <li><Link href="/menu">Food menu</Link></li>
            <li><Link href="/order">Order online</Link></li>
            <li><Link href="/events">Festive & events</Link></li>
            <li><Link href="/private-hire">Private hire</Link></li>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2>Find us online</h2>
          <ul className="plain">
            {l.instagram && <li><a href={l.instagram} {...ext}>Instagram</a></li>}
            {l.facebook && <li><a href={l.facebook} {...ext}>Facebook</a></li>}
            {l.tiktok && <li><a href={l.tiktok} {...ext}>TikTok</a></li>}
            {l.googleMaps && <li><a href={l.googleMaps} {...ext}>Google reviews</a></li>}
            {l.tripadvisor && <li><a href={l.tripadvisor} {...ext}>Tripadvisor</a></li>}
            {l.wanderlog && <li><a href={l.wanderlog} {...ext}>Wanderlog</a></li>}
            {l.visitRichmond && <li><a href={l.visitRichmond} {...ext}>Visit Richmond</a></li>}
            {l.staycation && <li><a href={l.staycation} {...ext}>Staycation</a></li>}
            {l.myRichmond && <li><a href={l.myRichmond} {...ext}>My Richmond offer</a></li>}
            {l.pawpal && <li><a href={l.pawpal} {...ext}>Dog friendly on PawPal</a></li>}
            {l.fsa && <li><a href={l.fsa} {...ext}>Food hygiene: 5</a></li>}
          </ul>
        </div>
      </div>
      <p className="site-footer__legal">© {new Date().getFullYear()} Cafe Nova Bistro, East Twickenham. <Link href="/llms.txt">For AI assistants</Link> · <Link href="/admin">Team login</Link></p>
    </footer>
  )
}
