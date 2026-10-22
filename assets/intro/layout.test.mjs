import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { sequences, advance, restore } from './core.js';

const source = readFileSync(new URL('./IntroView-v2.js', import.meta.url), 'utf8');
const mountSource = source.slice(source.indexOf('function mountCourse('));

test('typing and pausing never rebuild the introduction title or navigation', () => {
  const windowEvents = new Map(), rootEvents = new Map();
  const storage = new Map([['cybertype-intro:layout-test', JSON.stringify({
    version: 2, step: 2, unlocked: 3, index: 0, checks: Array(4).fill(true), hands: false
  })]]);
  let frameWrites = 0, panelWrites = 0;
  const buttons = Array.from({ length: 6 }, (_, step) => ({
    dataset: { step: String(step) }, disabled: false, attrs: {}, marker: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    querySelector() { return this.marker; }
  }));
  const panel = { set innerHTML(value) { panelWrites++; this.html = value; } };
  const root = {
    set innerHTML(value) { frameWrites++; this.html = value; },
    querySelector: selector => selector === '.intro-panel' ? panel : null,
    querySelectorAll: () => buttons,
    addEventListener: (name, handler) => rootEvents.set(name, handler),
    removeEventListener: name => rootEvents.delete(name),
    focus() {}, contains: () => true
  };
  const sandbox = {
    sequences, advance, restore,
    labels: ['坐姿准备', '双手归位', '基准键练习', '小练习', '基准键周边', '基准键周边键'],
    descriptions: Array(6).fill('说明'),
    trackHands: () => ({ update() {}, dispose() {} }),
    keyboard: key => `<span>${key}</span>`, handsSwitch: () => '',
    display: key => key.toUpperCase(), fingers: { f: '左手食指', j: '右手食指' },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    window: { addEventListener: (name, handler) => windowEvents.set(name, handler), removeEventListener: name => windowEvents.delete(name) },
    document: { addEventListener() {}, removeEventListener() {} }
  };
  const mount = vm.runInNewContext(`${mountSource};mountCourse`, sandbox);
  const dispose = mount(root, 'layout-test');
  const click = data => {
    const button = { dataset: data };
    rootEvents.get('click')({ target: { closest: selector => selector === '.surround-course' ? null : button } });
  };
  try {
    assert.equal(frameWrites, 1);
    assert.match(root.html, /从坐姿到基准键/);
    assert.doesNotMatch(root.html, /<link\b/);
    click({ action: 'resume' });
    for (const key of 'fjfj') windowEvents.get('keydown')({ key, target: { closest: () => null }, preventDefault() {} });
    windowEvents.get('blur')();
    click({ action: 'resume' });
    click({ step: '3' });
    assert.ok(panelWrites >= 8);
    assert.equal(frameWrites, 1);
    assert.equal(JSON.parse(storage.get('cybertype-intro:layout-test')).step, 3);
    assert.equal(buttons[3].attrs['aria-current'], 'step');
  } finally { dispose(); }
});
