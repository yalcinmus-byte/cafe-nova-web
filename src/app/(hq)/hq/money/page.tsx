import React from 'react'
import { getSample } from '@/hq/sample'
import { Badge, Card, CardHead, gbp, PageHead, Who } from '@/hq/ui'
import { Ideas, MixCard, PoundCard } from '@/hq/sections'
import { NumberTicker } from '@/hq/magic/NumberTicker'

export const metadata = { title: 'Money & costs' }

export default function Money() {
  const s = getSample()
  const money = s.urgent.filter((u) => u.agent === 'cfo' || u.agent === 'suppliers')
  const rows = [
    { name: 'Food & drink', p: s.pct.food, target: '28–32%', st: 'good' as const },
    { name: 'Staff wages', p: s.pct.labour, target: '32% or less', st: 'warning' as const },
    { name: 'Prime cost (food + staff)', p: s.prime, target: '62% or less', st: 'serious' as const },
    { name: 'Delivery app commission', p: s.pct.commission, target: 'as low as possible', st: 'warning' as const },
    { name: 'Profit', p: s.profit, target: '10% or more', st: 'warning' as const },
  ]
  return (
    <>
      <PageHead title="Money & costs" intro="Where the money goes, against healthy targets for a UK café. Real figures appear once the EPOS, invoices, rota and bank are connected." />
      <section className="hqd-kpis hqd-kpis--3">
        <Card className="hqd-kpi"><span>Net sales (ex VAT)</span><b><NumberTicker value={Math.round(s.net)} prefix="£" /></b><small>{s.period.label}</small></Card>
        <Card className="hqd-kpi" delay={0.05}><span>Estimated profit</span><b><NumberTicker value={Math.round((s.net * s.profit) / 100)} prefix="£" /></b><small>{s.profit}% of net sales</small></Card>
        <Card className="hqd-kpi" delay={0.1}><span>VAT to set aside</span><b><NumberTicker value={12700} prefix="≈ £" /></b><small>Quarter to 31 Oct · due 7 Dec</small></Card>
      </section>
      <div className="hqd__row hqd__row--1-1">
        <Card>
          <CardHead title="Costs against target"><Who slug="cfo" /></CardHead>
          <table className="hqd-menu">
            <thead><tr><th>Cost</th><th>Now</th><th>Healthy target</th><th>Status</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.name}><td>{r.name}</td><td><b>{r.p}%</b></td><td>{r.target}</td><td><Badge s={r.st} /></td></tr>)}</tbody>
          </table>
          <p className="hqd-note">Prime cost {s.prime}% is {(s.prime - 62).toFixed(1)} points over target: about {gbp((s.net * (s.prime - 62)) / 100)} this period.</p>
        </Card>
        <PoundCard s={s} />
      </div>
      <div className="hqd__row hqd__row--1-1">
        <MixCard s={s} />
        <Card delay={0.05}>
          <CardHead title="Money alerts" />
          <ul className="hqd-alerts">{money.map((u) => <li key={u.title}><Badge s={u.level} /><div><b>{u.title}</b><p>{u.detail}</p></div><Who slug={u.agent} /></li>)}</ul>
        </Card>
      </div>
      <section className="hqd-sec"><div className="hq__sechead"><h2>Ways to protect margin</h2></div><Ideas s={s} only={['rota', 'menu', 'growth']} limit={3} /></section>
    </>
  )
}
