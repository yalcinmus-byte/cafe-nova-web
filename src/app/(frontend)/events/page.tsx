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
          <h1>Festive & events</h1>
          <p>What’s on at Nova through the year, and nearby dates worth planning breakfast around.</p>
        </header>
        {events.length === 0 && <p>No dates announced yet. Follow us on Instagram for the next one.</p>}
        <ol className="event-list">
          {events.map((e) => (
            <li key={e.id} className={`event event--${e.kind}`}>
              <p className="event__when">{fmt(e.startsAt)}{e.endsAt && ` – ${fmt(e.endsAt)}`}</p>
              <h2>{e.title}</h2>
              {e.kind === 'nearby' && <p className="event__kind">Nearby — we’re not the organiser</p>}
              <p>{e.summary}</p>
              {e.link && <a href={e.link}>Event details</a>}
            </li>
          ))}
        </ol>
      </main>
      <Footer s={settings} />
    </>
  )
}
