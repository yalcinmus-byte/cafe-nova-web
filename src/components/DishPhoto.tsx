import Image from 'next/image'
import type { MenuItem, Media } from '@/payload-types'

export function DishPhoto({ item, sizes }: { item: MenuItem; sizes: string }) {
  const media = typeof item.photo === 'object' ? (item.photo as Media | null) : null
  const src = media?.url || item.photoPath
  if (!src) return <div className="dish__ph" aria-hidden="true"><span>{item.name.charAt(0)}</span></div>
  return (
    <div className="dish__img">
      <Image src={src} alt={media?.alt || item.name} fill sizes={sizes} />
    </div>
  )
}
