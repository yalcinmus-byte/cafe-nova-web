import type { CollectionConfig } from 'payload'

export const ALLERGENS = ['celery','cereals containing gluten','crustaceans','eggs','fish','lupin','milk','molluscs','mustard','peanuts','sesame','soya','sulphites','tree nuts']

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  labels: { singular: 'Dish', plural: 'Dishes' },
  admin: {
    useAsTitle: 'name',
    group: 'Menu',
    defaultColumns: ['name', 'category', 'price', 'available', 'signature'],
    listSearchableFields: ['name', 'localName'],
  },
  access: { read: () => true },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'localName', type: 'text', label: 'Turkish name', admin: { width: '50%' } },
      ],
    },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', min: 0, admin: { width: '33%', description: 'GBP, e.g. 13.50. Leave empty if not decided — the dish stays hidden.' } },
        { name: 'category', type: 'relationship', relationTo: 'menu-categories', required: true, admin: { width: '33%' } },
        { name: 'order', type: 'number', defaultValue: 0, admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'available', type: 'checkbox', defaultValue: true, label: 'Available today', admin: { width: '33%' } },
        { name: 'signature', type: 'checkbox', label: 'Signature dish (homepage)', admin: { width: '33%' } },
        { name: 'orderable', type: 'checkbox', label: 'Can be ordered online', admin: { width: '33%' } },
        { name: 'inShop', type: 'checkbox', label: 'Show in the homepage shop', admin: { width: '33%', description: 'Pick around 8–12 dishes for “Order your favourites”' } },
      ],
    },
    {
      name: 'dietary',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Vegetarian', value: 'v' },
        { label: 'Vegan', value: 'vg' },
        { label: 'Gluten-free', value: 'gf' },
        { label: 'Dairy-free', value: 'df' },
      ],
    },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'New', value: 'new' }, { label: 'Popular', value: 'popular' }, { label: 'Top seller', value: 'bestseller' },
        { label: "Chef's special", value: 'chefs' }, { label: 'Seasonal', value: 'seasonal' }, { label: 'Spicy', value: 'spicy' },
        { label: 'Healthy choice', value: 'healthy' }, { label: 'Kids’ favourite', value: 'kids' }, { label: 'Limited time', value: 'limited' },
        { label: 'Signature Turkish', value: 'turkish' },
      ],
      admin: { description: 'Little labels shown on the menu and the shop, e.g. New, Popular, Spicy.' },
    },
    {
      name: 'allergens',
      type: 'select',
      hasMany: true,
      options: ALLERGENS.map((a) => ({ label: a[0].toUpperCase() + a.slice(1), value: a })),
      admin: { description: 'Kitchen-confirmed only. Empty = not yet confirmed (shown as "ask our team").' },
    },
    { name: 'extras', type: 'text', admin: { description: 'e.g. "Add a poached egg £2.50"' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'photoPath', type: 'text', admin: { description: 'Static image path (used until a photo is uploaded)', position: 'sidebar' } },
  ],
}
