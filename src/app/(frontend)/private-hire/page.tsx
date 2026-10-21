import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { BookingCalendar } from '@/components/BookingCalendar'
import { getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Private hire & events', description: 'Hire Cafe Nova Bistro in the evening for birthdays, team parties, talks and match nights — with sound system, microphone, projector and big-screen TV. East Twickenham, by Richmond Bridge.' }

const KIT = [
  ['Sound system', 'Your playlist, speeches or a live acoustic set.'],
  ['Microphone', 'For toasts, quizzes, talks and announcements.'],
  ['Projector', 'Slides, photos, a film night or a presentation.'],
  ['Big-screen TV', 'Match nights, Eurovision or the big game at Twickenham.'],
]
const IDEAS = ['Birthday brunches & parties', 'Team breakfasts and Christmas parties', 'Turkish meze evenings', 'Quiz, film and match nights', 'Baby showers & family gatherings', 'Talks, workshops & book clubs']

export default async function PrivateHirePage() {
  const s = await getSettings()
  return (
    <>
      <Header />
      <main id="main" className="hire-page">
        <section className="hire-hero">
          <img src="/img/place/inside.webp" alt="Inside Cafe Nova Bistro" />
          <div className="wrap hire-hero__copy">
            <p className="eyebrow eyebrow--light">Private hire</p>
            <h1>After five, the café is yours.</h1>
            <p>Birthdays, team parties, meze nights and match nights in our corner café by Richmond Bridge — cooked by our kitchen, hosted by our team.</p>
            <a className="btn btn--turq" href="#book">Ask about a date</a>
          </div>
        </section>
        <section className="wrap hire-kit" aria-labelledby="kit-title">
          <h2 id="kit-title">Everything you need is already here</h2>
          <ul>{KIT.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ul>
        </section>
        <section className="wrap hire-ideas" aria-labelledby="ideas-title">
          <h2 id="ideas-title">Ideas we love</h2>
          <ul>{IDEAS.map((i) => <li key={i}>{i}</li>)}</ul>
          <p className="small">Food: breakfast-for-dinner, Turkish meze sharing plates, wraps and sandwiches platters or something of your own — tell us what you have in mind and we’ll put together a menu and a price.</p>
        </section>
        <section className="wrap contact__grid hire-book" id="book" aria-labelledby="book-title">
          <div>
            <h2 id="book-title">Book your evening</h2>
            <p>Pick an evening, then tell us what you’re planning. We’ll confirm availability and send a quote by email, usually within a day.</p>
            <BookingCalendar />
            <EnquiryForm initialKind="event" lockKind />
          </div>
          <aside className="contact__aside">
            <h2>Where</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            <h2>When</h2>
            <p>Evenings after we close at 5pm — tell us your date and we’ll confirm. Bigger daytime groups: just let us know you’re coming.</p>
          </aside>
        </section>
      </main>
      <Footer s={s} />
    </>
  )
}
