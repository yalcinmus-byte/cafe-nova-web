import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: { group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Describe the photo (for screen readers)' },
    { name: 'credit', type: 'text', admin: { description: 'Who took it / licence' } },
  ],
  upload: { imageSizes: [{ name: 'card', width: 900 }, { name: 'thumb', width: 320 }] },
}
