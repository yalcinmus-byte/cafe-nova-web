import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { AdminPage } from './AdminPage'
import { redirect } from 'next/navigation'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const STATUS: Record<string, string> = { new: 'New request', replied: 'Replied', booked: 'Booked', closed: 'Closed' }
const KIT: Record<string, string> = { sound: 'Sound', mic: 'Mic', projector: 'Projector', tv: 'TV' }
const key = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`

/** Event bookings on a month calendar: requests, replies and confirmed bookings by date. */
export async function Bookings(props: AdminViewServerProps) {
  const { initPageResult, searchParams } = props
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fbookings')
  const m = typeof searchParams?.m === 'string' && /^\d{4}-\d{2}$/.test(searchParams.m) ? searchParams.m : key(new Date()).slice(0, 7)
  const [y, mo] = m.split('-').map(Number)
  const start = new Date(Date.UTC(y, mo - 1, 1))
  const end = new Date(Date.UTC(y, mo, 1))
  const prev = key(new Date(Date.UTC(y, mo - 2, 1))).slice(0, 7)
  const next = key(new Date(Date.UTC(y, mo, 1))).slice(0, 7)
  const r = await req.payload.find({
    collection: 'enquiries', depth: 0, limit: 500, pagination: false, req,
    where: { and: [{ kind: { equals: 'event' } }, { date: { greater_than_equal: start.toISOString() } }, { date: { less_than: end.toISOString() } }] },
    sort: 'date',
  })
  const undated = await req.payload.find({ collection: 'enquiries', depth: 0, limit: 20, req, where: { and: [{ kind: { equals: 'event' } }, { date: { exists: false } }, { status: { equals: 'new' } }] } })
  const byDay = new Map<string, typeof r.docs>()
  for (const e of r.docs) if (e.date) { const k = key(new Date(e.date)); byDay.set(k, [...(byDay.get(k) ?? []), e]) }
  const lead = (start.getUTCDay() + 6) % 7
  const n = new Date(Date.UTC(y, mo, 0)).getUTCDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, mo - 1, i + 1)))]
  const today = key(new Date())
  const counts = { new: 0, replied: 0, booked: 0 }
  r.docs.forEach((e) => { if (e.status && e.status in counts) counts[e.status as keyof typeof counts]++ })

  return (
    <AdminPage props={props}>
    <div className="bookings">
      <header className="bookings__head">
        <div>
          <h1>Event bookings</h1>
          <p>{counts.new} new · {counts.replied} replied · {counts.booked} booked this month. Mark an enquiry “Booked” and the date shows as taken on the website calendar.</p>
        </div>
        <nav>
          <Link className="nova-btn nova-btn--ghost" href={`/admin/bookings?m=${prev}`}>‹ Prev</Link>
          <strong>{start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong>
          <Link className="nova-btn nova-btn--ghost" href={`/admin/bookings?m=${next}`}>Next ›</Link>
        </nav>
      </header>
      <div className="bookings__grid">
        {DOW.map((d) => <div key={d} className="bookings__dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`x${i}`} className="bookings__cell bookings__cell--empty" />
          const k = key(d)
          const list = byDay.get(k) ?? []
          return (
            <div key={k} className={`bookings__cell ${k === today ? 'is-today' : ''} ${list.some((e) => e.status === 'booked') ? 'is-booked' : ''}`}>
              <span className="bookings__num">{d.getUTCDate()}</span>
              {list.map((e) => (
                <Link key={e.id} href={`/admin/collections/enquiries/${e.id}`} className={`bk bk--${e.status ?? 'new'}`}>
                  <b>{e.startTime ? `${e.startTime} ` : ''}{e.occasion || e.name}</b>
                  <span>{e.guests ? `${e.guests} guests · ` : ''}{STATUS[e.status ?? 'new']}</span>
                  {e.equipment?.length ? <span>{e.equipment.map((x) => KIT[x] ?? x).join(', ')}</span> : null}
                </Link>
              ))}
            </div>
          )
        })}
      </div>
      {undated.docs.length > 0 && (
        <section className="bookings__undated">
          <h2>New requests without a date</h2>
          <ul>{undated.docs.map((e) => <li key={e.id}><Link href={`/admin/collections/enquiries/${e.id}`}>{e.name}{e.occasion ? ` — ${e.occasion}` : ''}</Link></li>)}</ul>
        </section>
      )}
    </div>
    </AdminPage>
  )
}
