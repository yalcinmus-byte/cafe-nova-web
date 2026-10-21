import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Header, Footer } from '@/components/Chrome'
import { getPost, getSettings } from '@/lib/data'
import type { Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug)
  return p ? { title: p.title, description: p.excerpt ?? undefined } : {}
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [s, p] = await Promise.all([getSettings(), getPost(slug)])
  if (!p) notFound()
  const img = (typeof p.cover === 'object' && (p.cover as Media | null)?.url) || p.coverPath
  return (
    <>
      <Header />
      <main id="main" className="post">
        <header className="post__head wrap">
          <Link href="/blog" className="post__back">← Journal</Link>
          {p.publishedAt && <time dateTime={p.publishedAt}>{new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>}
          <h1>{p.title}</h1>
          {p.excerpt && <p className="post__lede">{p.excerpt}</p>}
        </header>
        {img && <img className="post__cover" src={img} alt="" />}
        <div className="post__body">{p.body && <RichText data={p.body} />}</div>
      </main>
      <Footer s={s} />
    </>
  )
}
