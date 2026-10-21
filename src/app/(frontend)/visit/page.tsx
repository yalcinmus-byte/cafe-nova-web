import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Visit', description: 'Find Cafe Nova Bistro at 424 Richmond Road, East Twickenham, a short walk from Richmond Bridge. Opening hours and directions.' }

export default async function VisitPage() {
  const s = await getSettings()
  const l = s.links ?? {}
  return (
    <>
      <Header />
      <main id="main" className="visit">
        <div className="visit__hero">
          <img src="/img/place/bridge.webp" alt="Richmond Bridge over the Thames on a misty morning with a rowing boat" />
        </div>
        <div className="wrap visit__grid">
          <header className="page-head">
            <h1>Breakfast by Richmond Bridge</h1>
            <p>We’re on the corner of Richmond Road in East Twickenham, on the Twickenham side of the river. Cross Richmond Bridge from Richmond town centre and keep walking along Richmond Road — you’ll see our striped awnings.</p>
          </header>
          <div className="visit__facts">
            <h2>Address</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            <h2>Opening hours</h2>
            <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
            <div className="row-ctas">
              {l.googleMaps && <a className="btn btn--river" href={l.googleMaps}>Directions</a>}
              {l.wanderlog && <a className="btn btn--outline" href={l.wanderlog}>Add us to your Wanderlog trip</a>}
            </div>
            {l.visitRichmond && <p className="small">Also listed on <a href={l.visitRichmond}>Visit Richmond</a>.</p>}
          </div>
        </div>
        {s.facilities && s.facilities.length > 0 && (
          <section className="wrap facilities" aria-labelledby="good-to-know">
            <h2 id="good-to-know">Good to know</h2>
            <ul>{s.facilities.map((f) => (
              <li key={f.id ?? f.title}><h3>{f.link ? <a href={f.link}>{f.title}</a> : f.title}</h3>{f.text && <p>{f.text}</p>}</li>
            ))}</ul>
          </section>
        )}
        <div className="wrap visit__photos">
          <img src="/img/place/outside.webp" alt="Outdoor table with a latte, flowers and the red phone box across the road" loading="lazy" />
          <img src="/img/place/inside.webp" alt="Inside Cafe Nova" loading="lazy" />
          <img src="/img/place/frontage.webp" alt="Flower boxes along the terrace" loading="lazy" />
        </div>
      </main>
      <Footer s={s} />
    </>
  )
}
