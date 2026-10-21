'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NovaLogo } from './NovaLogo'
import { useBasketCount } from './basket'

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/events', label: 'Events' },
  { href: '/private-hire', label: 'Private hire' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
  { href: '/careers', label: 'Careers' },
  { href: '/visit', label: 'Visit' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const path = usePathname()
  const [onFilm, setOnFilm] = useState(overlay)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const count = useBasketCount()

  useEffect(() => {
    const read = () => {
      setScrolled(window.scrollY > 8)
      if (!overlay) return
      const film = document.querySelector('.film') as HTMLElement | null
      const end = film ? film.offsetTop + film.offsetHeight - window.innerHeight * 0.6 : 0
      setOnFilm(window.scrollY < end)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => { window.removeEventListener('scroll', read); window.removeEventListener('resize', read) }
  }, [overlay])

  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const active = (href: string) => path === href || path.startsWith(href + '/')
  const light = onFilm && !open

  return (
    <header className={`site-header ${light ? 'site-header--film' : 'site-header--solid'} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <Link href="/" className="site-header__home" aria-current={path === '/' ? 'page' : undefined}>
        <NovaLogo className={light ? 'nova-lockup--light' : ''} />
      </Link>
      <nav aria-label="Main" id="site-nav" className="site-nav">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={active(n.href) ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <div className="site-header__actions">
        <Link href="/order" className="site-header__order" aria-current={active('/order') ? 'page' : undefined}>
          Order{count > 0 && <span className="site-header__count" aria-label={`${count} in your basket`}>{count}</span>}
        </Link>
        <button type="button" className="site-header__burger" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
