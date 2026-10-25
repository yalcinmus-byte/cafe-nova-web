import React from 'react'
import { Shell } from '@/hq/Shell'
import { AGENTS } from '@/hq/agents'
import { getSample } from '@/hq/sample'
import { requireUser } from '@/hq/auth'

export const dynamic = 'force-dynamic'

export default async function HQLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser()
  const s = getSample()
  const agents = AGENTS.map((a) => ({ slug: a.slug, icon: a.icon, persona: a.persona, name: a.name, status: s.team[a.slug].status, open: s.team[a.slug].open }))
  const urgent = s.urgent.filter((u) => u.level === 'critical' || u.level === 'serious').length
  return <Shell agents={agents} user={(user as { email?: string }).email ?? 'Owner'} urgent={urgent}>{children}</Shell>
}
