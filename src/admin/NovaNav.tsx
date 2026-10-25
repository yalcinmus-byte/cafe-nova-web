'use client'
import React from 'react'
import { Link, NavGroup } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

type Item = { label: string; href: string; external?: boolean; accent?: boolean }
type Group = { label: string; items: Item[] }

const c = (slug: string) => `/admin/collections/${slug}`
const g = (slug: string) => `/admin/globals/${slug}`

/** The CMS menu, in the order the café works: today → guests → menu → website → Nova HQ → settings. */
const GROUPS: Group[] = [
  { label: 'Today', items: [
    { label: 'Orders', href: c('orders') },
    { label: 'Kitchen screen', href: '/admin/kitchen' },
    { label: 'Service control', href: g('service-control') },
  ] },
  { label: 'Guests', items: [
    { label: 'Event bookings calendar', href: '/admin/bookings' },
    { label: 'Enquiries', href: c('enquiries') },
    { label: 'Guest reviews', href: c('reviews') },
  ] },
  { label: 'Menu', items: [
    { label: 'Dishes', href: c('menu-items') },
    { label: 'Menu sections', href: c('menu-categories') },
    { label: 'Seasonal themes', href: c('themes') },
  ] },
  { label: 'Website', items: [
    { label: 'Homepage', href: g('homepage') },
    { label: 'Page text', href: g('pages') },
    { label: 'Festive & events', href: c('events') },
    { label: 'Journal', href: c('posts') },
    { label: 'Careers', href: c('jobs') },
    { label: 'Suppliers & partners', href: c('partners') },
    { label: 'Photos', href: c('media') },
  ] },
  { label: 'Nova HQ', items: [
    { label: '✦ Open Nova HQ', href: '/hq', external: true, accent: true },
    { label: 'Suppliers', href: c('suppliers') },
    { label: 'Purchases & invoices', href: c('purchases') },
    { label: 'Expenses', href: c('expenses') },
    { label: 'Files & data uploads', href: c('documents') },
  ] },
  { label: 'Settings', items: [
    { label: 'Café details', href: g('site-settings') },
    { label: 'Team & logins', href: c('users') },
  ] },
]

function NavLink({ item, path }: { item: Item; path: string }) {
  const active = !item.external && (path === item.href || path.startsWith(item.href + '/'))
  const inner = (
    <>
      {active && <div className="nav__link-indicator" />}
      <span className={`nav__link-label ${item.accent ? 'nova-nav__accent' : ''}`}>{item.label}</span>
    </>
  )
  if (item.external) return <a className="nav__link" href={item.href}>{inner}</a>
  if (path === item.href) return <div className="nav__link">{inner}</div>
  return <Link className="nav__link" href={item.href} prefetch={false}>{inner}</Link>
}

export function NovaNav() {
  const path = usePathname() ?? ''
  const home = path === '/admin' || path === '/admin/'
  return (
    <div className="nova-nav">
      <div className="nova-nav__top">
        {home ? (
          <div className="nav__link nova-nav__home"><div className="nav__link-indicator" /><span className="nav__link-label">Dashboard</span></div>
        ) : (
          <Link className="nav__link nova-nav__home" href="/admin" prefetch={false}><span className="nav__link-label">Dashboard</span></Link>
        )}
      </div>
      {GROUPS.map((grp) => (
        <NavGroup key={grp.label} label={grp.label} isOpen>
          {grp.items.map((it) => <NavLink key={it.href} item={it} path={path} />)}
        </NavGroup>
      ))}
      <div className="nova-nav__foot">
        <a className="nav__link" href="/" target="_blank" rel="noreferrer"><span className="nav__link-label">View website ↗</span></a>
      </div>
    </div>
  )
}
