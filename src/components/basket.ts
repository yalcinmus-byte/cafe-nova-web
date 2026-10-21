'use client'
import { useSyncExternalStore } from 'react'

export type Line = { slug: string; name: string; price: number; qty: number }
const KEY = 'nova-basket-v1'
const EMPTY: Line[] = []
let cache: Line[] | null = null
const subs = new Set<() => void>()

function read(): Line[] {
  if (cache) return cache
  try { cache = JSON.parse(localStorage.getItem(KEY) || '[]') } catch { cache = [] }
  if (!Array.isArray(cache)) cache = []
  return cache!
}
function write(lines: Line[]) {
  cache = lines.filter((l) => l.qty > 0).map((l) => ({ ...l, qty: Math.min(20, l.qty) }))
  try { localStorage.setItem(KEY, JSON.stringify(cache)) } catch { /* private mode: keep in memory */ }
  subs.forEach((f) => f())
}
function subscribe(f: () => void) {
  subs.add(f)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; f() } }
  window.addEventListener('storage', onStorage)
  return () => { subs.delete(f); window.removeEventListener('storage', onStorage) }
}

export const basket = {
  add(item: Omit<Line, 'qty'>, qty = 1) {
    const lines = [...read()]
    const i = lines.findIndex((l) => l.slug === item.slug)
    if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + qty }
    else lines.push({ ...item, qty })
    write(lines)
  },
  setQty(slug: string, qty: number) { write(read().map((l) => (l.slug === slug ? { ...l, qty } : l))) },
  replace(lines: Line[]) { write(lines) },
  clear() { write([]) },
}

export function useBasket(): Line[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}
export function useBasketCount(): number {
  return useBasket().reduce((s, l) => s + l.qty, 0)
}
