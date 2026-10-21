import type { GlobalConfig } from 'payload'

export const ServiceControl: GlobalConfig = {
  slug: 'service-control',
  label: 'Service control',
  admin: { group: 'Today' },
  access: { read: () => true },
  fields: [
    {
      name: 'emergencyPause',
      type: 'checkbox',
      label: 'Pause ALL online ordering now',
      admin: { description: 'One tap. Existing orders are not affected.' },
    },
    { name: 'pauseMessage', type: 'text', defaultValue: 'We are not taking online orders right now — come and see us instead.' },
    {
      type: 'row',
      fields: [
        { name: 'directOrdering', type: 'checkbox', label: 'Order on our website', defaultValue: false, admin: { width: '25%' } },
        { name: 'collection', type: 'checkbox', label: 'Collection', defaultValue: true, admin: { width: '25%' } },
        { name: 'delivery', type: 'checkbox', label: 'Delivery', defaultValue: false, admin: { width: '25%' } },
        { name: 'coffeeShop', type: 'checkbox', label: 'Coffee shop', defaultValue: true, admin: { width: '25%' } },
      ],
    },
    { name: 'slotCapacity', type: 'number', defaultValue: 6, label: 'Orders per 15 minutes' },
    {
      type: 'row',
      fields: [
        { name: 'firstSlot', type: 'text', defaultValue: '08:30', label: 'First order time', admin: { width: '25%', description: '24h, London time' } },
        { name: 'lastSlot', type: 'text', defaultValue: '16:15', label: 'Last order time', admin: { width: '25%' } },
        { name: 'prepMinutes', type: 'number', defaultValue: 20, label: 'Prep time (min)', admin: { width: '25%' } },
        { name: 'payAtCounter', type: 'checkbox', defaultValue: true, label: 'Allow pay at the counter (collection)', admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'deliveryFee', type: 'number', defaultValue: 3.5, label: 'Delivery fee £', admin: { width: '25%' } },
        { name: 'deliveryMinimum', type: 'number', defaultValue: 15, label: 'Delivery minimum £', admin: { width: '25%' } },
        { name: 'deliveryPostcodes', type: 'text', defaultValue: 'TW1, TW2, TW9, TW10', label: 'Delivery postcode areas', admin: { width: '50%', description: 'Comma separated, e.g. TW1, TW9' } },
      ],
    },
    {
      name: 'marketplaces',
      type: 'array',
      labels: { singular: 'Delivery app', plural: 'Delivery apps' },
      admin: { description: 'Shows/hides each app on our website. Pausing inside the app itself is still done on its tablet.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'select', required: true, options: ['Deliveroo', 'Uber Eats', 'Just Eat'].map((v) => ({ label: v, value: v })), admin: { width: '30%' } },
            { name: 'url', type: 'text', admin: { width: '50%' } },
            { name: 'showOnSite', type: 'checkbox', label: 'Show', defaultValue: false, admin: { width: '20%' } },
          ],
        },
      ],
    },
  ],
}
