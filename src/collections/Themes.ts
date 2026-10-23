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
    {
      name: 'decor',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' }, { label: 'Halloween (moon & bats)', value: 'halloween' }, { label: 'Christmas (snow & lights)', value: 'christmas' },
        { label: 'Easter (spring blossom)', value: 'easter' }, { label: 'Summer (sunshine)', value: 'summer' },
      ],
      admin: { description: 'Decoration style used on the banner, header and homepage while the theme is on.' },
    },
    { name: 'banner', type: 'text', admin: { description: 'Short line shown at the top of the site' } },
    { name: 'bannerLink', type: 'text', admin: { description: 'Optional link for the banner, e.g. /events' } },
    { name: 'headline', type: 'text', admin: { description: 'Homepage seasonal card title' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Seasonal photo for the homepage card' } },
    { name: 'imagePath', type: 'text', admin: { description: 'Or a photo already on the site, e.g. /img/seasonal/halloween.webp' } },
    { name: 'blurb', type: 'textarea', admin: { description: 'Homepage seasonal card text' } },
    { name: 'priority', type: 'number', defaultValue: 0 },
  ],
}
