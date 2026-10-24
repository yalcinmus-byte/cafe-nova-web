import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'

const AGENTS = [
  { icon: '£', name: 'CFO', role: 'Money & targets', does: ['Weekly P&L and cash-flow from EPOS, invoices and expenses', 'Food cost %, labour % and gross profit by week', 'VAT and bills calendar', 'Progress against monthly revenue targets'], needs: 'EPOS sales, invoices, expenses, bank feed', ask: '“How did October compare with last year, and where did margin go?”' },
  { icon: '↗', name: 'Growth strategist', role: 'More guests on quiet days', does: ['Spots the slow days, hours and months', 'Plans weekday offers, events and campaigns', 'Tracks what each campaign actually brought in', 'Builds the 6- and 12-month growth plan'], needs: 'EPOS sales by hour, events, campaigns', ask: '“What should we do to fill Tuesday afternoons in January?”' },
  { icon: '◎', name: 'Menu engineer', role: 'Dishes & pricing', does: ['Margin and popularity for every dish (stars, puzzles, workhorses, dogs)', 'Price suggestions when supplier costs move', 'Seasonal menu ideas from what sells', 'Recipe costing'], needs: 'EPOS item sales, recipes, supplier prices', ask: '“Which three dishes should we re-price or drop?”' },
  { icon: '⇄', name: 'Supplier advisor', role: 'Buying & stock', does: ['Tracks supplier prices and flags increases', 'Suggests order quantities from sales patterns', 'Compares suppliers for the same item', 'Highlights waste and over-ordering'], needs: 'Invoices, supplier lists, stock counts', ask: '“Has the price of eggs or milk gone up this month?”' },
  { icon: '✎', name: 'Social media manager', role: 'Instagram, TikTok & Google posts', does: ['Weekly content calendar from the menu and events', 'Caption and hashtag drafts in Nova’s voice', 'Google Business Profile posts', 'Seasonal campaign packs'], needs: 'Menu, events, photos', ask: '“Plan next week’s posts for half-term.”' },
  { icon: '★', name: 'Reviews & reputation', role: 'Google & Tripadvisor', does: ['Collects new reviews in one place', 'Drafts friendly replies for approval', 'Spots recurring praise and complaints', 'Nudges for more Tripadvisor reviews'], needs: 'Google Business Profile, Tripadvisor', ask: '“Draft replies to this week’s reviews.”' },
  { icon: '◷', name: 'Rota & labour planner', role: 'Staff hours', does: ['Builds rotas from expected busy times', 'Keeps labour cost inside target', 'Holiday and cover planning'], needs: 'Rota/payroll, EPOS by hour', ask: '“Do we need a second barista on Saturday mornings?”' },
  { icon: '✓', name: 'Food safety & compliance', role: 'FSA ready', does: ['Daily checklists and fridge temperature logs', 'Allergen matrix from the menu', 'Reminders for training, licences and inspections'], needs: 'Menu allergens, checklists', ask: '“Are we ready for the next hygiene inspection?”' },
]

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
            <article key={a.name} className="hq__agent">
              <header><span className="hq__agent-icon" aria-hidden="true">{a.icon}</span><div><h3>{a.name}</h3><p>{a.role}</p></div></header>
              <ul>{a.does.map((d) => <li key={d}>{d}</li>)}</ul>
              <p className="hq__needs"><b>Reads:</b> {a.needs}</p>
              <p className="hq__ask">{a.ask}</p>
              <button type="button" className="hq__btn" disabled>Ask {a.name} · soon</button>
            </article>
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
