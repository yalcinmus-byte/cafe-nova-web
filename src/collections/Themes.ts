import type { CollectionConfig } from 'payload'

export const Themes: CollectionConfig = {
  slug: 'themes',
  labels: { singular: 'Seasonal theme', plural: 'Seasonal themes' },
  admin: {
    useAsTitle: 'name',
    group: 'Website',
    defaultColumns: ['name', 'mode', 'startsAt', 'endsAt'],
    description: 'Auto themes switch on and off by themselves (London time). "On" overrides; "Off" disables.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'mode',
      type: 'radio',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (use dates)', value: 'auto' },
        { label: 'On now', value: 'on' },
        { label: 'Off', value: 'off' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' }, description: 'Theme stops at this moment' } },
      ],
    },
    { name: 'accent', type: 'text', defaultValue: '#B23A3A', admin: { description: 'One accent colour (hex). Brand colours stay the same.' } },
    { name: 'banner', type: 'text', admin: { description: 'Short line shown at the top of the site' } },
    { name: 'priority', type: 'number', defaultValue: 0 },
  ],
}
