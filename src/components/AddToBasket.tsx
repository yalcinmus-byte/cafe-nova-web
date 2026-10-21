'use client'
import { useState } from 'react'
import { basket, useBasket } from './basket'

export function AddToBasket({ slug, name, price, compact = false }: { slug: string; name: string; price: number; compact?: boolean }) {
  const lines = useBasket()
  const qty = lines.find((l) => l.slug === slug)?.qty ?? 0
  const [flash, setFlash] = useState(false)
  if (qty > 0) {
    return (
      <span className={`qty ${compact ? 'qty--compact' : ''}`} role="group" aria-label={`${name} in basket`}>
        <button type="button" onClick={() => basket.setQty(slug, qty - 1)} aria-label={`Remove one ${name}`}>−</button>
        <span aria-live="polite">{qty}</span>
        <button type="button" onClick={() => basket.add({ slug, name, price })} aria-label={`Add another ${name}`}>+</button>
      </span>
    )
  }
  return (
    <button
      type="button"
      className={`add ${flash ? 'is-flash' : ''} ${compact ? 'add--compact' : ''}`}
      onClick={() => { basket.add({ slug, name, price }); setFlash(true); setTimeout(() => setFlash(false), 600) }}
      aria-label={`Add ${name} to your order`}
    >
      Add
    </button>
  )
}

export function BasketBar() {
  const lines = useBasket()
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)
  if (!count) return null
  return (
    <a className="basket-bar" href="/order">
      <span>{count} item{count > 1 ? 's' : ''} · £{total.toFixed(2)}</span>
      <span>View order →</span>
    </a>
  )
}
