'use client'
import { useEffect, useRef } from 'react'

/** The Food Standards Agency's own badge script — it always shows the current official rating. */
export function FsaBadge({ id = '1768280', style = '3' }: { id?: string; style?: '1' | '2' | '3' }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current
    if (!el || el.dataset.loaded) return
    el.dataset.loaded = '1'
    const s = document.createElement('script')
    s.src = 'https://ratings.food.gov.uk/embed/embed-badge.js'
    s.async = true
    s.dataset.businessId = id
    s.dataset.ratingStyle = style
    s.dataset.welsh = 'null'
    el.appendChild(s)
  }, [id, style])
  return <div ref={box} className="fsa-badge" aria-label="Food hygiene rating from the Food Standards Agency" />
}
