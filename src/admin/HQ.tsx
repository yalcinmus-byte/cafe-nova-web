import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { AGENTS } from './agents'
import { getSample, HOURS, type Status } from './hq-sample'
import { ChannelBar, DailyChart, DowBars, Heatmap, MenuMatrix, PoundSplit, Spark } from './hq-charts'

const gbp = (n: number, dp = 0) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`
const agent = (slug: string) => AGENTS.find((a) => a.slug === slug)!

const STATUS: Record<Status, { icon: string; label: string }> = {
  good: { icon: '✓', label: 'Healthy' },
  warning: { icon: '!', label: 'Watch' },
  serious: { icon: '▲', label: 'Act soon' },
  critical: { icon: '✕', label: 'Urgent' },
  missing: { icon: '?', label: 'No data' },
}

function Badge({ s, text }: { s: Status; text?: string }) {
  return (
    <span className={`hq-st hq-st--${s}`}>
      <i aria-hidden="true">{STATUS[s].icon}</i>
      {text ?? STATUS[s].label}
    </span>
  )
}

function Who({ slug }: { slug: string }) {
  const a = agent(slug)
  return (
    <Link href={`/admin/hq/${slug}`} className="hq-who" title={`${a.persona} · ${a.name}`}>
      <span aria-hidden="true">{a.icon}</span>
      {a.persona}
    </Link>
  )
}

function Delta({ v, unit = '%', good = 'up' }: { v: number; unit?: string; good?: 'up' | 'down' }) {
  const isGood = good === 'up' ? v >= 0 : v <= 0
  return <em className={`hq-delta ${isGood ? 'is-good' : 'is-bad'}`}>{v >= 0 ? '▲' : '▼'} {Math.abs(v)}{unit}</em>
}

export async function HQ({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login?redirect=%2Fadmin%2Fhq')
  const since = new Date(); since.setUTCHours(0, 0, 0, 0)
  const [orders, enq] = await Promise.all([
    req.payload.count({ collection: 'orders', where: { createdAt: { greater_than: since.toISOString() } }, req }),
    req.payload.count({ collection: 'enquiries', where: { status: { equals: 'new' } }, req }),
  ])

  const s = getSample()
  const spend = s.takings / s.tx
  const priorSpend = s.prior / s.priorTx
  const txGrowth = +(((s.tx - s.priorTx) / s.priorTx) * 100).toFixed(1)
  const spendGrowth = +(((spend - priorSpend) / priorSpend) * 100).toFixed(1)
  const ring = 2 * Math.PI * 52
  const scoreState: Status = s.score >= 80 ? 'good' : s.score >= 60 ? 'warning' : 'serious'
  const done = s.missing.filter((m) => m.done).length
  const counts = (['critical', 'serious', 'warning', 'good', 'missing'] as Status[]).map((k) => [k, s.checks.filter((c) => c.status === k).length] as const)

  return (
    <div className="hq hqd">
      {/* Header */}
      <header className="hqd__top">
        <div>
          <span className="hq__pill">Preview · going live soon</span>
          <h1>Nova HQ</h1>
          <p>How the café is doing, what needs you today, and what your AI team suggests next.</p>
        </div>
        <div className="hqd__period">
          <span className="hqd__sample"><b>Sample data</b> shaped like a real EPOS export. It switches to your own numbers when the EPOS is connected.</span>
          <div className="hqd__chips" aria-label="Period">
            <span>Today</span><span>7 days</span><span className="is-on">28 days</span><span>Quarter</span>
          </div>
          <small>{s.period.label} · compared with the {s.period.compare}</small>
        </div>
      </header>

      {/* Health + urgent */}
      <section className="hqd__row hqd__row--health">
        <article className="hqd-card hqd-health">
          <div className="hqd-card__head"><h2>Business health</h2><Badge s={scoreState} text={`${s.score}/100`} /></div>
          <div className="hqd-health__body">
            <div className="hqd-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#ece9e0" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1d5a7e" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(ring * s.score) / 100} ${ring}`} transform="rotate(-90 60 60)" />
              </svg>
              <div><b>{s.score}</b><span>out of 100</span></div>
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
        </article>

        <article className="hqd-card hqd-urgent">
          <div className="hqd-card__head"><h2>Needs you</h2><span className="hqd-muted">{s.urgent.length} items · most urgent first</span></div>
          <ol>
            {s.urgent.map((u) => (
              <li key={u.title} className={`is-${u.level}`}>
                <Badge s={u.level} />
                <div>
                  <b>{u.title}</b>
                  <p>{u.detail}</p>
                  <footer><Who slug={u.agent} /><span>Due: {u.due}</span><button type="button" disabled>Open</button></footer>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {/* KPIs */}
      <section className="hqd-kpis" aria-label="Key numbers">
        <div className="hqd-kpi"><span>Takings (inc. VAT)</span><b>{gbp(s.takings)}</b><Delta v={s.growth} /><Spark values={s.days.map((d) => d.takings)} /><small>Net of VAT {gbp(s.net)}</small></div>
        <div className="hqd-kpi"><span>Sales (receipts)</span><b>{s.tx.toLocaleString('en-GB')}</b><Delta v={txGrowth} /><Spark values={s.days.map((d) => d.tx)} /><small>{Math.round(s.tx / 28)} a day on average</small></div>
        <div className="hqd-kpi"><span>Average spend</span><b>{gbp(spend, 2)}</b><Delta v={spendGrowth} /><Spark values={s.days.map((d) => d.spend)} /><small>Weekends spend more per guest</small></div>
        <div className="hqd-kpi"><span>Food cost</span><b>{s.pct.food}%</b><Badge s="good" text="On target" /><small>Target 28–32% of net sales</small></div>
        <div className="hqd-kpi"><span>Staff cost</span><b>{s.pct.labour}%</b><Badge s="warning" text="Above target" /><small>Target 32% or less</small></div>
        <div className="hqd-kpi"><span>Profit (estimate)</span><b>{s.profit}%</b><Badge s="warning" text="Thin" /><small>About {gbp((s.net * s.profit) / 100)} this period</small></div>
      </section>

      {/* Sales charts */}
      <section className="hqd__row hqd__row--2-1">
        <article className="hqd-card">
          <div className="hqd-card__head">
            <h2>Daily takings</h2>
            <ul className="hq-legend hq-legend--inline"><li><i style={{ background: '#1d5a7e' }} />Last 28 days</li><li><i className="is-dash" />Previous 28 days</li></ul>
          </div>
          <DailyChart days={s.days} />
          <details className="hqd-table">
            <summary>Show as a table</summary>
            <table><thead><tr><th>Date</th><th>Takings</th><th>Sales</th><th>Avg spend</th><th>Previous</th></tr></thead>
              <tbody>{s.days.map((d) => <tr key={d.date.toISOString()}><td>{d.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}</td><td>{gbp(d.takings)}</td><td>{d.tx}</td><td>{gbp(d.spend, 2)}</td><td>{gbp(d.prior)}</td></tr>)}</tbody>
            </table>
          </details>
        </article>
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Average day</h2><Who slug="growth" /></div>
          <DowBars rows={s.byDow} weekendAvg={s.weekendAvg} />
          <p className="hqd-note">Monday to Wednesday is where the growth is. Each extra 15 guests on those days is about £170 a day.</p>
        </article>
      </section>

      <section className="hqd__row hqd__row--2-1">
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>When the money comes in</h2><span className="hqd-muted">Average takings per hour</span></div>
          <Heatmap rows={s.heat} hours={HOURS} />
          <p className="hqd-note">Saturday 9am–12pm is the busiest window of the week. Weekday afternoons after 2pm are the quietest.</p>
        </article>
        <article className="hqd-card hqd-stack">
          <div>
            <div className="hqd-card__head"><h2>Where sales come from</h2></div>
            <ChannelBar channels={s.channels} />
            <p className="hqd-note">Delivery apps cost {gbp(s.commission)} in commission this period.</p>
          </div>
          <div>
            <div className="hqd-card__head"><h2>Where each £1 goes</h2><Who slug="cfo" /></div>
            <PoundSplit costs={s.costs} />
          </div>
        </article>
      </section>

      {/* Menu engineering */}
      <section className="hqd__row hqd__row--1-1">
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Menu engineering</h2><Who slug="menu" /></div>
          <MenuMatrix dishes={s.menu} popLine={s.popLine} marginLine={s.marginLine} />
          <p className="hqd-note">Profit per plate is after VAT and ingredients. Dashed lines: average profit (£{s.marginLine.toFixed(2)}) and 70% of average plates sold.</p>
        </article>
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>What to do with each dish</h2></div>
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
        </article>
      </section>

      {/* Advice */}
      <section className="hqd-sec">
        <div className="hq__sechead"><h2>Suggestions from your AI team</h2><span className="hq__pill hq__pill--soft">You approve every change</span></div>
        <div className="hqd-ideas">
          {s.insights.map((i) => (
            <article key={i.title} className="hqd-idea">
              <header><Who slug={i.agent} /><span className="hqd-idea__tag">{i.tag}</span></header>
              <h3>{i.title}</h3>
              <p>{i.detail}</p>
              <footer>
                <span><small>Expected</small><b>{i.impact}</b></span>
                <span><small>Confidence</small><b>{i.confidence}</b></span>
                <button type="button" disabled>Approve</button>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* AI team */}
      <section className="hqd-sec">
        <div className="hq__sechead"><h2>Your AI team</h2><span className="hq__pill hq__pill--soft">Uses your own OpenAI key · switched on at launch</span></div>
        <div className="hqd-team">
          {AGENTS.map((a) => {
            const t = s.team[a.slug]
            return (
              <Link key={a.slug} href={`/admin/hq/${a.slug}`} className="hqd-agent">
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
      </section>

      <section className="hqd__row hqd__row--1-1">
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Working together</h2><span className="hqd-muted">Agents hand work to each other</span></div>
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
        </article>
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Who reads what</h2><span className="hqd-muted">Shared data means one upload helps several agents</span></div>
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
        </article>
      </section>

      {/* Missing data + live */}
      <section className="hqd__row hqd__row--1-1">
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Missing data</h2><span className="hqd-muted">{done} of {s.missing.length} connected</span></div>
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
        </article>
        <article className="hqd-card">
          <div className="hqd-card__head"><h2>Live from the website</h2><span className="hqd-muted">Real data, today</span></div>
          <div className="hq__live hqd-live">
            <div><b>{orders.totalDocs}</b><span>online orders today</span></div>
            <div><b>{enq.totalDocs}</b><span>new event enquiries</span></div>
          </div>
          <h3 className="hqd-sub">Upload now</h3>
          <ul className="hqd-links">
            <li><Link href="/admin/collections/documents/create">EPOS export or bank statement →</Link></li>
            <li><Link href="/admin/collections/purchases/create">Supplier invoice →</Link></li>
            <li><Link href="/admin/collections/expenses/create">Expense →</Link></li>
            <li><Link href="/admin/collections/suppliers">Suppliers list →</Link></li>
          </ul>
          <h3 className="hqd-sub">Roadmap</h3>
          <ol className="hqd-road">
            <li><b>1</b>Data in: EPOS, invoices, bank</li>
            <li><b>2</b>Monday briefings from each agent</li>
            <li><b>3</b>Ask any agent about your numbers</li>
            <li><b>4</b>One-tap approvals for posts, replies, orders and rotas</li>
          </ol>
        </article>
      </section>
    </div>
  )
}
