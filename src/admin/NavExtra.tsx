import React from 'react'
import Link from 'next/link'

/** Shown straight after the "Today" group (placed with CSS order). */
export const NavToday = () => (
  <div className="nova-navextra nova-navextra--today">
    <Link href="/admin/kitchen" className="nav__link">Kitchen screen</Link>
    <Link href="/admin/bookings" className="nav__link">Event bookings calendar</Link>
    <Link href="/" className="nav__link" target="_blank">View website ↗</Link>
  </div>
)

/** Shown straight after the "Nova HQ · Data" group: Nova HQ is its own app at /hq. */
export const NavHQ = () => (
  <div className="nova-navextra nova-navextra--hq">
    <span className="nova-navextra__label">Nova HQ</span>
    <a href="/hq" className="nav__link nova-navextra__hq">✦ Open Nova HQ</a>
    <span className="nova-navextra__hint">Dashboard, AI team and reports</span>
  </div>
)

export const NavExtra = NavToday
