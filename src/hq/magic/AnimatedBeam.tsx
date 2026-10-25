'use client'
// Adapted from Magic UI (MIT) — https://magicui.design/docs/components/animated-beam
import { useEffect, useId, useState, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 0, reverse = false, duration = 4, delay = 0, color = '#5fbdb7', color2 = '#1d5a7e', dim = false }: {
  containerRef: RefObject<HTMLElement | null>; fromRef: RefObject<HTMLElement | null>; toRef: RefObject<HTMLElement | null>
  curvature?: number; reverse?: boolean; duration?: number; delay?: number; color?: string; color2?: string; dim?: boolean
}) {
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduce = useReducedMotion()
  const [d, setD] = useState('')
  const [box, setBox] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const update = () => {
      const c = containerRef.current, a = fromRef.current, b = toRef.current
      if (!c || !a || !b) return
      const cr = c.getBoundingClientRect(), ar = a.getBoundingClientRect(), br = b.getBoundingClientRect()
      setBox({ w: cr.width, h: cr.height })
      const sx = ar.left - cr.left + ar.width / 2, sy = ar.top - cr.top + ar.height / 2
      const ex = br.left - cr.left + br.width / 2, ey = br.top - cr.top + br.height / 2
      setD(`M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`)
    }
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    update()
    return () => ro.disconnect()
  }, [containerRef, fromRef, toRef, curvature])
  const g = reverse ? { x1: ['90%', '-10%'], x2: ['100%', '0%'] } : { x1: ['10%', '110%'], x2: ['0%', '100%'] }
  return (
    <svg className="beam" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} fill="none" aria-hidden="true">
      <path d={d} stroke="#9fb3bf" strokeWidth="2" strokeOpacity={dim ? 0.15 : 0.3} strokeLinecap="round" strokeDasharray={dim ? '4 5' : undefined} />
      {!dim && !reduce && <path d={d} stroke={`url(#${gid})`} strokeWidth="2.5" strokeLinecap="round" />}
      {!dim && !reduce && (
        <defs>
          <motion.linearGradient id={gid} gradientUnits="userSpaceOnUse" initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }} animate={{ x1: g.x1, x2: g.x2, y1: ['0%', '0%'], y2: ['0%', '0%'] }} transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0.6 }}>
            <stop stopColor={color} stopOpacity="0" />
            <stop stopColor={color} />
            <stop offset="32.5%" stopColor={color2} />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      )}
    </svg>
  )
}
