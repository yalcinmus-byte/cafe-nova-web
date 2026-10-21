import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Chrome'
import { getPosts, getSettings } from '@/lib/data'
import type { Media } from '@/payload-types'

export const metadata: Metadata = { title: 'Journal', description: 'Notes from Cafe Nova Bistro: our story, seasonal menus and mornings by Richmond Bridge.' }

export default async function BlogPage() {
  const [s, posts] = await Promise.all([getSettings(), getPosts()])
  return (
    <>
      <Header />
      <main id="main" className="journal wrap">
        <header className="page-head"><p className="eyebrow">Journal</p><h1>From the café</h1></header>
        <ul className="journal__list">
          {posts.map((p) => {
            const img = (typeof p.cover === 'object' && (p.cover as Media | null)?.url) || p.coverPath
            return (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="post-card">
                  {img && <img src={img} alt="" loading="lazy" />}
                  <div>
                    {p.publishedAt && <time dateTime={p.publishedAt}>{new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>}
                    <h2>{p.title}</h2>
                    <p>{p.excerpt}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
      <Footer s={s} />
    </>
  )
}
