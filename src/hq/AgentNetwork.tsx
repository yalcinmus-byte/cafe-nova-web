'use client'
import React, { useRef, createRef, useMemo } from 'react'
import Link from 'next/link'
import { AnimatedBeam } from './magic/AnimatedBeam'

type Src = { name: string; state: 'live' | 'sample' | 'missing' }
type Ag = { slug: string; icon: string; persona: string; name: string; status: 'demo' | 'needs' | 'ready' }

/** Data sources → Nova HQ → AI agents, with animated beams for what is flowing today and dashed lines for what isn't. */
export function AgentNetwork({ sources, agents }: { sources: Src[]; agents: Ag[] }) {
  const box = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const sRefs = useMemo(() => sources.map(() => createRef<HTMLDivElement>()), [sources])
  const aRefs = useMemo(() => agents.map(() => createRef<HTMLAnchorElement>()), [agents])
  return (
    <div className="net" ref={box}>
      <div className="net__col">
        <span className="net__cap">Your data</span>
        {sources.map((s, i) => (
          <div key={s.name} ref={sRefs[i]} className={`net__node net__node--src is-${s.state}`}>
            <i />{s.name}<em>{s.state === 'live' ? 'Live' : s.state === 'sample' ? 'Sample' : 'Missing'}</em>
          </div>
        ))}
      </div>
      <div className="net__mid">
        <div ref={hub} className="net__hub">
          <svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#1d5a7e" /><path d="M12 29V11h3.2l9.6 12.4V11H28v18h-3.2l-9.6-12.4V29z" fill="#fff" /></svg>
          <b>Nova HQ</b><span>reads, checks, connects</span>
        </div>
      </div>
      <div className="net__col">
        <span className="net__cap">AI team</span>
        {agents.map((a, i) => (
          <Link key={a.slug} href={`/hq/agents/${a.slug}`} ref={aRefs[i]} className={`net__node net__node--agent is-${a.status}`}>
            <span className="net__av">{a.icon}</span><b>{a.persona}</b><small>{a.name}</small>
          </Link>
        ))}
      </div>
      {sources.map((s, i) => (
        <AnimatedBeam key={s.name} containerRef={box} fromRef={sRefs[i]} toRef={hub} curvature={(i - 3) * -8} dim={s.state === 'missing'} delay={i * 0.35} duration={3.6} />
      ))}
      {agents.map((a, i) => (
        <AnimatedBeam key={a.slug} containerRef={box} fromRef={hub} toRef={aRefs[i]} curvature={(i - 3.5) * 8} dim={a.status === 'needs'} delay={0.6 + i * 0.3} duration={3.6} color="#1d5a7e" color2="#5fbdb7" />
      ))}
    </div>
  )
}
