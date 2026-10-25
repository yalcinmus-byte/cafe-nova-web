'use client'
// Adapted from Magic UI (MIT) — https://magicui.design/docs/components/number-ticker
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

export function NumberTicker({ value, decimals = 0, prefix = '', suffix = '', delay = 0 }: { value: number; decimals?: number; prefix?: string; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const mv = useMotionValue(reduce ? value : 0)
  const spring = useSpring(mv, { damping: 60, stiffness: 100 })
  const inView = useInView(ref, { once: true })
  const fmt = (n: number) => `${prefix}${n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => mv.set(value), delay * 1000)
    return () => clearTimeout(t)
  }, [inView, value, delay, mv])
  useEffect(() => spring.on('change', (v) => { if (ref.current) ref.current.textContent = fmt(Math.abs(v - value) < Math.max(10 ** -decimals, Math.abs(value) * 0.003) ? value : Number(v.toFixed(decimals))) }), [spring, value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="tick">{fmt(reduce ? value : 0)}</span>
}
