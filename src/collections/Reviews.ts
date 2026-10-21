import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Guest review', plural: 'Guest reviews' },
  admin: { useAsTitle: 'title', group: 'Website', defaultColumns: ['title', 'author', 'source', 'date', 'featured'], description: 'Short quotes copied from real public reviews, with a link to the original. Never edit a guest’s words.' },
  access: { read: () => true },
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'quote', type: 'textarea', required: true, maxLength: 240 },
    { type: 'row', fields: [
      { name: 'author', type: 'text', required: true },
      { name: 'source', type: 'select', required: true, options: [{ label: 'Google', value: 'google' }, { label: 'Tripadvisor', value: 'tripadvisor' }, { label: 'Other', value: 'other' }] },
      { name: 'date', type: 'date' },
    ] },
    { name: 'url', type: 'text', admin: { description: 'Link to the original review or listing' } },
    { name: 'featured', type: 'checkbox', defaultValue: true, label: 'Show on the homepage' },
  ],
}
