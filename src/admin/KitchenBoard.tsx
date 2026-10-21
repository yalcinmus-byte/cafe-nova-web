'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Item = { name: string; qty: number; unitPrice: number }
type Order = {
  id: number | string; ref: string; status: string; fulfilment: 'collection' | 'delivery'; slot?: string; createdAt: string
  items: Item[]; total: number; payment: string; notes?: string; customer: { name: string; phone: string; postcode?: string; address?: string }
}

const NEXT: Record<string, { to: string; label: string }> = {
  new: { to: 'accepted', label: 'Accept' },
  accepted: { to: 'preparing', label: 'Start cooking' },
  preparing: { to: 'ready', label: 'Ready' },
  ready: { to: 'completed', label: 'Handed over' },
}
const COLS = [
  { id: 'new', title: 'New' },
  { id: 'accepted', title: 'Accepted' },
  { id: 'preparing', title: 'Cooking' },
  { id: 'ready', title: 'Ready / out' },
]
const time = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) : '—')

export function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [updated, setUpdated] = useState<Date | null>(null)
  const [sound, setSound] = useState(false)
  const seen = useRef<Set<string>>(new Set())

  const load = useCallback(async () => {
    const since = new Date(Date.now() - 18 * 3600e3).toISOString()
    const q = `where[and][0][status][in]=new,accepted,preparing,ready&where[and][1][createdAt][greater_than]=${since}&where[and][2][payment][not_equals]=unpaid&sort=slot&limit=100&depth=0`
    const r = await fetch(`/api/orders?${q}`, { credentials: 'include', cache: 'no-store' }).catch(() => null)
    if (!r?.ok) return
    const j = (await r.json()) as { docs: Order[] }
    const fresh = j.docs.filter((o) => o.status === 'new' && !seen.current.has(o.ref))
    if (fresh.length && seen.current.size && sound) {
      try { const a = new AudioContext(); const o = a.createOscillator(); o.frequency.value = 880; o.connect(a.destination); o.start(); o.stop(a.currentTime + 0.25) } catch { /* no audio */ }
    }
    j.docs.forEach((o) => seen.current.add(o.ref))
    setOrders(j.docs)
    setUpdated(new Date())
  }, [sound])

  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t) }, [load])

  const move = async (o: Order, to: string) => {
    setOrders((all) => all.map((x) => (x.id === o.id ? { ...x, status: to } : x)).filter((x) => x.status !== 'completed' && x.status !== 'cancelled'))
    await fetch(`/api/orders/${o.id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: to }) })
    load()
  }

  return (
    <div className="kitchen-board">
      <header className="kitchen-board__head">
        <div>
          <h1>Kitchen</h1>
          <p>{orders.length} open order{orders.length === 1 ? '' : 's'} · updated {updated ? time(updated.toISOString()) : '…'} · refreshes every 10 seconds</p>
        </div>
        <label className="kitchen-board__sound"><input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} /> Beep for new orders</label>
      </header>
      <div className="kitchen-board__cols">
        {COLS.map((c) => {
          const list = orders.filter((o) => o.status === c.id)
          return (
            <section key={c.id} className={`kcol kcol--${c.id}`}>
              <h2>{c.title} <span>{list.length}</span></h2>
              {list.map((o) => (
                <article key={o.id} className="kticket">
                  <header>
                    <b>{o.ref}</b>
                    <span className={`kticket__mode kticket__mode--${o.fulfilment}`}>{o.fulfilment === 'delivery' ? 'Delivery' : 'Collect'} {time(o.slot)}</span>
                  </header>
                  <ul>{o.items.map((i, n) => <li key={n}><b>{i.qty}×</b> {i.name}</li>)}</ul>
                  {o.notes && <p className="kticket__notes">⚠ {o.notes}</p>}
                  <p className="kticket__who">{o.customer.name} · <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a>{o.fulfilment === 'delivery' && <><br />{o.customer.address} {o.customer.postcode}</>}</p>
                  <p className="kticket__pay">{o.payment === 'paid' ? 'Paid online' : 'Pay at counter'} · £{o.total.toFixed(2)}</p>
                  <div className="kticket__actions">
                    {NEXT[o.status] && <button type="button" className="nova-btn" onClick={() => move(o, NEXT[o.status].to)}>{NEXT[o.status].label}</button>}
                    {o.status === 'new' && <button type="button" className="nova-btn nova-btn--ghost" onClick={() => confirm(`Cancel ${o.ref}?`) && move(o, 'cancelled')}>Decline</button>}
                  </div>
                </article>
              ))}
              {!list.length && <p className="kcol__empty">Nothing here</p>}
            </section>
          )
        })}
      </div>
    </div>
  )
}
