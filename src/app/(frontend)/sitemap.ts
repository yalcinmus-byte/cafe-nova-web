import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pages = ['', '/menu', '/order', '/events', '/visit', '/about', '/contact', '/blog', '/careers'].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const }))
  const posts = (await getPosts()).map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt }))
  return [...pages, ...posts]
}
