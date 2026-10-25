'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavAgent = { slug: string; icon: string; persona: string; name: string; status: 'demo' | 'needs' | 'ready'; open: number }

const MAIN = [
  { href: '/hq', label: 'Overview', icon: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { href: '/hq/sales', label: 'Sales', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { href: '/hq/menu', label: 'Menu & margins', icon: 'M7 3v18M4 3v6a3 3 0 0 0 6 0V3M17 3c-2 0-3 3-3 7h3v11' },
  { href: '/hq/money', label: 'Money & costs', icon: 'M12 3v18M17 7c-1-1.5-3-2-5-2-3 0-5 1.4-5 3.5S9 12 12 12s5 1.4 5 3.5S15 19 12 19c-2.2 0-4-.6-5-2' },
]
const DATA = [
  { href: '/hq/data', label: 'Data & uploads', icon: 'M12 3c5 0 8 1.3 8 3s-3 3-8 3-8-1.3-8-3 3-3 8-3zM4 6v6c0 1.7 3 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3 3 8 3s8-1.3 8-3v-6' },
]

function Ico({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

export function Shell({ agents, user, urgent, children }: { agents: NavAgent[]; user: string; urgent: number; children: React.ReactNode }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [path])
  const is = (href: string) => (href === '/hq' ? path === '/hq' : path === href || path.startsWith(href + '/'))
  return (
    <div className={`hqs ${open ? 'is-open' : ''}`}>
      <aside className="hqs__side" aria-label="Nova HQ">
        <div className="hqs__brand">
          <Link href="/hq" className="hqs__logo">
            <svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#5fbdb7" /><path d="M12 29V11h3.2l9.6 12.4V11H28v18h-3.2l-9.6-12.4V29z" fill="#12293a" /></svg>
            <span><b>Nova HQ</b><small>Cafe Nova Bistro</small></span>
          </Link>
          <button type="button" className="hqs__close" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <nav className="hqs__nav">
          <span className="hqs__cap">Business</span>
          {MAIN.map((m) => (
            <Link key={m.href} href={m.href} className={`hqs__link ${is(m.href) ? 'is-on' : ''}`} aria-current={is(m.href) ? 'page' : undefined}>
              <Ico d={m.icon} />{m.label}{m.href === '/hq' && urgent > 0 && <em className="hqs__count">{urgent}</em>}
            </Link>
          ))}
          <span className="hqs__cap">Nova HQ · AI team</span>
          <Link href="/hq/agents" className={`hqs__link hqs__link--team ${path === '/hq/agents' ? 'is-on' : ''}`}>
            <span className="hqs__spark" aria-hidden="true">✦</span>Team overview
          </Link>
          {agents.map((a) => (
            <Link key={a.slug} href={`/hq/agents/${a.slug}`} className={`hqs__link hqs__agent ${is(`/hq/agents/${a.slug}`) ? 'is-on' : ''}`}>
              <span className="hqs__av" aria-hidden="true">{a.icon}<i className={`is-${a.status}`} /></span>
              <span className="hqs__agent-name">{a.persona}<small>{a.name}</small></span>
              {a.open > 0 && <em className="hqs__count hqs__count--soft">{a.open}</em>}
            </Link>
          ))}
          <span className="hqs__cap">Data</span>
          {DATA.map((m) => (
            <Link key={m.href} href={m.href} className={`hqs__link ${is(m.href) ? 'is-on' : ''}`}><Ico d={m.icon} />{m.label}</Link>
          ))}
        </nav>
        <div className="hqs__foot">
          <a href="/admin" className="hqs__link"><Ico d="M4 5h16v11H4zM8 20h8M12 16v4" />Website CMS</a>
          <a href="/" target="_blank" rel="noreferrer" className="hqs__link"><Ico d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />View website</a>
          <div className="hqs__user"><span>{user.charAt(0).toUpperCase()}</span><small>{user}</small></div>
        </div>
      </aside>
      <div className="hqs__scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="hqs__main">
        <header className="hqs__top">
          <button type="button" className="hqs__burger" onClick={() => setOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
          <span className="hqs__sample"><i aria-hidden="true" />Sample data · switches to your EPOS when connected</span>
          <div className="hqs__chips" aria-label="Period">
            <span>Today</span><span>7 days</span><span className="is-on">28 days</span><span>Quarter</span>
          </div>
        </header>
        <main className="hqs__content">{children}</main>
      </div>
    </div>
  )
}
