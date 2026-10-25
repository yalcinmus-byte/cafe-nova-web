import React from 'react'
import { getSample } from '@/hq/sample'
import { PageHead } from '@/hq/ui'
import { Ideas, MenuCards } from '@/hq/sections'

export const metadata = { title: 'Menu & margins' }

export default function Menu() {
  const s = getSample()
  return (
    <>
      <PageHead title="Menu & margins" intro="Every dish by how often it sells and how much it earns per plate, after VAT and ingredients." />
      <div className="hqd__row hqd__row--1-1"><MenuCards s={s} /></div>
      <section className="hqd-sec"><div className="hq__sechead"><h2>Selin suggests</h2></div><Ideas s={s} only={['menu']} /></section>
    </>
  )
}
