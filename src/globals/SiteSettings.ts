import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Café details',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'contentVersion', type: 'number', defaultValue: 0, admin: { hidden: true } },
    { name: 'name', type: 'text', defaultValue: 'Cafe Nova Bistro' },
    { name: 'address', type: 'textarea', defaultValue: '424 Richmond Road\nEast Twickenham, Twickenham' },
    { type: 'row', fields: [{ name: 'phone', type: 'text' }, { name: 'email', type: 'text' }] },
    {
      name: 'hours',
      type: 'array',
      labels: { singular: 'Opening hours line', plural: 'Opening hours' },
      fields: [{ type: 'row', fields: [{ name: 'days', type: 'text', required: true }, { name: 'time', type: 'text', required: true }] }],
    },
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp button',
      admin: { description: 'Round WhatsApp button fixed at the bottom-right of every page.' },
      fields: [{ type: 'row', fields: [
        { name: 'show', type: 'checkbox', defaultValue: true, admin: { width: '20%' } },
        { name: 'number', type: 'text', defaultValue: '447453302323', admin: { width: '30%', description: 'International format, digits only (e.g. 447453302323)' } },
        { name: 'message', type: 'text', defaultValue: 'Hi Cafe Nova, ', admin: { width: '50%', description: 'Pre-filled start of the message' } },
      ] }],
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
      ] }, { type: 'row', fields: [
        { name: 'tripadvisorCount', type: 'number', admin: { width: '33%' } },
        { name: 'tripadvisorRank', type: 'text', admin: { width: '66%', description: 'e.g. #3 of 67 Coffee & Tea in Richmond-upon-Thames' } },
      ] }],
    },
    {
      name: 'facilities',
      type: 'array',
      labels: { singular: 'Facility', plural: 'Good to know' },
      fields: [
        { type: 'row', fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'icon', type: 'select', options: ['dog', 'run', 'bike', 'rowing', 'river', 'family', 'party', 'hygiene', 'coffee', 'heart'].map((v) => ({ label: v, value: v })) },
          { name: 'link', type: 'text' },
        ] },
        { name: 'text', type: 'textarea' },
        { name: 'links', type: 'array', labels: { singular: 'Link', plural: 'Links' }, fields: [{ type: 'row', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true }, { name: 'note', type: 'text' }] }] },
      ],
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
        { name: 'staycation', type: 'text' },
        { name: 'myRichmond', type: 'text', label: 'My Richmond offer' },
        { name: 'facebook', type: 'text' },
        { name: 'tiktok', type: 'text' },
      ],
    },
  ],
}
