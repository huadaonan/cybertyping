import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sequences, advance, restore } from './core.js';

test('course has the observed 9, 18 and 45 key sequences', () => {
  assert.deepEqual(sequences.map(s => s.length), [0, 9, 18, 45]);
});
test('wrong keys, repeats and composition never advance', () => {
  assert.deepEqual(['x', 'f', 'f'].map((key, i) => advance(1, 0, {key, repeat: i === 1, isComposing: i === 2})), [0, 0, 0]);
});
test('correct final key advances exactly to sequence end', () => {
  assert.equal(advance(1, 8, {key: ' '}), 9);
});
test('invalid saved progress safely resets', () => {
  assert.deepEqual(restore('{"step":9,"index":-1}'), {version:2,step:0,index:0,unlocked:0,checks:[false,false,false,false],hands:true,surroundingComplete:false});
});
test('valid progress survives reload with checked posture', () => {
  assert.equal(restore(JSON.stringify({step:2,index:7,unlocked:2,checks:[true,true,true,true],hands:false})).index, 7);
});
test('adding the single-hand stage keeps existing paired-course access', () => {
  const restored = restore(JSON.stringify({ step: 4, index: 0, unlocked: 4, checks: [true, true, true, true], hands: true }));
  assert.deepEqual([restored.version, restored.step, restored.unlocked], [2, 5, 5]);
});
test('new introductory progress restores either extension without migrating twice', () => {
  assert.deepEqual([4, 5].map(step => restore(JSON.stringify({ version: 2, step, index: 0, unlocked: 5, checks: [true, true, true, true], hands: false })).step), [4, 5]);
});
