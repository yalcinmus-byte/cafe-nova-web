'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { basket, useBasket } from './basket'

/** Slide-out basket available on every page; opens from the header and after adding a dish. */
export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const lines = useBasket()
  const path = usePathname()
  const panel = useRef<HTMLDivElement>(null)
  const total = lines.reduce((s, l) => s + l.qty * l.price, 0)

  useEffect(() => {
    const o = () => setOpen(true)
    let t: ReturnType<typeof setTimeout>
    const added = (e: Event) => { setToast((e as CustomEvent).detail?.name ?? 'Added'); clearTimeout(t); t = setTimeout(() => setToast(null), 2600) }
    window.addEventListener('nova:open-cart', o)
    window.addEventListener('nova:added', added)
    return () => { window.removeEventListener('nova:open-cart', o); window.removeEventListener('nova:added', added) }
  }, [])
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    if (!open) return
    panel.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <>
      {toast && !open && (
        <div className="cart-toast" role="status">
          <span>Added <b>{toast}</b></span>
          <button type="button" onClick={() => setOpen(true)}>View basket</button>
        </div>
      )}
      <div className={`cart-scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={panel} className={`cart-drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Your basket" tabIndex={-1} hidden={!open}>
        <header>
          <h2>Your basket</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close basket">×</button>
        </header>
        {lines.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Your basket is empty.</p>
            <Link className="btn btn--river" href="/#order" onClick={() => setOpen(false)}>Browse dishes</Link>
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
                  <span className="order-lines__price">£{(l.qty * l.price).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <footer>
              <p className="cart-drawer__total"><span>Subtotal</span><b>£{total.toFixed(2)}</b></p>
              <Link className="btn btn--turq btn--block" href="/order">Checkout</Link>
              <Link className="cart-drawer__more" href="/menu">Add more from the menu</Link>
            </footer>
          </>
        )}
      </div>
    </>
  )
}
