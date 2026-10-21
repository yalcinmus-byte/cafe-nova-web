import React from 'react'
import Link from 'next/link'

export const NavExtra = () => (
  <div className="nova-navextra">
    <Link href="/admin/kitchen" className="nav__link">Kitchen screen</Link>
    <Link href="/" className="nav__link" target="_blank">View website ↗</Link>
  </div>
)
