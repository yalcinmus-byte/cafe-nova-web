import { getPayload } from 'payload'
import config from '@payload-config'
import { applyV10Content } from './v10-content'
const payload = await getPayload({ config })
await applyV10Content(payload)
console.log('v10 content applied')
process.exit(0)
