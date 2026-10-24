import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/Chrome'
import { EnquiryForm } from '@/components/EnquiryForm'
import { db, getSettings } from '@/lib/data'

const getJob = async (slug: string) => (await (await db()).find({ collection: 'jobs', where: { slug: { equals: slug }, open: { equals: true } }, limit: 1 })).docs[0] ?? null

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const j = await getJob((await params).slug)
  return j ? { title: `${j.title} — Careers`, description: j.summary ?? undefined } : {}
}

const TEAM: Record<string, string> = { front: 'Front of house', kitchen: 'Kitchen', coffee: 'Coffee bar' }

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [s, j] = await Promise.all([getSettings(), getJob(slug)])
  if (!j) notFound()
  const facts = [['Team', TEAM[j.team ?? '']], ['Hours', j.hours ? j.hours.replace('-', ' ').replace(/^./, (c) => c.toUpperCase()) : undefined], ['When', j.schedule], ['Pay', j.pay || 'Discussed at interview'], ['Where', '424 Richmond Road, East Twickenham']].filter(([, v]) => v)
  const List = ({ title, items }: { title: string; items?: { id?: string | null; text: string }[] | null }) => (items && items.length ? <section><h2>{title}</h2><ul>{items.map((i) => <li key={i.id ?? i.text}>{i.text}</li>)}</ul></section> : null)
  return (
    <>
      <Header />
      <main id="main" className="job wrap">
        <Link href="/careers" className="post__back">← All roles</Link>
        <header className="page-head"><p className="eyebrow">Careers</p><h1>{j.title}</h1>{j.summary && <p>{j.summary}</p>}</header>
        <div className="job__grid">
          <div className="job__body">
            <List title="What you’ll do" items={j.responsibilities} />
            <List title="What we’re looking for" items={j.requirements} />
            <List title="What you get" items={j.benefits} />
            <section id="apply"><h2>Apply</h2><p>Tell us a little about you and the hours you’re after. We’ll reply by email.</p>
              <EnquiryForm initialKind="careers" lockKind compact position={j.title} />
            </section>
          </div>
          <aside className="job__facts">
            <dl>{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <a className="btn btn--turq btn--block" href="#apply">Apply for this role</a>
          </aside>
        </div>
      </main>
      <Footer s={s} />
    </>
  )
}
