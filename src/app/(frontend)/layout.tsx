import type { Metadata } from 'next'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/instrument-sans/index.css'
import React from 'react'
import { getActiveTheme, getSettings } from '@/lib/data'
import { SeasonArt } from '@/components/HomeSections'
import './styles.css'


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Cafe Nova Bistro, East Twickenham — breakfast & lunch by Richmond Bridge', template: '%s · Cafe Nova Bistro, East Twickenham' },
  description: 'British and Turkish breakfasts, proper lunches and Alchemy coffee, cooked fresh at 424 Richmond Road, East Twickenham — a short walk from Richmond Bridge.',
  icons: { icon: '/brand/nova-icon.svg' },
  openGraph: { type: 'website', siteName: 'Cafe Nova Bistro', locale: 'en_GB', images: ['/img/place/drone.webp'] },
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, settings] = await Promise.all([getActiveTheme(), getSettings()])
  const style = theme?.accent ? ({ '--accent': theme.accent, '--banner-bg': theme.accent, '--banner-fg': '#fff' } as React.CSSProperties) : undefined
  const bannerText = settings.announcement || theme?.banner
  const decor = theme?.decor && theme.decor !== 'none' ? theme.decor : undefined
  return (
    <html lang="en-GB" style={style} data-theme={theme?.name?.toLowerCase() ?? 'everyday'} data-decor={decor ?? 'none'} className={bannerText ? 'has-banner' : undefined}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {bannerText && (
          <div className="banner" role="note">
            {decor && <SeasonArt decor={decor} small />}
            {theme?.bannerLink && !settings.announcement ? <a href={theme.bannerLink}>{bannerText}</a> : <span>{bannerText}</span>}
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
