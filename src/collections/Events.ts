import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Festive & events' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'startsAt', 'kind', 'highlight'] },
  access: { read: () => true },
  defaultSort: 'startsAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' } },
        { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' } },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'nova',
      options: [
        { label: 'At Cafe Nova', value: 'nova' },
        { label: 'Nearby (we are not the organiser)', value: 'nearby' },
      ],
    },
    { name: 'highlight', type: 'checkbox', label: 'Show in homepage highlights' },
    { name: 'summary', type: 'textarea' },
    { name: 'link', type: 'text', admin: { description: 'Organiser or booking link' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
