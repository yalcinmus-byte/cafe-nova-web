'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const DURATION = 34.5
const CHAPTERS = [
  { id: 'kitchen', label: 'Kitchen', at: 0 },
  { id: 'beans', label: 'Beans', at: 8.4 },
  { id: 'espresso', label: 'Espresso', at: 15 },
  { id: 'latte', label: 'Latte', at: 20 },
  { id: 'river', label: 'River', at: 25 },
]
type Line = { from: number; to: number; title: string; body?: string; cta?: boolean; center?: boolean }
const LINES: Line[] = [
  { from: 2.6, to: 8.0, title: 'Sourdough, smashed avocado and two poached eggs.', body: 'Cooked to order in our kitchen, every morning from eight.' },
  { from: 8.4, to: 14.8, title: 'Coffee from Alchemy.', body: 'Speciality beans, roasted by hand in London.', center: true },
  { from: 15.4, to: 19.8, title: 'Pulled for you, not before.' },
  { from: 20.6, to: 24.6, title: 'A little milk. A little patience.', body: 'Organic milk from Waitrose, steamed for every cup.' },
  { from: 26, to: 30.6, title: 'Breakfast first. Then the river.' },
  { from: 31, to: 34.6, title: 'A short walk from Richmond Bridge.', cta: true },
]

type Caption = { from: number; to: number; title: string; body?: string | null; cta?: boolean | null; center?: boolean | null }

export function HeroFilm({ orderLive, title, text, captions }: { orderLive: boolean; title?: string | null; text?: string | null; captions?: Caption[] | null }) {
  const lines: Line[] = captions && captions.length ? captions.map((c) => ({ from: c.from, to: c.to, title: c.title, body: c.body ?? undefined, cta: !!c.cta, center: !!c.center })) : LINES
  const section = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [t, setT] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const v = video.current
    const s = section.current
    if (!v || !s || mq.matches) return
    const size = window.innerWidth < 760 ? '960' : '1280'
    const webm = v.canPlayType('video/webm; codecs="vp9"') !== ''
    v.src = `/film/hero-${size}.${webm ? 'webm' : 'mp4'}`
    v.onerror = () => { if (v.src.endsWith('.webm')) { v.src = `/film/hero-${size}.mp4`; v.load() } }
    v.load()
    let target = 0
    let current = 0
    let raf = 0
    const read = () => {
      const r = s.getBoundingClientRect()
      const span = s.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / span))
      target = p * (DURATION - 0.05)
    }
    const loop = () => {
      current += (target - current) * 0.12
      if (Math.abs(target - current) < 0.002) current = target
      if (v.readyState >= 2 && Math.abs(v.currentTime - current) > 0.016) v.currentTime = current
      setT(current)
      document.documentElement.style.setProperty('--film-p', String(current / DURATION))
      raf = requestAnimationFrame(loop)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  const goTo = (at: number) => {
    const s = section.current
    if (!s) return
    const span = s.offsetHeight - window.innerHeight
    window.scrollTo({ top: s.offsetTop + (at / DURATION) * span + 2, behavior: 'smooth' })
  }

  const chapter = CHAPTERS.reduce((acc, c, i) => (t >= c.at - 0.2 ? i : acc), 0)
  const fade = (l: Line) => {
    const inT = Math.min(1, (t - l.from) / 0.7)
    const outT = Math.min(1, (l.to - t) / 0.7)
    return Math.max(0, Math.min(inT, outT))
  }
  const heroOut = Math.max(0, Math.min(1, 1 - (t - 1.2) / 1.6))

  if (reduced) {
    return (
      <section className="film film--static" aria-label="Good morning at Cafe Nova">
        <img src="/film/hero-poster.webp" alt="Toasted sourdough, avocado and two poached eggs floating above a blue plate in a sunlit kitchen" />
        <HeroCopy orderLive={orderLive} title={title} text={text} />
        <ol className="film__static-lines">
          {lines.map((l) => <li key={l.title}><b>{l.title}</b> {l.body}</li>)}
        </ol>
      </section>
    )
  }

  return (
    <section ref={section} className="film" aria-label="Good morning at Cafe Nova — a scroll-controlled film">
      <div className="film__stage">
        <video ref={video} className="film__video" poster="/film/hero-poster.webp" muted playsInline preload="auto" aria-hidden="true" />
        <div className="film__shade" />
        <div className="film__hero" style={{ opacity: heroOut, transform: `translateY(${(1 - heroOut) * -24}px)`, pointerEvents: heroOut > 0.3 ? 'auto' : 'none' }}>
          <HeroCopy orderLive={orderLive} title={title} text={text} />
        </div>
        {lines.map((l) => {
          const o = fade(l)
          return (
            <div key={l.title} className={`film__line ${l.center ? 'film__line--center' : ''}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 28}px)`, filter: o < 1 ? `blur(${(1 - o) * 6}px)` : undefined, pointerEvents: o > 0.5 ? 'auto' : 'none' }} aria-hidden={o < 0.5}>
              <p className="film__line-title">{l.title}</p>
              {l.body && <p className="film__line-body">{l.body}</p>}
              {l.cta && (
                <div className="film__ctas">
                  <Link className="btn btn--light" href="/visit">Plan your visit</Link>
                  <Link className="btn btn--ghost-light" href="/menu">See the menu</Link>
                </div>
              )}
            </div>
          )
        })}
        <nav className="film__chapters" aria-label="Film chapters">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} type="button" className={i === chapter ? 'is-active' : ''} onClick={() => goTo(c.at + 0.5)}>
              <span className="film__dot" />
              <span className="film__chapter-label">{c.label}</span>
            </button>
          ))}
        </nav>
        <div className="film__hint" style={{ opacity: heroOut }} aria-hidden="true">Scroll for breakfast</div>
      </div>
    </section>
  )
}

function HeroCopy({ orderLive, title, text }: { orderLive: boolean; title?: string | null; text?: string | null }) {
  return (
    <div className="hero-copy">
      <h1>{title || 'Good morning, Richmond.'}</h1>
      <p>{text || 'British and Turkish breakfasts, proper lunches and Alchemy coffee — cooked fresh in East Twickenham, by Richmond Bridge.'}</p>
      <div className="hero-copy__ctas">
        <Link className="btn btn--light" href="/menu">See the menu</Link>
        <Link className="btn btn--ghost-light" href={orderLive ? '/#order' : '/visit'}>{orderLive ? 'Order online' : 'Find us'}</Link>
      </div>
    </div>
  )
}
