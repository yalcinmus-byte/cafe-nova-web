import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Nova HQ shares the CMS login: same users, same session cookie. */
export async function requireUser(path = '/hq') {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(path)}`)
  return { payload, user }
}
