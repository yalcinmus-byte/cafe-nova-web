import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AGENTS } from '@/hq/agents'
import { getSample } from '@/hq/sample'
import { Badge, Card, CardHead } from '@/hq/ui'
import { Ideas } from '@/hq/sections'
import { BorderBeam } from '@/hq/magic/BorderBeam'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = AGENTS.find((x) => x.slug === slug)
  return { title: a ? `${a.persona} · ${a.name}` : 'Agent' }
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = AGENTS.find((x) => x.slug === slug)
  if (!a) notFound()
  const s = getSample()
  const t = s.team[a.slug]
  const alerts = s.urgent.filter((u) => u.agent === a.slug)
  const threads = s.threads.filter((th) => th.agents.includes(a.slug))
  const reads = s.uses[a.slug]
  const hasIdeas = s.insights.some((i) => i.agent === a.slug)
  return (
    <>
      <Link href="/hq/agents" className="hqp-back">← AI team</Link>
      <header className="hq-agent__head">
        <span className="hq__agent-icon hq-agent__icon" aria-hidden="true">{a.icon}</span>
        <div>
          <span className={`hqd-agent__state hqd-agent__state--on-dark is-${t.status}`}><i />{t.label}</span>
          <h1>{a.persona} <small>· {a.name}</small></h1>
          <p>{a.role}</p>
        </div>
        <dl className="hq-agent__stats">
          <div><dt>Data coverage</dt><dd>{t.coverage}%</dd></div>
          <div><dt>Open items</dt><dd>{t.open}</dd></div>
          <div><dt>Next briefing</dt><dd>{t.next}</dd></div>
        </dl>
      </header>
      <div className="hq-agent__grid">
        <section className="hq-agent__chat is-beam" aria-label={`Chat with ${a.persona}`}>
          <BorderBeam duration={10} />
          <div className="hq-agent__msgs">
            <div className="hq-msg hq-msg--bot">Hi, I’m {a.persona}, Nova’s {a.name.toLowerCase()}. Once your data is connected I’ll answer questions like:</div>
            <div className="hq-msg hq-msg--you">{a.ask.replace(/[“”]/g, '')}</div>
            <div className="hq-msg hq-msg--bot hq-msg--muted">I’ll be able to answer this as soon as I’m switched on.</div>
          </div>
          <form className="hq-agent__input">
            <input disabled placeholder={`Ask ${a.persona} — available soon`} />
            <button type="button" disabled>Send</button>
          </form>
        </section>
        <aside className="hq-agent__side">
          <Card><CardHead title={`What ${a.persona} does`} /><ul className="hq-list">{a.does.map((d) => <li key={d}>{d}</li>)}</ul></Card>
          <Card delay={0.05}>
            <CardHead title="Reads" />
            <ul className="hq-reads">{reads.map((r) => <li key={r}><i className={`hqd-dot is-${s.sourceState[r]}`} />{r}<em>{s.sourceState[r] === 'live' ? 'Live' : s.sourceState[r] === 'sample' ? 'Sample' : 'Missing'}</em></li>)}</ul>
          </Card>
          <Card delay={0.1}>
            <CardHead title="Settings" />
            <ul className="hq-agent__settings">
              <li><span>AI model</span><em>Your OpenAI key · not connected</em></li>
              <li><span>Briefing</span><em>{t.next}</em></li>
              <li><span>Needs approval before acting</span><em>Always</em></li>
            </ul>
          </Card>
        </aside>
      </div>
      {alerts.length > 0 && (
        <section className="hqd-sec">
          <div className="hq__sechead"><h2>Flagged by {a.persona}</h2></div>
          <Card><ul className="hqd-alerts">{alerts.map((u) => <li key={u.title}><Badge s={u.level} /><div><b>{u.title}</b><p>{u.detail}</p></div><span className="hqd-muted">Due: {u.due}</span></li>)}</ul></Card>
        </section>
      )}
      {hasIdeas && <section className="hqd-sec"><div className="hq__sechead"><h2>{a.persona}’s suggestions</h2></div><Ideas s={s} only={[a.slug]} /></section>}
      {threads.length > 0 && (
        <section className="hqd-sec">
          <div className="hq__sechead"><h2>Works with</h2></div>
          <div className="hqd-ideas">
            {threads.map((th) => (
              <Card key={th.title} className="hqd-idea">
                <header><b>{th.title}</b><span className="hqd-idea__tag">{th.state}</span></header>
                <ol className="hq-steps">
                  {th.steps.map((st, i) => {
                    const x = AGENTS.find((g) => g.slug === th.agents[i])!
                    return <li key={st} className={x.slug === a.slug ? 'is-me' : undefined}><span>{x.icon}</span>{st}</li>
                  })}
                </ol>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
