import { Icon } from './Icons'

/** Compact food-hygiene rating in Nova's style; links to the official FSA record. */
export function HygieneRating({ rating = 5, href, compact = false }: { rating?: number; href?: string | null; compact?: boolean }) {
  const label = ['Urgent improvement necessary', 'Major improvement necessary', 'Improvement necessary', 'Generally satisfactory', 'Good', 'Very good'][rating] ?? ''
  const body = (
    <>
      <span className="hyg__icon"><Icon name="hygiene" size={compact ? 20 : 26} /></span>
      <span className="hyg__text">
        <span className="hyg__title">Food hygiene rating</span>
        <span className="hyg__scale" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((n) => <i key={n} className={n === rating ? 'is-on' : ''}>{n}</i>)}</span>
        <span className="hyg__label">{rating} — {label} · Food Standards Agency</span>
      </span>
    </>
  )
  const cls = `hyg ${compact ? 'hyg--compact' : ''}`
  return href ? <a className={cls} href={href} rel="noopener" target="_blank" aria-label={`Food hygiene rating ${rating}: ${label}. View on food.gov.uk`}>{body}</a> : <div className={cls}>{body}</div>
}
