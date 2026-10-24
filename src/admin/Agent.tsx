import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { notFound, redirect } from 'next/navigation'
import { AGENTS } from './agents'

/** One AI adviser's page: what it does, what it reads, and its (coming-soon) chat. */
export async function Agent({ initPageResult, params }: AdminViewServerProps) {
  if (!initPageResult.req.user) redirect('/admin/login?redirect=%2Fadmin%2Fhq')
  const segs = (params?.segments as string[] | undefined) ?? []
  const a = AGENTS.find((x) => x.slug === segs[1])
  if (!a) notFound()
  return (
    <div className="hq hq-agent">
      <Link href="/admin/hq" className="hq-agent__back">← Nova HQ</Link>
      <header className="hq-agent__head">
        <span className="hq__agent-icon hq-agent__icon" aria-hidden="true">{a.icon}</span>
        <div>
          <span className="hq__pill">Preview · going live soon</span>
          <h1>{a.persona} <small>· {a.name}</small></h1>
          <p>{a.role}</p>
        </div>
      </header>
      <div className="hq-agent__grid">
        <section className="hq-agent__chat" aria-label={`Chat with ${a.persona}`}>
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
          <div className="hq-agent__box"><h2>What {a.persona} does</h2><ul>{a.does.map((d) => <li key={d}>{d}</li>)}</ul></div>
          <div className="hq-agent__box"><h2>Reads</h2><p>{a.needs}</p></div>
          <div className="hq-agent__box"><h2>Settings</h2>
            <ul className="hq-agent__settings">
              <li><span>AI model</span><em>Your OpenAI key · not connected</em></li>
              <li><span>Weekly briefing</span><em>Mondays 8am · off</em></li>
              <li><span>Needs approval before acting</span><em>Always</em></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
