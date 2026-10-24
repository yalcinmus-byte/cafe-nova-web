import React from 'react'
import Link from 'next/link'
import { AGENTS } from './agents'

/** Shown straight after the "Today" group (placed with CSS order). */
export const NavToday = () => (
  <div className="nova-navextra nova-navextra--today">
    <Link href="/admin/kitchen" className="nav__link">Kitchen screen</Link>
    <Link href="/admin/bookings" className="nav__link">Event bookings calendar</Link>
    <Link href="/" className="nav__link" target="_blank">View website ↗</Link>
  </div>
)

/** Shown straight after the "Nova HQ" group. */
export const NavHQ = () => (
  <div className="nova-navextra nova-navextra--hq">
    <span className="nova-navextra__label">Nova HQ · AI team</span>
    <Link href="/admin/hq" className="nav__link nova-navextra__hq">✦ HQ dashboard</Link>
    {AGENTS.map((a) => (
      <Link key={a.slug} href={`/admin/hq/${a.slug}`} className="nav__link nova-navextra__agent"><span aria-hidden="true">{a.icon}</span>{a.persona} · {a.name}</Link>
    ))}
  </div>
)

export const NavExtra = NavToday
