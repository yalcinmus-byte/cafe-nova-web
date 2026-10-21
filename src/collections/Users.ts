import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Team member', plural: 'Team' },
  admin: { useAsTitle: 'email', group: 'Settings' },
  auth: true,
  access: {
    create: ({ req }) => req.user?.role === 'owner',
    delete: ({ req }) => req.user?.role === 'owner',
    update: ({ req, id }) => req.user?.role === 'owner' || req.user?.id === id,
    read: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'staff',
      access: { create: ({ req }) => req.user?.role === 'owner', update: ({ req }) => req.user?.role === 'owner' },
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
      ],
    },
  ],
}
