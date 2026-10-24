import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job', plural: 'Careers' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'hours', 'open'] },
  access: { read: ({ req }) => (req.user ? true : { open: { equals: true } }) },
  defaultSort: 'order',
  fields: [
    { type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true }] },
    { type: 'row', fields: [
      { name: 'open', type: 'checkbox', defaultValue: true, label: 'Show on the careers page' },
      { name: 'order', type: 'number', defaultValue: 0 },
    ] },
    { type: 'row', fields: [
      { name: 'team', type: 'select', options: [{ label: 'Front of house', value: 'front' }, { label: 'Kitchen', value: 'kitchen' }, { label: 'Coffee bar', value: 'coffee' }] },
      { name: 'hours', type: 'select', options: ['Full time', 'Part time', 'Weekends', 'Seasonal'].map((v) => ({ label: v, value: v.toLowerCase().replace(' ', '-') })) },
      { name: 'schedule', type: 'text', admin: { description: 'e.g. Sat & Sun, 7:30am–5pm' } },
      { name: 'pay', type: 'text', admin: { description: 'e.g. £12.50/hr + tips (leave empty to say “discussed at interview”)' } },
    ] },
    { name: 'summary', type: 'textarea' },
    { name: 'responsibilities', type: 'array', labels: { singular: 'Duty', plural: 'What you’ll do' }, fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', labels: { singular: 'Requirement', plural: 'What we’re looking for' }, fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'benefits', type: 'array', labels: { singular: 'Perk', plural: 'What you get' }, fields: [{ name: 'text', type: 'text', required: true }] },
  ],
}
