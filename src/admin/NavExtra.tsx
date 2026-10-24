import React from 'react'
import Link from 'next/link'

export const NavExtra = () => (
  <div className="nova-navextra">
    <Link href="/admin/hq" className="nav__link nova-navextra__hq">✦ Nova HQ (café management)</Link>
    <Link href="/admin/kitchen" className="nav__link">Kitchen screen</Link>
    <Link href="/admin/bookings" className="nav__link">Event bookings calendar</Link>
    <Link href="/" className="nav__link" target="_blank">View website ↗</Link>
  </div>
)
