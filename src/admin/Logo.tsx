import React from 'react'
import { NovaLogo, NovaMark } from '@/components/NovaLogo'

export const Logo = () => (
  <div className="nova-logo">
    <NovaLogo className="nova-logo__lockup" />
    <span className="nova-logo__sub">Nova Studio</span>
  </div>
)

export const Icon = () => <NovaMark className="nova-logo__icon" />
