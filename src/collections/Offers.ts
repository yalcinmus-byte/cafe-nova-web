import type { CollectionConfig } from 'payload'

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
export const DAYS = [
  { label: 'Mon', value: 'mon' }, { label: 'Tue', value: 'tue' }, { label: 'Wed', value: 'wed' }, { label: 'Thu', value: 'thu' },
  { label: 'Fri', value: 'fri' }, { label: 'Sat', value: 'sat' }, { label: 'Sun', value: 'sun' },
]

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Offer', plural: 'Offers' },
  admin: {
    useAsTitle: 'title',
    group: 'Menu',
    defaultColumns: ['title', 'active', 'discount', 'days', 'from', 'to'],
    description: 'Time-based deals, e.g. half-price cakes after 3pm on weekdays. Shown on the homepage and menu; linked dishes get the discount automatically at checkout while the offer is on.',
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'e.g. Half-price cakes after 3pm' } },
    { name: 'text', type: 'textarea', admin: { description: 'One or two lines for guests.' } },
    { type: 'row', fields: [
      { name: 'active', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
      { name: 'showOnHome', type: 'checkbox', defaultValue: true, label: 'Show on homepage', admin: { width: '25%' } },
      { name: 'discount', type: 'number', min: 1, max: 100, admin: { width: '25%', description: '% off, e.g. 50' } },
      { name: 'order', type: 'number', defaultValue: 0, admin: { width: '25%' } },
    ] },
    { name: 'days', type: 'select', hasMany: true, options: DAYS, admin: { description: 'Leave empty for every day.' } },
    { type: 'row', fields: [
      { name: 'from', type: 'text', admin: { width: '25%', placeholder: '15:00', description: '24h, UK time' }, validate: (v: unknown) => !v || TIME.test(String(v)) || 'Use HH:MM, e.g. 15:00' },
      { name: 'to', type: 'text', admin: { width: '25%', placeholder: '17:00' }, validate: (v: unknown) => !v || TIME.test(String(v)) || 'Use HH:MM, e.g. 17:00' },
      { name: 'startDate', type: 'date', admin: { width: '25%', description: 'Optional' } },
      { name: 'endDate', type: 'date', admin: { width: '25%', description: 'Optional' } },
    ] },
    { name: 'categories', type: 'relationship', relationTo: 'menu-categories', hasMany: true, admin: { description: 'Whole menu sections this applies to (optional).' } },
    { name: 'items', type: 'relationship', relationTo: 'menu-items', hasMany: true, admin: { description: 'Single dishes this applies to (optional). With none linked, the offer is shown as a note only (e.g. counter cakes).' } },
    { name: 'label', type: 'text', admin: { description: 'Short tag on the menu, e.g. "½ price after 3pm". Optional.' } },
  ],
}
