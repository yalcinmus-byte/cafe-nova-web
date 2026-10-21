'use client'
import { useEffect, useMemo, useState } from 'react'

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Pick an evening: booked dates are crossed out; choosing a date fills the booking form below. */
export function BookingCalendar() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [booked, setBooked] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => { fetch('/api/v1/hire-availability', { cache: 'no-store' }).then((r) => r.json()).then((j) => setBooked(j.booked ?? [])).catch(() => {}) }, [])

  const days = useMemo(() => {
    const first = new Date(month)
    const lead = (first.getDay() + 6) % 7
    const n = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  }, [month])

  const pick = (d: Date) => {
    const v = iso(d)
    setPicked(v)
    const input = document.getElementById('enq-date') as HTMLInputElement | null
    if (input) {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, v)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => (document.querySelector('.enquiry input[name="occasion"]') as HTMLInputElement | null)?.focus({ preventScroll: true }), 500)
    }
  }
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 11, 1)

  return (
    <div className="cal" aria-label="Choose a date">
      <div className="cal__head">
        <h3>{month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
        <div className="cal__nav">
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} disabled={!canPrev} aria-label="Previous month">‹</button>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} disabled={month >= maxMonth} aria-label="Next month">›</button>
        </div>
      </div>
      <div className="cal__grid" role="grid">
        {DOW.map((d) => <div key={d} className="cal__dow" role="columnheader">{d}</div>)}
        {days.map((d, i) => {
          if (!d) return <span key={`x${i}`} />
          const v = iso(d)
          const past = d < today
          const isBooked = booked.includes(v)
          return (
            <button key={v} type="button" role="gridcell" className={`cal__day ${isBooked ? 'is-booked' : ''} ${picked === v ? 'is-picked' : ''}`} disabled={past || isBooked} aria-pressed={picked === v}
              aria-label={`${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${isBooked ? ', already booked' : ''}`} onClick={() => pick(d)}>
              {d.getDate()}
            </button>
          )
        })}
      </div>
      <p className="cal__legend"><span>Available evening</span><span className="b">Booked</span><span className="p">Your choice</span></p>
    </div>
  )
}
