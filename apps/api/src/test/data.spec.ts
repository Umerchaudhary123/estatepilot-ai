import assert from 'node:assert/strict'
import test from 'node:test'
import { appointments, leads, properties } from '@estatepilot/shared'

test('portfolio seed covers all core marketplace flows',()=>{assert.equal(properties.length,50);assert.ok(properties.some((p)=>p.purpose==='buy'));assert.ok(properties.some((p)=>p.purpose==='rent'));assert.ok(properties.some((p)=>p.type==='plot'));assert.ok(properties.some((p)=>p.type==='commercial'));assert.ok(leads.length>=20);assert.ok(appointments.length>=12)})
