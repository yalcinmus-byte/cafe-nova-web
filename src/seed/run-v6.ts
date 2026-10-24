import { getPayload } from 'payload'
import config from '@payload-config'
import { applyV6Content } from './v6-content'

const payload = await getPayload({ config })
await applyV6Content(payload)
console.log('v6 content applied.')
process.exit(0)
