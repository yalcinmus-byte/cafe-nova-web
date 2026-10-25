import React from 'react'
import Link from 'next/link'
import { AGENTS } from './agents'
import { getSample, HOURS, type Status } from './sample'
import { ChannelBar, DailyChart, DowBars, Heatmap, MenuMatrix, PoundSplit, Spark } from './charts'
import { Badge, Card, CardHead, Delta, gbp, agent, STATUS, Who } from './ui'
import { NumberTicker } from './magic/NumberTicker'
import { BorderBeam } from './magic/BorderBeam'

export type Sample = ReturnType<typeof getSample>

export function Health({ s }: { s: Sample }) {
  const ring = 2 * Math.PI * 52
  const scoreState: Status = s.score >= 80 ? 'good' : s.score >= 60 ? 'warning' : 'serious'
  const counts = (['critical', 'serious', 'warning', 'good', 'missing'] as Status[]).map((k) => [k, s.checks.filter((c) => c.status === k).length] as const)
  return (
    <Card className="hqd-health is-beam">
      <BorderBeam />
      <CardHead title="Business health"><Badge s={scoreState} text={`${s.score}/100`} /></CardHead>
      <div className="hqd-health__body">
        <div className="hqd-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ece9e0" strokeWidth="12" />
            <circle className="hqd-ring__arc" cx="60" cy="60" r="52" fill="none" stroke="#1d5a7e" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(ring * s.score) / 100} ${ring}`} transform="rotate(-90 60 60)" />
          </svg>
          <div><b><NumberTicker value={s.score} /></b><span>out of 100</span></div>
        </div>
        <ul className="hqd-health__sum">
          {counts.filter(([, n]) => n).map(([k, n]) => <li key={k}><Badge s={k} text={`${n} ${STATUS[k].label.toLowerCase()}`} /></li>)}
        </ul>
      </div>
      <ul className="hqd-checks">
        {s.checks.map((c) => (
          <li key={c.name}>
            <Badge s={c.status} text="" />
            <div><b>{c.name}</b><span>{c.note}</span></div>
            <strong>{c.value}</strong>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function Urgent({ s, limit }: { s: Sample; limit?: number }) {
  const items = limit ? s.urgent.slice(0, limit) : s.urgent
  return (
    <Card className="hqd-urgent" delay={0.05}>
      <CardHead title="Needs you"><span className="hqd-muted">{s.urgent.length} items · most urgent first</span></CardHead>
      <ol>
        {items.map((u, i) => (
          <li key={u.title} className={`is-${u.level}`} style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
            <Badge s={u.level} />
            <div>
              <b>{u.title}</b>
              <p>{u.detail}</p>
              <footer><Who slug={u.agent} /><span>Due: {u.due}</span><button type="button" disabled>Open</button></footer>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}

export function Kpis({ s }: { s: Sample }) {
  const spend = s.takings / s.tx
  const priorSpend = s.prior / s.priorTx
  const txGrowth = +(((s.tx - s.priorTx) / s.priorTx) * 100).toFixed(1)
  const spendGrowth = +(((spend - priorSpend) / priorSpend) * 100).toFixed(1)
  return (
    <section className="hqd-kpis" aria-label="Key numbers">
      <Card className="hqd-kpi"><span>Takings (inc. VAT)</span><b><NumberTicker value={s.takings} prefix="£" /></b><Delta v={s.growth} /><Spark values={s.days.map((d) => d.takings)} /><small>Net of VAT {gbp(s.net)}</small></Card>
      <Card className="hqd-kpi" delay={0.04}><span>Sales (receipts)</span><b><NumberTicker value={s.tx} /></b><Delta v={txGrowth} /><Spark values={s.days.map((d) => d.tx)} /><small>{Math.round(s.tx / 28)} a day on average</small></Card>
      <Card className="hqd-kpi" delay={0.08}><span>Average spend</span><b><NumberTicker value={+spend.toFixed(2)} decimals={2} prefix="£" /></b><Delta v={spendGrowth} /><Spark values={s.days.map((d) => d.spend)} /><small>Weekends spend more per guest</small></Card>
      <Card className="hqd-kpi" delay={0.12}><span>Food cost</span><b><NumberTicker value={s.pct.food} decimals={1} suffix="%" /></b><Badge s="good" text="On target" /><small>Target 28–32% of net sales</small></Card>
      <Card className="hqd-kpi" delay={0.16}><span>Staff cost</span><b><NumberTicker value={s.pct.labour} decimals={1} suffix="%" /></b><Badge s="warning" text="Above target" /><small>Target 32% or less</small></Card>
      <Card className="hqd-kpi" delay={0.2}><span>Profit (estimate)</span><b><NumberTicker value={s.profit} decimals={1} suffix="%" /></b><Badge s="warning" text="Thin" /><small>About {gbp((s.net * s.profit) / 100)} this period</small></Card>
    </section>
  )
}

export function DailyCard({ s, table = true }: { s: Sample; table?: boolean }) {
  return (
    <Card>
      <CardHead title="Daily takings">
        <ul className="hq-legend hq-legend--inline"><li><i style={{ background: '#1d5a7e' }} />Last 28 days</li><li><i className="is-dash" />Previous 28 days</li></ul>
      </CardHead>
      <DailyChart days={s.days} />
      {table && (
        <details className="hqd-table">
          <summary>Show as a table</summary>
          <table><thead><tr><th>Date</th><th>Takings</th><th>Sales</th><th>Avg spend</th><th>Previous</th></tr></thead>
            <tbody>{s.days.map((d) => <tr key={d.date.toISOString()}><td>{d.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}</td><td>{gbp(d.takings)}</td><td>{d.tx}</td><td>{gbp(d.spend, 2)}</td><td>{gbp(d.prior)}</td></tr>)}</tbody>
          </table>
        </details>
      )}
    </Card>
  )
}

export function AvgDayCard({ s }: { s: Sample }) {
  return (
    <Card delay={0.05}>
      <CardHead title="Average day"><Who slug="growth" /></CardHead>
      <DowBars rows={s.byDow} weekendAvg={s.weekendAvg} />
      <p className="hqd-note">Monday to Wednesday is where the growth is. Each extra 15 guests on those days is about £170 a day.</p>
    </Card>
  )
}

export function HeatCard({ s }: { s: Sample }) {
  return (
    <Card>
      <CardHead title="When the money comes in"><span className="hqd-muted">Average takings per hour</span></CardHead>
      <Heatmap rows={s.heat} hours={HOURS} />
      <p className="hqd-note">Saturday 9am–12pm is the busiest window of the week. Weekday afternoons after 2pm are the quietest.</p>
    </Card>
  )
}

export function MixCard({ s }: { s: Sample }) {
  return (
    <Card delay={0.05}>
      <CardHead title="Where sales come from" />
      <ChannelBar channels={s.channels} />
      <p className="hqd-note">Delivery apps cost {gbp(s.commission)} in commission this period.</p>
    </Card>
  )
}

export function PoundCard({ s }: { s: Sample }) {
  return (
    <Card delay={0.08}>
      <CardHead title="Where each £1 goes"><Who slug="cfo" /></CardHead>
      <PoundSplit costs={s.costs} />
    </Card>
  )
}

export function MenuCards({ s }: { s: Sample }) {
  return (
    <>
      <Card>
        <CardHead title="Menu engineering"><Who slug="menu" /></CardHead>
        <MenuMatrix dishes={s.menu} popLine={s.popLine} marginLine={s.marginLine} />
        <p className="hqd-note">Profit per plate is after VAT and ingredients. Dashed lines: average profit (£{s.marginLine.toFixed(2)}) and 70% of average plates sold.</p>
      </Card>
      <Card delay={0.05}>
        <CardHead title="What to do with each dish" />
        <table className="hqd-menu">
          <thead><tr><th>Dish</th><th>Sold</th><th>Profit / plate</th><th>Type</th></tr></thead>
          <tbody>
            {[...s.menu].sort((a, b) => b.qty * b.margin - a.qty * a.margin).map((d) => (
              <tr key={d.name}><td>{d.name}</td><td>{d.qty}</td><td>£{d.margin.toFixed(2)}</td><td><span className={`hq-type hq-type--${d.group.toLowerCase()}`}>{d.group}</span></td></tr>
            ))}
          </tbody>
        </table>
        <dl className="hqd-legend-types">
          <div><dt>Stars</dt><dd>Popular and profitable. Keep them exactly as they are.</dd></div>
          <div><dt>Workhorses</dt><dd>Popular, lower profit. Review portion or price gently.</dd></div>
          <div><dt>Puzzles</dt><dd>Profitable, not seen. Better photo, badge, menu position.</dd></div>
          <div><dt>Dogs</dt><dd>Neither. Rework or replace at the next menu change.</dd></div>
        </dl>
      </Card>
    </>
  )
}

export function Ideas({ s, only, limit }: { s: Sample; only?: string[]; limit?: number }) {
  let list = only ? s.insights.filter((i) => only.includes(i.agent)) : s.insights
  if (limit) list = list.slice(0, limit)
  return (
    <div className="hqd-ideas">
      {list.map((i, n) => (
        <Card key={i.title} className="hqd-idea" delay={n * 0.05}>
          <header><Who slug={i.agent} /><span className="hqd-idea__tag">{i.tag}</span></header>
          <h3>{i.title}</h3>
          <p>{i.detail}</p>
          <footer>
            <span><small>Expected</small><b>{i.impact}</b></span>
            <span><small>Confidence</small><b>{i.confidence}</b></span>
            <button type="button" disabled>Approve</button>
          </footer>
        </Card>
      ))}
    </div>
  )
}

export function TeamGrid({ s }: { s: Sample }) {
  return (
    <div className="hqd-team">
      {AGENTS.map((a, n) => {
        const t = s.team[a.slug]
        return (
          <Link key={a.slug} href={`/hq/agents/${a.slug}`} className="hqd-agent" style={{ animationDelay: `${n * 0.04}s` }}>
            <header>
              <span className="hq__agent-icon" aria-hidden="true">{a.icon}</span>
              <div><h3>{a.persona} <small>· {a.name}</small></h3><span className={`hqd-agent__state is-${t.status}`}><i />{t.label}</span></div>
            </header>
            <div className="hqd-agent__cov"><span>Data coverage</span><b>{t.coverage}%</b><span className="hqd-agent__track"><span style={{ width: `${t.coverage}%` }} /></span></div>
            <dl>
              <div><dt>Open items</dt><dd>{t.open}</dd></div>
              <div><dt>Last briefing</dt><dd>{t.last}</dd></div>
              <div><dt>Next</dt><dd>{t.next}</dd></div>
            </dl>
          </Link>
        )
      })}
    </div>
  )
}

export function Threads({ s }: { s: Sample }) {
  return (
    <Card>
      <CardHead title="Working together"><span className="hqd-muted">Agents hand work to each other</span></CardHead>
      <ul className="hqd-threads">
        {s.threads.map((t) => (
          <li key={t.title}>
            <div className="hqd-threads__top"><b>{t.title}</b><span>{t.state}</span></div>
            <ol>
              {t.steps.map((step, i) => {
                const a = agent(t.agents[i])
                return <li key={step}><span className="hqd-threads__av" title={`${a.persona} · ${a.name}`}>{a.icon}</span><span>{step}</span></li>
              })}
            </ol>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function Matrix({ s }: { s: Sample }) {
  return (
    <Card delay={0.05}>
      <CardHead title="Who reads what"><span className="hqd-muted">One upload helps several agents</span></CardHead>
      <div className="hqd-matrix-wrap">
        <table className="hqd-matrix">
          <thead>
            <tr><th />{s.SOURCES.map((src) => <th key={src} scope="col"><span>{src}</span></th>)}</tr>
            <tr className="hqd-matrix__state"><th>Status</th>{s.SOURCES.map((src) => <td key={src}><span className={`is-${s.sourceState[src]}`}>{s.sourceState[src] === 'live' ? 'Live' : s.sourceState[src] === 'sample' ? 'Sample' : 'Missing'}</span></td>)}</tr>
          </thead>
          <tbody>
            {AGENTS.map((a) => (
              <tr key={a.slug}>
                <th scope="row">{a.persona}</th>
                {s.SOURCES.map((src) => {
                  const on = s.uses[a.slug].includes(src)
                  return <td key={src}>{on ? <i className={`hqd-dot is-${s.sourceState[src]}`} title={`${a.persona} reads ${src}`} /> : <span className="hqd-dot-off" aria-label="not used" />}</td>
                })}
              </tr>
            ))}
            <tr className="hqd-matrix__sum"><th>Agents helped</th>{s.SOURCES.map((src) => <td key={src}>{AGENTS.filter((a) => s.uses[a.slug].includes(src)).length}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="hqd-note">EPOS sales feed {AGENTS.filter((a) => s.uses[a.slug].includes('EPOS sales')).length} of {AGENTS.length} agents, so connecting the EPOS is the single biggest step.</p>
    </Card>
  )
}

export function Missing({ s }: { s: Sample }) {
  const done = s.missing.filter((m) => m.done).length
  return (
    <Card>
      <CardHead title="Missing data"><span className="hqd-muted">{done} of {s.missing.length} connected</span></CardHead>
      <div className="hqd-progress"><span style={{ width: `${(done / s.missing.length) * 100}%` }} /></div>
      <ul className="hqd-missing">
        {s.missing.map((m) => (
          <li key={m.name} className={m.done ? 'is-done' : undefined}>
            <i aria-hidden="true">{m.done ? '✓' : ''}</i>
            <div><b>{m.name}</b><span>{m.why}</span></div>
            <em>{m.done ? 'Live' : 'To do'}</em>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export { gbp }
