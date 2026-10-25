'use client'
// Adapted from Magic UI (MIT) — https://magicui.design/docs/components/border-beam
import { motion, useReducedMotion } from 'motion/react'

export function BorderBeam({ size = 90, duration = 8, from = '#5fbdb7', to = '#1d5a7e', width = 2 }: { size?: number; duration?: number; from?: string; to?: string; width?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div className="beam-border" style={{ ['--bw' as string]: `${width}px` }} aria-hidden="true">
      <motion.div
        className="beam-border__dot"
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)`, background: `linear-gradient(to left, ${from}, ${to}, transparent)` }}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration }}
      />
    </div>
  )
}
