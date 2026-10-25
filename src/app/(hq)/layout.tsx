import type { Metadata } from 'next'
import React from 'react'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/instrument-sans/index.css'
import './hq.css'

export const metadata: Metadata = {
  title: { default: 'Nova HQ', template: '%s · Nova HQ' },
  robots: { index: false, follow: false },
  icons: { icon: '/brand/nova-icon.svg' },
}

export default function HQRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="hq-body">{children}</body>
    </html>
  )
}
