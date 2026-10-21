import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Journal post', plural: 'Journal' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'publishedAt', 'status'] },
  access: { read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }) },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'status', type: 'select', defaultValue: 'draft', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }], admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'excerpt', type: 'textarea', admin: { description: 'One or two sentences for the journal list and Google.' } },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'coverPath', type: 'text', admin: { position: 'sidebar', description: 'Or a photo already on the site, e.g. /img/place/bridge.webp' } },
    { name: 'body', type: 'richText' },
  ],
}
