import React from 'react'
import Link from 'next/link'
import { AGENTS } from './agents'
import type { Status } from './sample'
import { BlurFade } from './magic/BlurFade'

export const gbp = (n: number, dp = 0) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`
export const agent = (slug: string) => AGENTS.find((a) => a.slug === slug)!

export const STATUS: Record<Status, { icon: string; label: string }> = {
  good: { icon: '✓', label: 'Healthy' },
  warning: { icon: '!', label: 'Watch' },
  serious: { icon: '▲', label: 'Act soon' },
  critical: { icon: '✕', label: 'Urgent' },
  missing: { icon: '?', label: 'No data' },
}

/** Status = colour + icon + label, never colour alone. */
export function Badge({ s, text }: { s: Status; text?: string }) {
  return (
    <span className={`hq-st hq-st--${s}`}>
      <i aria-hidden="true">{STATUS[s].icon}</i>
      {text ?? STATUS[s].label}
    </span>
  )
}

export function Who({ slug }: { slug: string }) {
  const a = agent(slug)
  return (
    <Link href={`/hq/agents/${slug}`} className="hq-who" title={`${a.persona} · ${a.name}`}>
      <span aria-hidden="true">{a.icon}</span>
      {a.persona}
    </Link>
  )
}

export function Delta({ v, unit = '%', good = 'up' }: { v: number; unit?: string; good?: 'up' | 'down' }) {
  const isGood = good === 'up' ? v >= 0 : v <= 0
  return <em className={`hq-delta ${isGood ? 'is-good' : 'is-bad'}`}>{v >= 0 ? '▲' : '▼'} {Math.abs(v)}{unit}</em>
}

export function Card({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <BlurFade as="article" className={`hqd-card ${className}`} delay={delay}>{children}</BlurFade>
}

export function CardHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return <div className="hqd-card__head"><h2>{title}</h2>{children}</div>
}

export function PageHead({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="hqp-head">
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </header>
  )
}
