import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { getEvents, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Festive & events', description: 'Seasonal menus, evening hire and nearby events through the year at Cafe Nova Bistro, East Twickenham.' }

export default async function EventsPage() {
  const [events, settings] = await Promise.all([getEvents(), getSettings()])
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'Europe/London' })
  return (
    <>
      <Header />
      <main id="main" className="wrap events-page">
        <header className="page-head">
          <p className="eyebrow">The year at Nova</p>
          <h1>Festive & events</h1>
          <p>Seasonal menus, celebrations and evenings at Nova through the year — plus nearby dates worth planning breakfast around.</p>
          <div className="row-ctas"><a className="btn btn--river" href="/private-hire">Book a private evening</a></div>
        </header>
        {events.length === 0 && <p>No dates announced yet. Follow us on Instagram for the next one.</p>}
        <ol className="event-list">
          {events.map((e) => (
            <li key={e.id} className={`event event--${e.kind}`}>
              <p className="event__when">{e.dateNote ? e.dateNote : <>{fmt(e.startsAt)}{e.endsAt && ` – ${fmt(e.endsAt)}`}</>}</p>
              <h2>{e.title}</h2>
              {e.kind === 'nearby' && <p className="event__kind">Nearby — we’re not the organiser</p>}
              <p>{e.summary}</p>
              {e.link && <a href={e.link} {...(e.link.startsWith('http') ? { rel: 'noopener', target: '_blank' } : {})}>{e.kind === 'nearby' ? 'Organiser’s website' : e.link === '/private-hire' ? 'Book an evening' : 'Find out more'} →</a>}
            </li>
          ))}
        </ol>
      </main>
      <Footer s={settings} />
    </>
  )
}
