import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { BookingCalendar } from '@/components/BookingCalendar'
import { getPages, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Private hire & events', description: 'Hire Cafe Nova Bistro in the evening for birthdays, team parties, talks and match nights — with sound system, microphone, projector and big-screen TV. East Twickenham, by Richmond Bridge.' }

export default async function PrivateHirePage() {
  const [s, pages] = await Promise.all([getSettings(), getPages()])
  const h = pages.hire ?? {}
  return (
    <>
      <Header />
      <main id="main" className="hire-page">
        <section className="hire-hero">
          <img src="/img/place/inside.webp" alt="Inside Cafe Nova Bistro" />
          <div className="wrap hire-hero__copy">
            <p className="eyebrow eyebrow--light">Private hire</p>
            <h1>{h.title}</h1>
            {h.text && <p>{h.text}</p>}
            <a className="btn btn--turq" href="#book">Ask about a date</a>
          </div>
        </section>
        <section className="wrap hire-kit" aria-labelledby="kit-title">
          <h2 id="kit-title">Everything you need is already here</h2>
          <ul>{(h.kit ?? []).map((k) => <li key={k.id ?? k.title}><h3>{k.title}</h3><p>{k.text}</p></li>)}</ul>
        </section>
        <section className="wrap hire-ideas" aria-labelledby="ideas-title">
          <h2 id="ideas-title">Ideas we love</h2>
          <ul>{(h.ideas ?? []).map((i) => <li key={i.id ?? i.text}>{i.text}</li>)}</ul>
          {h.foodNote && <p className="small">{h.foodNote}</p>}
        </section>
        <section className="wrap contact__grid hire-book" id="book" aria-labelledby="book-title">
          <div>
            <h2 id="book-title">Book your evening</h2>
            <p>Pick an evening, then tell us what you’re planning. We’ll confirm availability and send a quote by email, usually within a day.</p>
            <div className="book__panel book__panel--light">
              <BookingCalendar />
              <EnquiryForm initialKind="event" lockKind compact />
            </div>
          </div>
          <aside className="contact__aside">
            <h2>Where</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            <h2>When</h2>
            {h.when && <p>{h.when}</p>}
          </aside>
        </section>
      </main>
      <Footer s={s} />
    </>
  )
}
