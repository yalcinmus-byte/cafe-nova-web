import React from 'react'
import { AGENTS } from '@/hq/agents'
import { getSample } from '@/hq/sample'
import { Card, CardHead, PageHead } from '@/hq/ui'
import { Ideas, Matrix, TeamGrid, Threads } from '@/hq/sections'
import { AgentNetwork } from '@/hq/AgentNetwork'

export const metadata = { title: 'AI team' }

export default function Team() {
  const s = getSample()
  const sources = s.SOURCES.map((name) => ({ name, state: s.sourceState[name] }))
  const agents = AGENTS.map((a) => ({ slug: a.slug, icon: a.icon, persona: a.persona, name: a.name, status: s.team[a.slug].status }))
  return (
    <>
      <PageHead title="Your AI team" intro="Eight advisers that read the café’s data, check each other’s work and bring you suggestions. Nothing changes without your approval." />
      <Card className="hqd-net">
        <CardHead title="How data flows"><span className="hqd-muted">Moving lines are working today · dashed lines are waiting for data</span></CardHead>
        <AgentNetwork sources={sources} agents={agents} />
      </Card>
      <section className="hqd-sec"><div className="hq__sechead"><h2>Status</h2><span className="hq__pill hq__pill--soft">Uses your own OpenAI key · switched on at launch</span></div><TeamGrid s={s} /></section>
      <div className="hqd__row hqd__row--1-1"><Threads s={s} /><Matrix s={s} /></div>
      <section className="hqd-sec"><div className="hq__sechead"><h2>All suggestions</h2></div><Ideas s={s} /></section>
    </>
  )
}
