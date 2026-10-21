'use client'
import { useEffect, useState } from 'react'

const STEPS = [
  { id: 'new', label: 'Received' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'preparing', label: 'Cooking' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Done' },
]

export function OrderStatus({ refCode, token, initial, payment: initialPayment }: { refCode: string; token: string; initial: string; payment: string }) {
  const [status, setStatus] = useState(initial)
  const [payment, setPayment] = useState(initialPayment)
  useEffect(() => {
    if (status === 'completed' || status === 'cancelled') return
    const t = setInterval(async () => {
      const r = await fetch(`/api/v1/order-status?ref=${refCode}&t=${encodeURIComponent(token)}`, { cache: 'no-store' }).catch(() => null)
      if (r?.ok) { const j = await r.json(); setStatus(j.status); setPayment(j.payment) }
    }, 15000)
    return () => clearInterval(t)
  }, [refCode, token, status])
  if (status === 'cancelled') return <p className="notice notice--paused">This order was cancelled. If that’s unexpected, please call us.</p>
  const at = STEPS.findIndex((s) => s.id === status)
  return (
    <div className="status" aria-live="polite">
      {payment === 'unpaid' && <p className="notice">Waiting for your card payment to confirm…</p>}
      <ol className="status__steps">
        {STEPS.map((s, i) => <li key={s.id} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}><span />{s.label}</li>)}
      </ol>
    </div>
  )
}
