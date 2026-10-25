import React from 'react'
import Link from 'next/link'
import { getSample } from '@/hq/sample'
import { PageHead } from '@/hq/ui'
import { AvgDayCard, DailyCard, Health, Ideas, Kpis, MixCard, PoundCard, TeamGrid, Urgent } from '@/hq/sections'

export const metadata = { title: 'Overview' }

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date()))
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Overview() {
  const s = getSample()
  return (
    <>
      <PageHead title={`${greeting()}.`} intro={`How Cafe Nova is doing over the last 28 days (${s.period.label}), what needs you today, and what your AI team suggests next.`} />
      <div className="hqd__row hqd__row--health"><Health s={s} /><Urgent s={s} /></div>
      <Kpis s={s} />
      <div className="hqd__row hqd__row--2-1"><DailyCard s={s} table={false} /><AvgDayCard s={s} /></div>
      <div className="hqd__row hqd__row--1-1"><MixCard s={s} /><PoundCard s={s} /></div>
      <section className="hqd-sec">
        <div className="hq__sechead"><h2>Top suggestions</h2><Link href="/hq/agents" className="hqp-more">All from your AI team →</Link></div>
        <Ideas s={s} limit={3} />
      </section>
      <section className="hqd-sec">
        <div className="hq__sechead"><h2>Your AI team</h2><Link href="/hq/agents" className="hqp-more">How they work together →</Link></div>
        <TeamGrid s={s} />
      </section>
    </>
  )
}
