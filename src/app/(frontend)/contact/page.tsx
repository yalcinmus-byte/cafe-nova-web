import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Contact & private hire', description: 'Questions, evening hire and parties at Cafe Nova Bistro, 424 Richmond Road, East Twickenham. Sound system, microphone, projector and big-screen TV available.' }

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const [s, sp] = await Promise.all([getSettings(), searchParams])
  const kind = sp.kind === 'event' || sp.kind === 'careers' ? sp.kind : 'general'
  return (
    <>
      <Header />
      <main id="main" className="contact wrap">
        <header className="page-head">
          <p className="eyebrow">Contact</p>
          <h1>Say hello</h1>
          <p>Questions, allergies, birthday brunches or an evening for the whole team. After 5pm the café can be yours, with a sound system, microphone, projector and a big-screen TV.</p>
        </header>
        <div className="contact__grid">
          <EnquiryForm initialKind={kind} />
          <aside className="contact__aside">
            <h2>Address</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            {s.phone && <p><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p>}
            {s.email && <p><a href={`mailto:${s.email}`}>{s.email}</a></p>}
            <h2>Hours</h2>
            <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
            {s.links?.googleMaps && <a className="btn btn--outline" href={s.links.googleMaps}>Directions</a>}
          </aside>
        </div>
      </main>
      <Footer s={s} />
    </>
  )
}
