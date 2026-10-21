import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { NovaArcs } from '@/components/NovaLogo'
import { getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'About', description: 'Cafe Nova Bistro is run by Süleyman Demir: 60 years of family hospitality, 20 years in Richmond, and British and Turkish breakfasts on one table in East Twickenham.' }

export default async function AboutPage() {
  const s = await getSettings()
  const r = s.reviews
  return (
    <>
      <Header />
      <main id="main" className="about">
        <section className="about__hero wrap">
          <p className="eyebrow">Our story</p>
          <h1>Two cultures.<br />One table.</h1>
          <p className="about__lede">60 years of family heritage, 20 years in Richmond, and one simple belief: every guest deserves to feel at home.</p>
        </section>
        <section className="about__story wrap">
          <figure className="about__photo">
            <img src="/img/place/inside.webp" alt="Inside Cafe Nova Bistro" />
            <NovaArcs className="about__arcs" />
          </figure>
          <div className="about__text">
            <p>My name is Süleyman Demir, and hospitality has always been more than a profession to me. It’s a way of life.</p>
            <p>I grew up in my family’s café and restaurant tradition, which goes back more than 60 years. Early on I learned that the secret of a good café isn’t only what’s on the plate. It’s how you make people feel.</p>
            <p>Richmond has been my home for 20 years. In that time I’ve worked in five local cafés, as a chef in three and as a manager in two. Each one taught me the same thing: great food matters, good service makes a difference, but it’s the warmth that brings people back.</p>
            <p>Cafe Nova Bistro brings it all together: classic British café favourites and authentic Turkish breakfasts, fresh lunches and excellent coffee, on the corner of Richmond Road.</p>
            <p className="about__sign">Come as a guest, leave as a friend.<br /><span>Süleyman Demir, Founder &amp; Owner</span></p>
          </div>
        </section>
        <section className="about__mission wrap" aria-labelledby="mission-title">
          <p className="eyebrow">Our mission</p>
          <h2 id="mission-title">To be the neighbourhood’s favourite place to start the day.</h2>
          <p>Delicious food, happy faces, a peaceful corner and fresh ingredients — a local hub where everyone feels at home.</p>
        </section>
        <section className="about__values" aria-label="What we stand for">
          <div className="wrap about__values-grid">
            {[['Wholesome', 'Fresh, real ingredients made with love — pure, positive food that leaves you feeling good.'], ['Grateful', 'Kindness and positive energy, with the community first. Every returning face matters to us.'], ['Radiant', 'Shining with happiness: bright mornings, warm welcomes, good coffee.'], ['Neighbourly', 'A local hub for East Twickenham and Richmond — home-made, friendly and welcoming.']].map(([t, d]) => (
              <div key={t}><h2>{t}</h2><p>{d}</p></div>
            ))}
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
