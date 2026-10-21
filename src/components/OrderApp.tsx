'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { basket, useBasket, type Line } from './basket'

type Slots = {
  live: boolean; paused: boolean; message?: string | null; collection: boolean; delivery: boolean
  payAtCounter: boolean; cardPayments: boolean; deliveryFee: number; deliveryMinimum: number; deliveryAreas: string[]
  slots: { iso: string; label: string; full: boolean }[]
}
const gbp = (n: number) => `£${n.toFixed(2)}`

export function OrderApp({ incoming }: { incoming: Line[] }) {
  const lines = useBasket()
  const [info, setInfo] = useState<Slots | null>(null)
  const [fulfilment, setFulfilment] = useState<'collection' | 'delivery'>('collection')
  const [slot, setSlot] = useState('asap')
  const [pay, setPay] = useState<'counter' | 'online'>('counter')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Baskets built by links or assistants (/order?add=slug:qty) are merged in once.
  useEffect(() => {
    if (!incoming.length) return
    for (const l of incoming) basket.add({ slug: l.slug, name: l.name, price: l.price }, l.qty)
    window.history.replaceState(null, '', '/order')
  }, [incoming])

  useEffect(() => {
    let alive = true
    const load = () => fetch('/api/v1/slots', { cache: 'no-store' }).then((r) => r.json()).then((j: Slots) => {
      if (!alive) return
      setInfo(j)
      if (!j.collection && j.delivery) setFulfilment('delivery')
      setPay(j.cardPayments ? 'online' : 'counter')
    }).catch(() => {})
    load()
    const t = setInterval(load, 60000)
    return () => { alive = false; clearInterval(t) }
  }, [])

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.qty * l.price, 0), [lines])
  const fee = fulfilment === 'delivery' ? info?.deliveryFee ?? 0 : 0
  const total = subtotal + fee
  const underMin = fulfilment === 'delivery' && subtotal < (info?.deliveryMinimum ?? 0)
  const canCounter = fulfilment === 'collection' && !!info?.payAtCounter
  const canCard = !!info?.cardPayments
  const openSlots = info?.slots.filter((s) => !s.full) ?? []

  useEffect(() => { if (fulfilment === 'delivery') setPay(canCard ? 'online' : 'counter') }, [fulfilment, canCard])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const f = new FormData(e.currentTarget)
    setBusy(true)
    const r = await fetch('/api/v1/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })), fulfilment, slot, pay,
        customer: { name: f.get('name'), phone: f.get('phone'), email: f.get('email'), address: f.get('address'), postcode: f.get('postcode') },
        notes: f.get('notes'), website: f.get('website'),
      }),
    }).catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (r?.ok && j.url) { basket.clear(); window.location.href = j.url; return }
    setBusy(false)
    setError(j.error || 'Something went wrong — please try again.')
  }

  if (info && !info.live) {
    return <p className={`notice ${info.paused ? 'notice--paused' : ''}`}>{info.paused ? info.message : 'Online ordering is not open yet. Until then, come in and see us, or use a delivery app below.'}</p>
  }

  return (
    <div className="order-app">
      <section className="order-app__basket" aria-labelledby="basket-title">
        <h2 id="basket-title">Your order</h2>
        {lines.length === 0 ? (
          <div className="order-empty">
            <p>Your basket is empty.</p>
            <Link className="btn btn--river" href="/menu">Choose from the menu</Link>
          </div>
        ) : (
          <>
            <ul className="order-lines">
              {lines.map((l) => (
                <li key={l.slug}>
                  <span className="order-lines__name">{l.name}</span>
                  <span className="qty" role="group" aria-label={`${l.name} quantity`}>
                    <button type="button" onClick={() => basket.setQty(l.slug, l.qty - 1)} aria-label={`Remove one ${l.name}`}>−</button>
                    <span>{l.qty}</span>
                    <button type="button" onClick={() => basket.setQty(l.slug, l.qty + 1)} aria-label={`Add another ${l.name}`}>+</button>
                  </span>
                  <span className="order-lines__price">{gbp(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
            <Link className="order-more" href="/menu">+ Add more from the menu</Link>
            <dl className="order-sum">
              <div><dt>Subtotal</dt><dd>{gbp(subtotal)}</dd></div>
              {fulfilment === 'delivery' && <div><dt>Delivery</dt><dd>{gbp(fee)}</dd></div>}
              <div className="order-sum__total"><dt>Total</dt><dd>{gbp(total)}</dd></div>
            </dl>
          </>
        )}
      </section>

      {lines.length > 0 && (
        <form className="order-app__checkout enquiry" onSubmit={submit}>
          <fieldset className="seg">
            <legend>How would you like it?</legend>
            {info?.collection !== false && <label className={fulfilment === 'collection' ? 'is-on' : ''}><input type="radio" name="f" checked={fulfilment === 'collection'} onChange={() => setFulfilment('collection')} /> Collection<small>424 Richmond Road</small></label>}
            {info?.delivery && <label className={fulfilment === 'delivery' ? 'is-on' : ''}><input type="radio" name="f" checked={fulfilment === 'delivery'} onChange={() => setFulfilment('delivery')} /> Delivery<small>{info.deliveryAreas.join(', ')} · {gbp(info.deliveryFee)}</small></label>}
          </fieldset>

          <label>{fulfilment === 'delivery' ? 'Delivery time' : 'Collection time'}
            <select value={slot} onChange={(e) => setSlot(e.target.value)} required>
              {openSlots.length > 0 && <option value="asap">As soon as possible ({openSlots[0].label})</option>}
              {info?.slots.map((s) => <option key={s.iso} value={s.iso} disabled={s.full}>{s.label}{s.full ? ' — full' : ''}</option>)}
            </select>
            {info && !openSlots.length && <span className="form-error">We’ve stopped taking orders for today.</span>}
          </label>

          <div className="enquiry__row">
            <label>Name<input name="name" required autoComplete="name" maxLength={80} /></label>
            <label>Mobile<input name="phone" type="tel" required autoComplete="tel" maxLength={30} /></label>
          </div>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          {fulfilment === 'delivery' && (
            <>
              <label>Address<textarea name="address" required rows={2} autoComplete="street-address" maxLength={300} /></label>
              <label>Postcode<input name="postcode" required autoComplete="postal-code" maxLength={10} /></label>
            </>
          )}
          <label>Notes and allergies <span className="opt">(optional)</span>
            <textarea name="notes" rows={2} maxLength={600} placeholder="Tell us about any allergy — we’ll check with the kitchen before we cook." />
          </label>
          <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

          <fieldset className="seg">
            <legend>Payment</legend>
            {canCard && <label className={pay === 'online' ? 'is-on' : ''}><input type="radio" name="p" checked={pay === 'online'} onChange={() => setPay('online')} /> Pay now by card<small>Apple Pay & Google Pay</small></label>}
            {canCounter && <label className={pay === 'counter' ? 'is-on' : ''}><input type="radio" name="p" checked={pay === 'counter'} onChange={() => setPay('counter')} /> Pay when you collect<small>Card or cash at the counter</small></label>}
          </fieldset>
          {fulfilment === 'delivery' && !canCard && <p className="form-error">Card payment for delivery is being set up — please choose collection for now.</p>}
          {underMin && <p className="form-error">The minimum for delivery is {gbp(info?.deliveryMinimum ?? 0)}.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn--turq btn--block" disabled={busy || underMin || !openSlots.length || (fulfilment === 'delivery' && !canCard)}>
            {busy ? 'Placing your order…' : pay === 'online' ? `Pay ${gbp(total)}` : `Place order · ${gbp(total)}`}
          </button>
          <p className="small">By ordering you agree that we may contact you about this order. We never share your details.</p>
        </form>
      )}
    </div>
  )
}
