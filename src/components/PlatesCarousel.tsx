'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { AddToBasket } from './AddToBasket'

export type Plate = { id: string | number; slug: string; name: string; localName?: string | null; description?: string | null; price?: number | null; photo: string; alt: string }

const gbp = (n?: number | null) => (n == null ? '' : `£${n.toFixed(2)}`)

/** Vertical scroll drives a horizontal track (sticky). Falls back to a swipeable row on small screens and reduced motion. */
export function PlatesCarousel({ plates, orderLive, head }: { plates: Plate[]; orderLive: boolean; head?: { eyebrow?: string | null; title?: string | null; text?: string | null } }) {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const o = outer.current, t = track.current
    if (!o || !t) return
    const mq = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)')
    let raf = 0, cur = 0, target = 0
    const size = () => {
      if (!mq.matches) { o.style.height = ''; t.style.transform = ''; return }
      const dist = t.scrollWidth - window.innerWidth + 96
      o.style.height = `${window.innerHeight + Math.max(dist, 0)}px`
    }
    const onScroll = () => {
      if (!mq.matches) return
      const r = o.getBoundingClientRect()
      const span = o.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / Math.max(span, 1)))
      target = p * Math.max(t.scrollWidth - window.innerWidth + 96, 0)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const tick = () => {
      cur += (target - cur) * 0.14
      t.style.transform = `translate3d(${-cur}px,0,0)`
      o.style.setProperty('--p', String(cur / Math.max(t.scrollWidth - window.innerWidth + 96, 1)))
      raf = Math.abs(target - cur) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    // Keyboard: bring the focused card into view by scrolling the page, not the track
    const onFocus = (e: FocusEvent) => {
      if (!mq.matches) return
      const card = (e.target as HTMLElement).closest('li') as HTMLElement | null
      if (!card) return
      const max = Math.max(t.scrollWidth - window.innerWidth + 96, 1)
      const x = Math.min(max, Math.max(0, card.offsetLeft - 48))
      const span = o.offsetHeight - window.innerHeight
      const top = o.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top + (x / max) * span, behavior: 'auto' })
      cur = target = x; t.style.transform = `translate3d(${-x}px,0,0)`
      ;(o.querySelector('.plates__sticky') as HTMLElement).scrollLeft = 0
    }
    t.addEventListener('focusin', onFocus)
    size(); onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', size); mq.addEventListener('change', size)
    return () => { t.removeEventListener('focusin', onFocus); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', size); mq.removeEventListener('change', size); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section className="plates" aria-labelledby="plates-title">
      <div className="plates__outer" ref={outer}>
        <div className="plates__sticky">
          <div className="plates__head wrap">
            {head?.eyebrow && <p className="eyebrow">{head.eyebrow}</p>}
            <h2 id="plates-title">{head?.title ?? 'Popular plates'}</h2>
            {head?.text && <p>{head.text}</p>}
          </div>
          <ol className="plates__track" ref={track}>
            {plates.map((d, i) => (
              <li key={d.id} className="plate">
                <Link href={`/menu#${d.slug}`} className="plate__link">
                  <span className="plate__img"><img src={d.photo} alt={d.alt} loading={i < 3 ? 'eager' : 'lazy'} /></span>
                  <span className="plate__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="plate__body">
                    <span className="plate__name">{d.name}</span>
                    {d.localName && <span className="plate__local">{d.localName}</span>}
                    <span className="plate__desc">{d.description}</span>
                  </span>
                </Link>
                <span className="plate__foot">
                  <span className="plate__price">{gbp(d.price)}</span>
                  {orderLive && d.price != null && <AddToBasket slug={d.slug} name={d.name} price={d.price} />}
                </span>
              </li>
            ))}
            <li className="plate plate--end">
              <Link href="/menu" className="plate__more"><span>See the full menu</span><span aria-hidden="true">→</span></Link>
            </li>
          </ol>
          <div className="plates__progress" aria-hidden="true"><span /></div>
        </div>
      </div>
    </section>
  )
}
