import React from 'react'
import { getSample } from '@/hq/sample'
import { requireUser } from '@/hq/auth'
import { Card, CardHead, PageHead } from '@/hq/ui'
import { Matrix, Missing } from '@/hq/sections'

export const metadata = { title: 'Data & uploads' }

export default async function Data() {
  const { payload, user } = await requireUser('/hq/data')
  const s = getSample()
  const since = new Date(); since.setUTCHours(0, 0, 0, 0)
  const opts = { overrideAccess: false, user }
  const [orders, enq, sup, pur, exp, docs] = await Promise.all([
    payload.count({ collection: 'orders', where: { createdAt: { greater_than: since.toISOString() } }, ...opts }),
    payload.count({ collection: 'enquiries', where: { status: { equals: 'new' } }, ...opts }),
    payload.count({ collection: 'suppliers', ...opts }),
    payload.count({ collection: 'purchases', ...opts }),
    payload.count({ collection: 'expenses', ...opts }),
    payload.count({ collection: 'documents', ...opts }),
  ])
  const uploads = [
    { name: 'EPOS exports & files', n: docs.totalDocs, add: '/admin/collections/documents/create', list: '/admin/collections/documents', hint: 'CSV/XLSX sales reports, bank statements' },
    { name: 'Supplier invoices', n: pur.totalDocs, add: '/admin/collections/purchases/create', list: '/admin/collections/purchases', hint: 'What you bought, from whom, at what price' },
    { name: 'Expenses', n: exp.totalDocs, add: '/admin/collections/expenses/create', list: '/admin/collections/expenses', hint: 'Rent, energy, repairs, subscriptions' },
    { name: 'Suppliers', n: sup.totalDocs, add: '/admin/collections/suppliers/create', list: '/admin/collections/suppliers', hint: 'Contacts, delivery days, terms' },
  ]
  return (
    <>
      <PageHead title="Data & uploads" intro="The more the team can read, the better the advice. Uploads are stored securely in the café’s own database." />
      <section className="hqd-kpis hqd-kpis--3">
        <Card className="hqd-kpi"><span>Online orders today</span><b>{orders.totalDocs}</b><small>Live from the website</small></Card>
        <Card className="hqd-kpi" delay={0.05}><span>New event enquiries</span><b>{enq.totalDocs}</b><small>Live from the website</small></Card>
        <Card className="hqd-kpi" delay={0.1}><span>Records uploaded</span><b>{docs.totalDocs + pur.totalDocs + exp.totalDocs + sup.totalDocs}</b><small>Files, invoices, expenses, suppliers</small></Card>
      </section>
      <div className="hqd__row hqd__row--1-1">
        <Card>
          <CardHead title="Upload" />
          <ul className="hq-uploads">
            {uploads.map((u) => (
              <li key={u.name}>
                <div><b>{u.name}</b><span>{u.hint}</span></div>
                <a href={u.list} className="hq-uploads__n">{u.n} saved</a>
                <a href={u.add} className="hq-btn">Add</a>
              </li>
            ))}
          </ul>
          <p className="hqd-note">Forms open in the CMS, where the records are kept.</p>
        </Card>
        <Missing s={s} />
      </div>
      <div className="hqd__row"><Matrix s={s} /></div>
    </>
  )
}
