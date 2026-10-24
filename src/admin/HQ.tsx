import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { AGENTS } from './agents'

const SOURCES = [
  { group: 'Live on the website', items: [['Online orders', 'live', '/admin/collections/orders'], ['Event bookings & enquiries', 'live', '/admin/bookings'], ['Menu, prices & badges', 'live', '/admin/collections/menu-items']] },
  { group: 'Upload now', items: [['Suppliers & price lists', 'ready', '/admin/collections/suppliers'], ['Purchases & invoices', 'ready', '/admin/collections/purchases'], ['Expenses', 'ready', '/admin/collections/expenses'], ['Files: EPOS exports, bank statements, reports', 'ready', '/admin/collections/documents']] },
  { group: 'Connect next', items: [['EPOS (Square, SumUp, Epos Now, Lightspeed…)', 'planned'], ['Accounting (Xero / QuickBooks)', 'planned'], ['Invoice capture (photo → line items)', 'planned'], ['Bank feed (Open Banking)', 'planned'], ['Deliveroo, Uber Eats, Just Eat reports', 'planned'], ['Rota & payroll', 'planned'], ['Google Business Profile & Tripadvisor', 'planned'], ['Instagram & TikTok', 'planned'], ['Stripe online payments', 'planned']] },
]

const KPIS = ['Takings today', 'Covers', 'Average spend', 'Food cost %', 'Labour %', 'Gross profit']

export async function HQ({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fhq')
  const since = new Date(); since.setUTCHours(0, 0, 0, 0)
  const [orders, enq, sup, pur] = await Promise.all([
    req.payload.count({ collection: 'orders', where: { createdAt: { greater_than: since.toISOString() } }, req }),
    req.payload.count({ collection: 'enquiries', where: { status: { equals: 'new' } }, req }),
    req.payload.count({ collection: 'suppliers', req }),
    req.payload.count({ collection: 'purchases', req }),
  ])
  return (
    <div className="hq">
      <header className="hq__hero">
        <div>
          <span className="hq__pill">Preview · going live soon</span>
          <h1>Nova HQ</h1>
          <p>Your café’s back office: every number in one place, and a team of AI advisers that read it for you — finance, growth, menu, suppliers, social and reviews. You approve; they do the legwork.</p>
        </div>
        <div className="hq__live">
          <div><b>{orders.totalDocs}</b><span>online orders today</span></div>
          <div><b>{enq.totalDocs}</b><span>new enquiries</span></div>
          <div><b>{sup.totalDocs}</b><span>suppliers</span></div>
          <div><b>{pur.totalDocs}</b><span>invoices logged</span></div>
        </div>
      </header>

      <section className="hq__sec">
        <h2>Today at a glance</h2>
        <div className="hq__kpis">
          {KPIS.map((k) => <div key={k} className="hq__kpi"><span>{k}</span><b>—</b><small>Connect EPOS to see this</small></div>)}
        </div>
      </section>

      <section className="hq__sec">
        <div className="hq__sechead"><h2>Your AI team</h2><span className="hq__pill hq__pill--soft">Powered by your own OpenAI key · coming soon</span></div>
        <div className="hq__agents">
          {AGENTS.map((a) => (
            <Link key={a.name} href={`/admin/hq/${a.slug}`} className="hq__agent">
              <header><span className="hq__agent-icon" aria-hidden="true">{a.icon}</span><div><h3>{a.persona} · {a.name}</h3><p>{a.role}</p></div></header>
              <ul>{a.does.map((d) => <li key={d}>{d}</li>)}</ul>
              <p className="hq__needs"><b>Reads:</b> {a.needs}</p>
              <p className="hq__ask">{a.ask}</p>
              <span className="hq__btn">Open {a.name} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq__sec">
        <h2>Data sources</h2>
        <div className="hq__sources">
          {SOURCES.map((g) => (
            <div key={g.group} className="hq__source-group">
              <h3>{g.group}</h3>
              <ul>
                {g.items.map(([name, status, href]) => (
                  <li key={name} className={`is-${status}`}>
                    <span className="hq__dot" />
                    {href ? <Link href={href}>{name}</Link> : <span>{name}</span>}
                    <em>{status === 'live' ? 'Live' : status === 'ready' ? 'Ready to upload' : 'Planned'}</em>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="hq__sec hq__roadmap">
        <h2>Roadmap</h2>
        <ol>
          <li><b>1 · Data in</b><span>Upload invoices, expenses and EPOS exports; connect EPOS and accounting.</span></li>
          <li><b>2 · Weekly reports</b><span>Advisers send a Monday briefing: sales, margins, supplier prices, reviews and next steps.</span></li>
          <li><b>3 · Ask anything</b><span>Chat with each adviser about your own numbers.</span></li>
          <li><b>4 · Actions with approval</b><span>Draft posts, review replies, orders and rotas for you to approve in one tap.</span></li>
        </ol>
      </section>
    </div>
  )
}
