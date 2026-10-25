import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { AdminPage } from './AdminPage'
import { redirect } from 'next/navigation'
import { KitchenBoard } from './KitchenBoard'

export async function Kitchen(props: AdminViewServerProps) {
  const { initPageResult } = props
  if (!initPageResult.req.user) redirect('/admin/login?redirect=%2Fadmin%2Fkitchen')
  return <AdminPage props={props}><KitchenBoard /></AdminPage>
}
