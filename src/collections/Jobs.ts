import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job', plural: 'Careers' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'hours', 'open'] },
  access: { read: ({ req }) => (req.user ? true : { open: { equals: true } }) },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'open', type: 'checkbox', defaultValue: true, label: 'Show on the careers page' },
    { name: 'hours', type: 'select', options: ['Full time', 'Part time', 'Weekends', 'Seasonal'].map((v) => ({ label: v, value: v.toLowerCase().replace(' ', '-') })) },
    { name: 'summary', type: 'textarea' },
  ],
}
