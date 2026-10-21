import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Supplier', plural: 'Suppliers & partners' },
  admin: { useAsTitle: 'name', group: 'Website', defaultColumns: ['name', 'role', 'showOnSite', 'order'], description: 'Add a logo only with the supplier’s permission. Without a logo the name is shown as text.' },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'role', type: 'text', admin: { description: 'e.g. Coffee roaster' } }] },
    { name: 'description', type: 'textarea' },
    { name: 'url', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { type: 'row', fields: [{ name: 'showOnSite', type: 'checkbox', defaultValue: true }, { name: 'order', type: 'number', defaultValue: 0 }] },
  ],
}
