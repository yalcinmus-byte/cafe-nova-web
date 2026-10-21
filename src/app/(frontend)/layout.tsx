import type { Metadata } from 'next'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/instrument-sans/index.css'
import React from 'react'
import { getActiveTheme, getSettings } from '@/lib/data'
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
  const style = theme?.accent ? ({ '--accent': theme.accent } as React.CSSProperties) : undefined
  return (
    <html lang="en-GB" style={style} data-theme={theme?.name?.toLowerCase() ?? 'everyday'}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {(theme?.banner || settings.announcement) && <div className="banner">{settings.announcement || theme?.banner}</div>}
        {children}
      </body>
    </html>
  )
}
