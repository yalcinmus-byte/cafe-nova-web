import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { NovaArcs } from '@/components/NovaLogo'
import { getPages, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'About', description: 'Cafe Nova Bistro is run by Süleyman Demir: 60 years of family hospitality, 20 years in Richmond, and British and Turkish breakfasts on one table in East Twickenham.' }

export default async function AboutPage() {
  const [s, pages] = await Promise.all([getSettings(), getPages()])
  const a = pages.about ?? {}
  const r = s.reviews
  return (
    <>
      <Header />
      <main id="main" className="about">
        <section className="about__hero wrap">
          {a.eyebrow && <p className="eyebrow">{a.eyebrow}</p>}
          <h1>{a.title}</h1>
          {a.lede && <p className="about__lede">{a.lede}</p>}
        </section>
        <section className="about__story wrap">
          <figure className="about__photo">
            <img src="/img/place/inside.webp" alt="Inside Cafe Nova Bistro" />
            <NovaArcs className="about__arcs" />
          </figure>
          <div className="about__text">
            {(a.story ?? []).map((p) => <p key={p.id ?? p.text.slice(0, 20)}>{p.text}</p>)}
            <p className="about__sign">{a.signature}<br /><span>{a.signedBy}</span></p>
          </div>
        </section>
        <section className="about__mission wrap" aria-labelledby="mission-title">
          <p className="eyebrow">Our mission</p>
          <h2 id="mission-title">{a.missionTitle}</h2>
          {a.missionText && <p>{a.missionText}</p>}
        </section>
        <section className="about__values" aria-label="What we stand for">
          <div className="wrap about__values-grid">
            {(a.values ?? []).map((v) => <div key={v.id ?? v.title}><h2>{v.title}</h2><p>{v.text}</p></div>)}
          </div>
        </section>
        {r?.googleRating && (
          <section className="about__proof wrap">
            <p className="about__stars"><span aria-hidden="true">★</span> {r.googleRating.toFixed(1)} on Google</p>
            <p>{r.googleCount ? `${r.googleCount} reviews` : ''}{r.asOf ? ` · as of ${new Date(r.asOf).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}` : ''}</p>
            <div className="row-ctas"><Link className="btn btn--river" href="/menu">See the menu</Link><Link className="btn btn--outline" href="/contact">Get in touch</Link></div>
          </section>
        )}
      </main>
      <Footer s={s} />
    </>
  )
}
