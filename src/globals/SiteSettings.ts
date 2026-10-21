import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Café details',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', defaultValue: 'Cafe Nova Bistro' },
    { name: 'address', type: 'textarea', defaultValue: '424 Richmond Road\nEast Twickenham, Twickenham' },
    { type: 'row', fields: [{ name: 'phone', type: 'text' }, { name: 'email', type: 'text' }] },
    {
      name: 'hours',
      type: 'array',
      labels: { singular: 'Opening hours line', plural: 'Opening hours' },
      fields: [{ type: 'row', fields: [{ name: 'days', type: 'text', required: true }, { name: 'time', type: 'text', required: true }] }],
    },
    { name: 'announcement', type: 'text', admin: { description: 'Optional line at the top of every page (e.g. holiday hours)' } },
    {
      name: 'reviews',
      type: 'group',
      admin: { description: 'Shown on the site as you enter it. Update when the numbers change.' },
      fields: [{ type: 'row', fields: [
        { name: 'googleRating', type: 'number', min: 0, max: 5, admin: { step: 0.1, width: '33%' } },
        { name: 'googleCount', type: 'number', admin: { width: '33%' } },
        { name: 'asOf', type: 'date', admin: { width: '33%' } },
      ] }],
    },
    {
      name: 'facilities',
      type: 'array',
      labels: { singular: 'Facility', plural: 'Good to know' },
      fields: [{ type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'link', type: 'text' }] }, { name: 'text', type: 'textarea' }],
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'googleMaps', type: 'text' },
        { name: 'tripadvisor', type: 'text' },
        { name: 'fsa', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'wanderlog', type: 'text' },
        { name: 'visitRichmond', type: 'text' },
        { name: 'pawpal', type: 'text', label: 'PawPal (dog-friendly listing)' },
        { name: 'tiktok', type: 'text' },
      ],
    },
  ],
}
