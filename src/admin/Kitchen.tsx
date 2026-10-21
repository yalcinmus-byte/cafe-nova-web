import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { KitchenBoard } from './KitchenBoard'

export async function Kitchen({ initPageResult }: AdminViewServerProps) {
  if (!initPageResult.req.user) redirect('/admin/login?redirect=%2Fadmin%2Fkitchen')
  return <KitchenBoard />
}
