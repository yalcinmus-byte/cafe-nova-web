import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getJobs, getPages, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Careers', description: 'Jobs at Cafe Nova Bistro in East Twickenham: barista, breakfast chef, front of house and kitchen roles in a friendly, family-run café.' }

const TEAM: Record<string, string> = { front: 'Front of house', kitchen: 'Kitchen', coffee: 'Coffee bar' }
const HOURS = (h?: string | null) => (h ? h.replace('-', ' ').replace(/^./, (c) => c.toUpperCase()) : '')

export default async function CareersPage() {
  const [s, jobs, pages] = await Promise.all([getSettings(), getJobs(), getPages()])
  const c = pages.careers ?? {}
  return (
    <>
      <Header />
      <main id="main" className="careers wrap">
        <header className="page-head">
          <p className="eyebrow">Careers</p>
          <h1>{c.title}</h1>
          {c.text && <p>{c.text}</p>}
        </header>
        {(c.why ?? []).length > 0 && <ul className="careers__why">{c.why!.map((w) => <li key={w.id ?? w.text}>{w.text}</li>)}</ul>}
        <section aria-labelledby="roles-title">
          <h2 id="roles-title" className="careers__h2">Open roles</h2>
          {jobs.length ? (
            <ul className="jobs-grid">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link href={`/careers/${j.slug}`} className="job-card">
                    <span className="job-card__meta">{[TEAM[j.team ?? ''], HOURS(j.hours)].filter(Boolean).join(' · ')}</span>
                    <h3>{j.title}</h3>
                    {j.schedule && <p className="job-card__when">{j.schedule}</p>}
                    <p>{j.summary}</p>
                    <span className="job-card__cta">View role & apply →</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="jobs__none">No open roles right now, but we always like to meet good people. Send us a note and we’ll keep it on file.</p>}
        </section>
        <section className="careers__apply contact__grid" aria-labelledby="apply-title">
          <div>
            <h2 id="apply-title" className="careers__h2">Don’t see your role? Say hello</h2>
            <EnquiryForm initialKind="careers" lockKind compact />
          </div>
          <aside className="contact__aside">
            <h2>Where</h2>
            <address>{s.address?.split('\n').map((x) => <span key={x}>{x}<br /></span>)}</address>
            <h2>Hours</h2>
            <ul className="hours">{s.hours?.map((h) => <li key={h.days}><span>{h.days}</span><span>{h.time}</span></li>)}</ul>
          </aside>
        </section>
      </main>
      <Footer s={s} />
    </>
  )
}
