import Link from 'next/link'
import { NovaLogo } from './NovaLogo'


export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <NovaLogo className={light ? 'nova-lockup--light' : ''} />
  )
}

export function Header({ overlay = false, banner }: { overlay?: boolean; banner?: string | null }) {
  return (
    <>
      
      <header className={`site-header ${overlay ? 'site-header--overlay' : ''}`}>
        <Link href="/" className="site-header__home"><Wordmark light={overlay} /></Link>
        <nav aria-label="Main">
          <Link href="/menu">Menu</Link>
          <Link href="/events">Events</Link>
          <Link href="/about">About</Link>
          <Link href="/visit">Visit</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/order" className="site-header__order">Order</Link>
        </nav>
      </header>
    </>
  )
}

type Settings = { address?: string | null; hours?: { days: string; time: string }[] | null; phone?: string | null; links?: Record<string, string | null | undefined> | null }

export function Footer({ s }: { s: Settings }) {
  const l = s.links ?? {}
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <Wordmark light />
        <p>Come as a guest, leave as a friend.</p>
      </div>
      <div>
        <h2>Find us</h2>
        <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
        {l.googleMaps && <a href={l.googleMaps}>Open in Google Maps</a>}
      </div>
      <div>
        <h2>Opening hours</h2>
        <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
      </div>
      <div>
        <h2>Elsewhere</h2>
        <ul className="plain">
          {l.instagram && <li><a href={l.instagram}>Instagram</a></li>}
          {l.tripadvisor && <li><a href={l.tripadvisor}>Tripadvisor reviews</a></li>}
          {l.tiktok && <li><a href={l.tiktok}>TikTok</a></li>}
          {l.fsa && <li><a href={l.fsa}>Food hygiene rating</a></li>}
          {l.pawpal && <li><a href={l.pawpal}>Dog friendly on PawPal</a></li>}
          <li><Link href="/blog">Journal</Link></li>
          <li><Link href="/careers">Careers</Link></li>
          <li><Link href="/llms.txt">For AI assistants</Link></li>
        </ul>
      </div>
      <p className="site-footer__legal">© {new Date().getFullYear()} Cafe Nova Bistro, East Twickenham. <Link href="/admin">Team login</Link></p>
    </footer>
  )
}
