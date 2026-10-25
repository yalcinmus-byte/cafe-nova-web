import React from 'react'
import { getSample } from '@/hq/sample'
import { PageHead } from '@/hq/ui'
import { AvgDayCard, DailyCard, HeatCard, Ideas, Kpis, MixCard } from '@/hq/sections'

export const metadata = { title: 'Sales' }

export default function Sales() {
  const s = getSample()
  return (
    <>
      <PageHead title="Sales" intro="Takings by day, hour and channel. Quiet days and quiet hours are where growth comes from." />
      <Kpis s={s} />
      <div className="hqd__row hqd__row--2-1"><DailyCard s={s} /><AvgDayCard s={s} /></div>
      <div className="hqd__row hqd__row--2-1"><HeatCard s={s} /><MixCard s={s} /></div>
      <section className="hqd-sec"><div className="hq__sechead"><h2>Ideas to grow sales</h2></div><Ideas s={s} only={['growth', 'social']} /></section>
    </>
  )
}
