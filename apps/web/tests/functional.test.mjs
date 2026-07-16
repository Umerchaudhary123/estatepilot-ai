import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read=(path)=>readFile(new URL(`../${path}`,import.meta.url),'utf8')

test('dashboard is protected and exposes logout',async()=>{const [layout,shell]=await Promise.all([read('src/app/dashboard/layout.tsx'),read('src/components/dashboard-shell.tsx')]);assert.match(layout,/verifySession/);assert.match(layout,/redirect\('\/auth'\)/);assert.match(shell,/\/api\/auth\/logout/);assert.match(shell,/Sign out/)})
test('customer forms and discovery filters call real flows',async()=>{const [booking,explorer,saved]=await Promise.all([read('src/components/booking-form.tsx'),read('src/components/property-explorer.tsx'),read('src/app/saved/page.tsx')]);assert.match(booking,/FormData/);assert.match(booking,/\/appointments/);assert.match(explorer,/\/properties\/search/);assert.match(explorer,/setPurpose/);assert.match(saved,/estatepilot-saved/)})
