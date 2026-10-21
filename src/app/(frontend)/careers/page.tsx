import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getJobs, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Careers', description: 'Work at Cafe Nova Bistro in East Twickenham: kitchen and front-of-house roles in a friendly, family-run café.' }

export default async function CareersPage() {
  const [s, jobs] = await Promise.all([getSettings(), getJobs()])
  return (
    <>
      <Header />
      <main id="main" className="contact wrap">
        <header className="page-head">
          <p className="eyebrow">Careers</p>
          <h1>Work with us</h1>
          <p>We’re a family-run café that cares about good food and warm service. If that sounds like you, we’d like to hear from you.</p>
        </header>
        <div className="contact__grid">
          <div>
            {jobs.length ? (
              <ul className="jobs">{jobs.map((j) => <li key={j.id}><h2>{j.title}</h2>{j.hours && <span className="chip">{j.hours.replace('-', ' ')}</span>}<p>{j.summary}</p></li>)}</ul>
            ) : <p className="jobs__none">No open roles right now, but we always like to meet good people. Send us a note and we’ll keep it on file.</p>}
            <EnquiryForm initialKind="careers" lockKind />
          </div>
          <aside className="contact__aside">
            <h2>Where</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
          </aside>
        </div>
      </main>
      <Footer s={s} />
    </>
  )
}
