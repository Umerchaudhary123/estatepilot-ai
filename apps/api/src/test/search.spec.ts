import assert from 'node:assert/strict'
import test from 'node:test'
import { deterministicIntent } from '../services/estate.service.js'

test('extracts Pakistan rental intent without an AI key',()=>{assert.deepEqual(deterministicIntent('Islamabad mein furnished 2 bedroom apartment monthly rent'),{city:'islamabad',purpose:'rent',bedrooms:2,furnished:true})})
test('extracts Lahore buy intent',()=>{assert.deepEqual(deterministicIntent('buy 5 bedroom house Lahore'),{city:'lahore',purpose:'buy',bedrooms:5,furnished:undefined})})
