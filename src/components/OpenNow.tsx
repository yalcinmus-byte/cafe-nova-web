'use client'
import { useEffect, useState } from 'react'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const toMin = (t: string) => { const m = t.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/); if (!m) return null; let h = Number(m[1]) % 12; if (m[3] === 'pm') h += 12; if (!m[3] && Number(m[1]) === 12) h = 12; return h * 60 + Number(m[2] ?? 0) }
const covers = (label: string, day: number) => {
  const l = label.toLowerCase()
  if (l.includes('every day') || l.includes('daily')) return true
  const range = l.match(/(\w+)\s*[–-]\s*(\w+)/)
  if (range) { const a = DAYS.findIndex((d) => d.startsWith(range[1].slice(0, 3))); const b = DAYS.findIndex((d) => d.startsWith(range[2].slice(0, 3))); if (a >= 0 && b >= 0) return a <= b ? day >= a && day <= b : day >= a || day <= b }
  return DAYS.some((d, i) => i === day && l.includes(d.slice(0, 3)))
}

/** "Open now · until 5pm" from the opening hours in the CMS (London time). */
export function OpenNow({ hours }: { hours: { days: string; time: string }[] }) {
  const [text, setText] = useState<{ open: boolean; label: string } | null>(null)
  useEffect(() => {
    const calc = () => {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }))
      const day = now.getDay(); const mins = now.getHours() * 60 + now.getMinutes()
      const today = hours.find((h) => covers(h.days, day))
      const [o, c] = (today?.time ?? '').split(/[–-]/).map((x) => toMin(x))
      if (today && o != null && c != null && mins >= o && mins < c) setText({ open: true, label: `Open now · until ${today.time.split(/[–-]/)[1].trim()}` })
      else if (today && o != null && mins < o) setText({ open: false, label: `Closed · opens ${today.time.split(/[–-]/)[0].trim()}` })
      else {
        const tmr = hours.find((h) => covers(h.days, (day + 1) % 7))
        setText({ open: false, label: tmr ? `Closed · opens ${tmr.time.split(/[–-]/)[0].trim()} tomorrow` : 'Closed now' })
      }
    }
    calc(); const t = setInterval(calc, 60000); return () => clearInterval(t)
  }, [hours])
  if (!text) return null
  return <span className={`open-now ${text.open ? 'is-open' : ''}`}><i aria-hidden="true" />{text.label}</span>
}
