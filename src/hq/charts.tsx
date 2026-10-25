import React from 'react'
import type { Day } from './sample'

/* Chart tokens: one brand hue for single series, the validated 4-slot categorical order for the channel mix,
   a one-hue sequential ramp for the heatmap. Text stays in ink tokens, never the series colour. */
export const C = {
  series: '#1d5a7e',
  prior: '#9aa6ab',
  grid: '#e7e5dd',
  axis: '#6b777d',
  ink: '#12293a',
  cat: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
  seq: ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'],
}

const gbp = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`
const short = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const long = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** Rounded-top bar path anchored to the baseline. */
function bar(x: number, y: number, w: number, h: number, r = 3) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`
}

export function Spark({ values, w = 120, h = 34 }: { values: number[]; w?: number; h?: number }) {
  const min = Math.min(...values), max = Math.max(...values)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 3 - ((v - min) / (max - min || 1)) * (h - 6)}`).join(' ')
  return (
    <svg className="hq-spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={C.series} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function DailyChart({ days }: { days: Day[] }) {
  const W = 780, H = 260, L = 50, R = 10, T = 14, B = 30
  const max = Math.ceil(Math.max(...days.map((d) => Math.max(d.takings, d.prior))) / 500) * 500
  const y = (v: number) => T + (H - T - B) * (1 - v / max)
  const step = (W - L - R) / days.length
  const bw = step - 4
  const ticks = Array.from({ length: max / 500 + 1 }, (_, i) => i * 500)
  const prior = days.map((d, i) => `${L + i * step + step / 2},${y(d.prior)}`).join(' ')
  return (
    <svg className="hq-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily takings for the last 28 days compared with the previous 28 days">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={C.grid} />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="hq-ax">{t ? `£${t / 1000}k` : '£0'}</text>
        </g>
      ))}
      {days.map((d, i) => {
        const x = L + i * step + 2
        return (
          <g key={i} className="hq-hit">
            <title>{`${long(d.date)}: ${gbp(d.takings)} · ${d.tx} sales · avg spend £${d.spend.toFixed(2)} (same day last period ${gbp(d.prior)})`}</title>
            <rect x={L + i * step} y={T} width={step} height={H - T - B} fill="transparent" />
            <path d={bar(x, y(d.takings), bw, y(0) - y(d.takings))} fill={C.series} opacity={d.dow === 0 || d.dow === 6 ? 1 : 0.78} />
            {d.dow === 0 && <text x={x + bw / 2} y={H - 10} textAnchor="middle" className="hq-ax">{short(d.date)}</text>}
          </g>
        )
      })}
      <polyline points={prior} fill="none" stroke={C.prior} strokeWidth="2" strokeDasharray="5 4" strokeLinejoin="round" pointerEvents="none" />
      <text x={W - R} y={H - 10} textAnchor="end" className="hq-ax">{short(days[days.length - 1].date)}</text>
    </svg>
  )
}

export function DowBars({ rows, weekendAvg }: { rows: { label: string; avg: number }[]; weekendAvg: number }) {
  const max = Math.max(...rows.map((r) => r.avg))
  return (
    <ul className="hq-dow">
      {rows.map((r) => {
        const quiet = r.avg < weekendAvg * 0.55
        return (
          <li key={r.label} title={`${r.label}: average ${gbp(r.avg)} a day`}>
            <span className="hq-dow__l">{r.label}</span>
            <span className="hq-dow__track"><span style={{ width: `${(r.avg / max) * 100}%` }} /></span>
            <b>{gbp(r.avg)}</b>
            {quiet ? <em className="hq-tag hq-tag--warning">Quiet</em> : <em />}
          </li>
        )
      })}
    </ul>
  )
}

export function Heatmap({ rows, hours }: { rows: { label: string; cells: { hour: number; value: number | null }[] }[]; hours: number[] }) {
  const all = rows.flatMap((r) => r.cells.map((c) => c.value ?? 0))
  const max = Math.max(...all)
  const shade = (v: number) => C.seq[Math.min(C.seq.length - 1, Math.floor((v / max) * C.seq.length))]
  return (
    <div className="hq-heat" role="table" aria-label="Average takings by weekday and hour">
      <div className="hq-heat__row hq-heat__row--head" role="row">
        <span role="columnheader" />
        {hours.map((h) => <span key={h} role="columnheader">{h}{h < 12 ? 'am' : 'pm'}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r.label} className="hq-heat__row" role="row">
          <span role="rowheader">{r.label}</span>
          {r.cells.map((c) => (
            <span
              key={c.hour}
              role="cell"
              className={c.value == null ? 'is-closed' : undefined}
              style={c.value == null ? undefined : { background: shade(c.value), color: c.value / max > 0.55 ? '#fff' : C.ink }}
              title={c.value == null ? `${r.label} ${c.hour}:00 — closed` : `${r.label} ${c.hour}:00–${c.hour + 1}:00 · average ${gbp(c.value)}`}
            >
              {c.value == null ? '' : c.value >= 100 ? `${Math.round(c.value / 10) * 10}` : c.value}
            </span>
          ))}
        </div>
      ))}
      <div className="hq-heat__legend" aria-hidden="true">
        <span>Less</span>
        {C.seq.map((c) => <i key={c} style={{ background: c }} />)}
        <span>More · £ per hour</span>
      </div>
    </div>
  )
}

export function ChannelBar({ channels }: { channels: { name: string; value: number; share: number; commission?: number }[] }) {
  return (
    <div className="hq-mix">
      <div className="hq-mix__bar" role="img" aria-label={channels.map((c) => `${c.name} ${Math.round(c.share * 100)}%`).join(', ')}>
        {channels.map((c, i) => (
          <span key={c.name} style={{ width: `${c.share * 100}%`, background: C.cat[i] }} title={`${c.name}: ${gbp(c.value)} (${Math.round(c.share * 100)}%)`} />
        ))}
      </div>
      <ul className="hq-legend">
        {channels.map((c, i) => (
          <li key={c.name}>
            <i style={{ background: C.cat[i] }} />
            <span>{c.name}</span>
            <b>{Math.round(c.share * 100)}%</b>
            <em>{gbp(c.value)}{c.commission ? ` · ${Math.round(c.commission * 100)}% fee` : ''}</em>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PoundSplit({ costs }: { costs: { name: string; p: number; profit?: boolean }[] }) {
  const max = Math.max(...costs.map((c) => c.p))
  return (
    <ul className="hq-pound">
      {costs.map((c) => (
        <li key={c.name} className={c.profit ? 'is-profit' : undefined}>
          <span>{c.name}</span>
          <span className="hq-pound__track"><span style={{ width: `${(c.p / max) * 100}%` }} /></span>
          <b>{c.p.toFixed(0)}p</b>
        </li>
      ))}
    </ul>
  )
}

type Dish = { name: string; qty: number; margin: number; group: string; price: number }
const NUDGE: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
  'Eggs Benedict': [-9, 4, 'end'],
  'Smashed Avocado': [9, 4, 'start'],
  'Turkish Eggs': [9, 16, 'start'],
  Shakshuka: [9, 12, 'start'],
  'Club Sandwich': [9, 4, 'start'],
  'Supernova Pancakes': [9, -4, 'start'],
  'Turkish Benedict': [9, 4, 'start'],
  'Mantı': [9, 4, 'start'],
  'Mixed Grill Platter': [0, 18, 'middle'],
  'Full English Breakfast': [4, -12, 'end'],
  'Istanbul Special Breakfast': [9, -12, 'start'],
}

export function MenuMatrix({ dishes, popLine, marginLine }: { dishes: Dish[]; popLine: number; marginLine: number }) {
  const W = 620, H = 340, L = 46, R = 16, T = 14, B = 40
  const xMax = 400, yMin = 4, yMax = 12
  const x = (v: number) => L + ((W - L - R) * v) / xMax
  const y = (v: number) => T + (H - T - B) * (1 - (v - yMin) / (yMax - yMin))
  return (
    <svg className="hq-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Menu engineering: dishes by number sold and profit per plate">
      <rect x={x(popLine)} y={T} width={x(xMax) - x(popLine)} height={y(marginLine) - T} fill="#eef6f3" />
      {[4, 6, 8, 10, 12].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={C.grid} />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="hq-ax">£{t}</text>
        </g>
      ))}
      {[0, 100, 200, 300, 400].map((t) => <text key={t} x={x(t)} y={H - 22} textAnchor="middle" className="hq-ax">{t}</text>)}
      <text x={(L + W - R) / 2} y={H - 4} textAnchor="middle" className="hq-ax">Plates sold in 28 days →</text>
      <line x1={x(popLine)} x2={x(popLine)} y1={T} y2={H - B} stroke={C.axis} strokeDasharray="4 4" />
      <line x1={L} x2={W - R} y1={y(marginLine)} y2={y(marginLine)} stroke={C.axis} strokeDasharray="4 4" />
      <text x={W - R - 6} y={T + 16} textAnchor="end" className="hq-quad">Stars</text>
      <text x={L + 8} y={T + 16} className="hq-quad">Puzzles</text>
      <text x={W - R - 6} y={H - B - 8} textAnchor="end" className="hq-quad">Workhorses</text>
      <text x={L + 8} y={H - B - 8} className="hq-quad">Dogs</text>
      {dishes.map((d) => {
        const [dx, dy, anchor] = NUDGE[d.name] ?? [9, 4, 'start']
        return (
          <g key={d.name} className="hq-hit">
            <title>{`${d.name}: ${d.qty} sold · £${d.margin.toFixed(2)} profit per plate (ex VAT) · ${d.group}`}</title>
            <circle cx={x(d.qty)} cy={y(d.margin)} r="12" fill="transparent" />
            <circle cx={x(d.qty)} cy={y(d.margin)} r="5.5" fill={C.series} stroke="#fff" strokeWidth="2" />
            <text x={x(d.qty) + dx} y={y(d.margin) + dy} textAnchor={anchor} className="hq-pt">{d.name}</text>
          </g>
        )
      })}
    </svg>
  )
}
