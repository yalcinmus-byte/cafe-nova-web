import { APIError, type CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: { useAsTitle: 'name', group: 'Guests', defaultColumns: ['name', 'kind', 'date', 'guests', 'status', 'createdAt'] },
  access: {
    create: () => true, // public contact / event / careers form
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'owner',
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [({ data, req, operation }) => {
      if (operation === 'create' && !req.user) {
        if (data.website) throw new APIError('Invalid submission', 400) // honeypot
        const keep = ['kind', 'name', 'email', 'phone', 'date', 'guests', 'message', 'startTime', 'occasion', 'equipment', 'position'] as const
        const clean: Record<string, unknown> = { status: 'new' }
        for (const k of keep) if (data[k] !== undefined) clean[k] = data[k]
        return clean
      }
      return data
    }],
  },
  fields: [
    { name: 'kind', type: 'select', required: true, defaultValue: 'general', options: [
      { label: 'General', value: 'general' }, { label: 'Event or private hire', value: 'event' }, { label: 'Careers', value: 'careers' },
    ] },
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true, maxLength: 120 }, { name: 'email', type: 'email', required: true }, { name: 'phone', type: 'text', maxLength: 40 }] },
    { type: 'row', fields: [{ name: 'date', type: 'date', admin: { description: 'For events' } }, { name: 'guests', type: 'number', min: 1, max: 200 }] },
    { type: 'row', fields: [
      { name: 'startTime', type: 'text', maxLength: 20, admin: { description: 'Events: preferred start time' } },
      { name: 'occasion', type: 'text', maxLength: 80 },
      { name: 'position', type: 'text', maxLength: 80, admin: { description: 'Careers: role applied for' } },
    ] },
    { name: 'equipment', type: 'select', hasMany: true, options: [
      { label: 'Sound system', value: 'sound' }, { label: 'Microphone', value: 'mic' }, { label: 'Projector', value: 'projector' }, { label: 'Big-screen TV', value: 'tv' },
    ] },
    { name: 'message', type: 'textarea', required: true, maxLength: 4000 },
    { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: 'New', value: 'new' }, { label: 'Replied', value: 'replied' }, { label: 'Booked', value: 'booked' }, { label: 'Closed', value: 'closed' }], admin: { position: 'sidebar' } },
    { name: 'website', type: 'text', admin: { hidden: true } },
  ],
}
