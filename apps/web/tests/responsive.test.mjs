import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css=await readFile(new URL('../src/app/globals.css',import.meta.url),'utf8')
test('mobile and tablet layouts are explicitly covered',()=>{assert.match(css,/@media \(max-width: 820px\)/);assert.match(css,/@media \(max-width: 560px\)/);assert.match(css,/overflow-x: clip/)})
test('wide dashboard data remains accessible by scrolling',()=>{assert.match(css,/\.table-wrap \{ overflow-x: auto/);assert.match(css,/\.kanban \{[^}]*overflow-x: auto/s)})
