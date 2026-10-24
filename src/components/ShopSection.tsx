'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AddToBasket } from './AddToBasket'
import { openCart, setFulfilment, useBasket, type Fulfilment } from './basket'
import { BrandIcon, VENDOR_ICON } from './BrandIcon'
import { BADGES, Badges } from './Icons'

export type ShopItem = { slug: string; name: string; localName?: string | null; description?: string | null; price: number; photo?: string | null; group: string; category: string; diet?: string[]; badges?: string[] }
type Vendor = { id?: string | null; name: string; url?: string | null }
type Opts = { live: boolean; paused: boolean; collection: boolean; delivery: boolean; cardPayments: boolean; payAtCounter: boolean; vendors: Vendor[]; deliveryFee: number; deliveryAreas: string[] }

const GROUPS: Record<string, string> = { breakfast: 'Breakfast', turkish: 'Turkish', lunch: 'Lunch', sweet: 'Sweet', drinks: 'Coffee & drinks', kids: 'Kids', shop: 'Coffee to take home' }
const gbp = (n: number) => `£${n.toFixed(2)}`

export function ShopSection({ items, opts, head }: { items: ShopItem[]; opts: Opts; head?: { eyebrow?: string | null; title?: string | null; text?: string | null } }) {
  const [tab, setTab] = useState('all')
  const [mode, setMode] = useState<Fulfilment>('collection')
  const lines = useBasket()
  const groups = useMemo(() => [...new Set(items.map((i) => i.group))], [items])
  const shown = tab === 'all' ? items : items.filter((i) => i.group === tab)
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const canOrder = opts.live && (opts.collection || opts.delivery)
  const choose = (f: Fulfilment) => { setMode(f); setFulfilment(f) }

  return (
    <section className="shop" id="order" aria-labelledby="shop-title">
      <div className="wrap">
        <div className="shop__head">
          <div>
            {head?.eyebrow && <p className="eyebrow">{head.eyebrow}</p>}
            <h2 id="shop-title">{head?.title ?? 'Order your favourites'}</h2>
            {head?.text && <p>{head.text}</p>}
          </div>
          <Link className="btn btn--outline" href="/menu">Full menu</Link>
        </div>

        <div className="shop__ways" role="list" aria-label="Ways to order">
          <button type="button" role="listitem" className={`way ${mode === 'collection' ? 'is-on' : ''}`} disabled={!opts.live || !opts.collection} onClick={() => choose('collection')}>
            <BrandIcon name="bag" size={26} color="currentColor" />
            <span><b>Pick up in the café</b><small>{opts.live && opts.collection ? 'Ready when you arrive · pay at the counter' : 'Currently unavailable'}</small></span>
          </button>
          <button type="button" role="listitem" className={`way ${mode === 'delivery' ? 'is-on' : ''}`} disabled={!opts.live || !opts.delivery} onClick={() => choose('delivery')}>
            <BrandIcon name="pin" size={26} color="currentColor" />
            <span><b>Nova delivery</b><small>{opts.live && opts.delivery ? `${opts.deliveryAreas.join(', ')} · ${gbp(opts.deliveryFee)}` : 'Coming soon'}</small></span>
          </button>
          {opts.vendors.map((v) => {
            const inner = (
              <>
                <BrandIcon name={VENDOR_ICON[v.name] ?? 'bag'} size={26} />
                <span><b>{v.name}</b><small>{v.url ? 'Order on the app →' : 'Coming soon'}</small></span>
              </>
            )
            return v.url
              ? <a key={v.id ?? v.name} role="listitem" className={`way way--vendor way--${VENDOR_ICON[v.name]}`} href={v.url} rel="noopener" target="_blank">{inner}</a>
              : <div key={v.id ?? v.name} role="listitem" className={`way way--vendor way--${VENDOR_ICON[v.name]} is-soon`}>{inner}</div>
          })}
        </div>

        <div className="shop__body">
          <div>
            <div className="chips" role="tablist" aria-label="Filter dishes">
              {['all', ...groups].map((g) => (
                <button key={g} type="button" role="tab" aria-selected={tab === g} className={tab === g ? 'is-on' : ''} onClick={() => setTab(g)}>{g === 'all' ? 'All' : GROUPS[g] ?? g}</button>
              ))}
            </div>
            <ul className="products-grid">
              {shown.map((i) => (
                <li key={i.slug} className="product">
                  <div className={`product__img ${i.photo ? '' : 'product__img--ph'}`} data-group={i.group}>
                    {i.photo ? <img src={i.photo} alt={i.name} loading="lazy" /> : <span className="product__ph" aria-hidden="true">{i.name.replace(/^Alchemy Coffee — /, '').charAt(0)}</span>}
                    {i.badges?.[0] && BADGES[i.badges[0]] && <span className={`product__flag badge-pill badge-pill--${BADGES[i.badges[0]].tone}`}>{BADGES[i.badges[0]].label}</span>}
                  </div>
                  <div className="product__body">
                    <p className="product__cat">{i.category}</p>
                    <h3>{i.name}</h3>
                    {i.localName && <p className="product__local">{i.localName}</p>}
                    {i.description && <p className="product__desc">{i.description}</p>}
                    <Badges badges={i.badges?.slice(1)} diet={i.diet} max={2} />
                  </div>
                  <div className="product__foot">
                    <span className="product__price">{gbp(i.price)}</span>
                    {canOrder ? <AddToBasket slug={i.slug} name={i.name} price={i.price} /> : <span className="product__off">Order in the café</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
