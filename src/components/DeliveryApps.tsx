type App = { id?: string | null; name: string; url?: string | null }

const STYLE: Record<string, string> = { Deliveroo: 'app--deliveroo', 'Uber Eats': 'app--uber', 'Just Eat': 'app--justeat' }

/** Delivery-app tiles. With a store link → "Order on …"; without one yet → "Coming soon". */
export function DeliveryApps({ apps, title = 'Delivery through the apps' }: { apps: App[]; title?: string }) {
  if (!apps.length) return null
  return (
    <div className="apps-block">
      <h3>{title}</h3>
      <ul className="apps-tiles">
        {apps.map((a) => {
          const inner = (
            <>
              <span className="app__word">{a.name}</span>
              <span className="app__cta">{a.url ? `Order on ${a.name} →` : 'Coming soon'}</span>
            </>
          )
          return (
            <li key={a.id ?? a.name} className={`app ${STYLE[a.name] ?? ''} ${a.url ? '' : 'is-soon'}`}>
              {a.url ? <a href={a.url} rel="noopener" target="_blank">{inner}</a> : <div aria-label={`${a.name}: coming soon`}>{inner}</div>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
