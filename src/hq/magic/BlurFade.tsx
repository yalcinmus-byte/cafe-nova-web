'use client'
// Adapted from Magic UI (MIT) — https://magicui.design/docs/components/blur-fade
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

export function BlurFade({ children, delay = 0, className, as = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'article' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const M = motion[as] as typeof motion.div
  if (reduce) return <M ref={ref} className={className}>{children}</M>
  return (
    <M
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ delay: 0.04 + delay, duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </M>
  )
}
