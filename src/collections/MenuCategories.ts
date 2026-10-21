import type { CollectionConfig } from 'payload'

export const MenuCategories: CollectionConfig = {
  slug: 'menu-categories',
  labels: { singular: 'Menu section', plural: 'Menu sections' },
  admin: { useAsTitle: 'name', group: 'Menu', defaultColumns: ['name', 'group', 'order'] },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'group',
      type: 'select',
      required: true,
      defaultValue: 'breakfast',
      options: ['breakfast', 'turkish', 'lunch', 'sweet', 'drinks', 'kids'].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
    },
    { name: 'note', type: 'textarea', admin: { description: 'Shown under the section title, e.g. "Served with sourdough toast"' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
