import type { Access, CollectionConfig } from 'payload'

const staff: Access = ({ req }) => !!req.user
const owner: Access = ({ req }) => req.user?.role === 'owner' || req.user?.role === 'manager'
const hq = { group: 'Nova HQ' }

export const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  labels: { singular: 'Supplier', plural: 'Suppliers' },
  admin: { ...hq, useAsTitle: 'name', defaultColumns: ['name', 'category', 'contact', 'paymentTerms'] },
  access: { read: staff, create: owner, update: owner, delete: owner },
  fields: [
    { type: 'row', fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'category', type: 'select', options: ['Coffee', 'Dairy', 'Bakery', 'Fresh produce', 'Meat & fish', 'Dry goods', 'Drinks', 'Packaging', 'Cleaning', 'Equipment', 'Services'].map((v) => ({ label: v, value: v.toLowerCase().replace(/[^a-z]+/g, '-') })) },
    ] },
    { type: 'row', fields: [{ name: 'contact', type: 'text' }, { name: 'phone', type: 'text' }, { name: 'email', type: 'email' }] },
    { type: 'row', fields: [{ name: 'website', type: 'text' }, { name: 'accountNumber', type: 'text' }, { name: 'paymentTerms', type: 'text', admin: { description: 'e.g. 30 days, card on delivery' } }] },
    { type: 'row', fields: [{ name: 'deliveryDays', type: 'text' }, { name: 'minimumOrder', type: 'number' }] },
    { name: 'products', type: 'array', labels: { singular: 'Product', plural: 'Products & prices' }, fields: [{ type: 'row', fields: [{ name: 'item', type: 'text', required: true }, { name: 'unit', type: 'text' }, { name: 'price', type: 'number' }, { name: 'updated', type: 'date' }] }] },
    { name: 'notes', type: 'textarea' },
  ],
}

export const Purchases: CollectionConfig = {
  slug: 'purchases',
  labels: { singular: 'Purchase / invoice', plural: 'Purchases & invoices' },
  admin: { ...hq, useAsTitle: 'reference', defaultColumns: ['date', 'supplier', 'reference', 'total', 'status'] },
  access: { read: staff, create: owner, update: owner, delete: owner },
  defaultSort: '-date',
  fields: [
    { type: 'row', fields: [
      { name: 'date', type: 'date', required: true },
      { name: 'supplier', type: 'relationship', relationTo: 'suppliers' },
      { name: 'reference', type: 'text', admin: { description: 'Invoice number' } },
    ] },
    { name: 'lines', type: 'array', labels: { singular: 'Line', plural: 'Lines' }, fields: [{ type: 'row', fields: [{ name: 'item', type: 'text', required: true }, { name: 'qty', type: 'number' }, { name: 'unit', type: 'text' }, { name: 'unitPrice', type: 'number' }] }] },
    { type: 'row', fields: [
      { name: 'net', type: 'number' }, { name: 'vat', type: 'number' }, { name: 'total', type: 'number', required: true },
      { name: 'status', type: 'select', defaultValue: 'unpaid', options: [{ label: 'Unpaid', value: 'unpaid' }, { label: 'Paid', value: 'paid' }, { label: 'Disputed', value: 'disputed' }] },
    ] },
    { name: 'file', type: 'upload', relationTo: 'documents', admin: { description: 'Photo or PDF of the invoice' } },
  ],
}

export const Expenses: CollectionConfig = {
  slug: 'expenses',
  labels: { singular: 'Expense', plural: 'Expenses' },
  admin: { ...hq, useAsTitle: 'description', defaultColumns: ['date', 'category', 'description', 'amount'] },
  access: { read: owner, create: owner, update: owner, delete: owner },
  defaultSort: '-date',
  fields: [
    { type: 'row', fields: [
      { name: 'date', type: 'date', required: true },
      { name: 'category', type: 'select', required: true, options: ['Rent & rates', 'Utilities', 'Staff', 'Marketing', 'Delivery fees', 'Card fees', 'Repairs', 'Software', 'Insurance', 'Other'].map((v) => ({ label: v, value: v.toLowerCase().replace(/[^a-z]+/g, '-') })) },
      { name: 'amount', type: 'number', required: true },
    ] },
    { name: 'description', type: 'text', required: true },
    { type: 'row', fields: [{ name: 'recurring', type: 'select', options: ['One-off', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((v) => ({ label: v, value: v.toLowerCase() })) }, { name: 'receipt', type: 'upload', relationTo: 'documents' }] },
  ],
}

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'File', plural: 'Files & data uploads' },
  admin: { ...hq, useAsTitle: 'title', defaultColumns: ['title', 'kind', 'period', 'createdAt'], description: 'Upload EPOS exports, bank statements, invoices and reports. The Nova HQ agents will read these once connected.' },
  access: { read: owner, create: owner, update: owner, delete: owner },
  upload: { mimeTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/*'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [
      { name: 'kind', type: 'select', options: ['EPOS sales export', 'Bank statement', 'Supplier invoice', 'Payroll / rota', 'Delivery app report', 'Stock count', 'Other'].map((v) => ({ label: v, value: v.toLowerCase().replace(/[^a-z]+/g, '-') })) },
      { name: 'period', type: 'text', admin: { description: 'e.g. October 2026' } },
    ] },
  ],
}
