import type { CollectionConfig } from 'payload'

export const ORDER_STATUSES = [
  { label: 'New', value: 'new' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready / out for delivery', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

/** Orders are only ever created by the server checkout route (overrideAccess); the public can't write here. */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Order', plural: 'Orders' },
  admin: {
    useAsTitle: 'ref',
    group: 'Today',
    defaultColumns: ['ref', 'status', 'fulfilment', 'slot', 'total', 'payment', 'createdAt'],
    description: 'Live orders from the website. The Kitchen screen (/kitchen) shows the same list, large.',
  },
  access: {
    create: () => false,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'owner',
  },
  defaultSort: '-createdAt',
  fields: [
    { type: 'row', fields: [
      { name: 'ref', type: 'text', required: true, unique: true, index: true, admin: { width: '25%', readOnly: true } },
      { name: 'status', type: 'select', required: true, defaultValue: 'new', options: ORDER_STATUSES, admin: { width: '25%' } },
      { name: 'fulfilment', type: 'select', required: true, options: [{ label: 'Collection', value: 'collection' }, { label: 'Delivery', value: 'delivery' }], admin: { width: '25%' } },
      { name: 'slot', type: 'date', admin: { width: '25%', date: { pickerAppearance: 'dayAndTime' } } },
    ] },
    { name: 'items', type: 'array', required: true, fields: [{ type: 'row', fields: [
      { name: 'slug', type: 'text', admin: { width: '25%' } },
      { name: 'name', type: 'text', required: true, admin: { width: '45%' } },
      { name: 'qty', type: 'number', required: true, min: 1, admin: { width: '15%' } },
      { name: 'unitPrice', type: 'number', required: true, admin: { width: '15%' } },
    ] }] },
    { type: 'row', fields: [
      { name: 'subtotal', type: 'number', required: true, admin: { width: '33%' } },
      { name: 'deliveryFee', type: 'number', defaultValue: 0, admin: { width: '33%' } },
      { name: 'total', type: 'number', required: true, admin: { width: '33%' } },
    ] },
    { type: 'row', fields: [
      { name: 'payment', type: 'select', required: true, defaultValue: 'unpaid', options: [
        { label: 'Waiting for payment', value: 'unpaid' }, { label: 'Paid online', value: 'paid' }, { label: 'Pay at the counter', value: 'counter' }, { label: 'Refunded', value: 'refunded' },
      ], admin: { width: '50%' } },
      { name: 'stripeSession', type: 'text', admin: { width: '50%', readOnly: true } },
    ] },
    { name: 'customer', type: 'group', fields: [
      { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'phone', type: 'text', required: true }, { name: 'email', type: 'email', required: true }] },
      { name: 'address', type: 'textarea' },
      { name: 'postcode', type: 'text' },
    ] },
    { name: 'notes', type: 'textarea', admin: { description: 'Guest notes, including allergies' } },
    { name: 'token', type: 'text', admin: { hidden: true } },
  ],
}
