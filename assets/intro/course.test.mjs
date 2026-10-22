import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSurrounding } from './SurroundingCourse.js';
import { lessons, singleLessons, sequence } from './surrounding.js';

function environment() {
  const original = Object.fromEntries(['window', 'document', 'localStorage', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const windowEvents = new Map(), rootEvents = new Map(), storage = new Map(), overlays = [];
  const element = () => ({
    innerHTML: '', hidden: false, removed: false, setAttribute() {},
    replaceChildren() { this.innerHTML = ''; }, remove() { this.removed = true; }
  });
  globalThis.window = { addEventListener: (name, callback) => windowEvents.set(name, callback), removeEventListener: name => windowEvents.delete(name) };
  globalThis.document = { hidden: false, createElement: () => { const node = element(); overlays.push(node); return node; }, addEventListener() {}, removeEventListener() {} };
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  globalThis.ResizeObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  const root = {
    dataset: {}, innerHTML: '', addEventListener: (name, callback) => rootEvents.set(name, callback), removeEventListener: name => rootEvents.delete(name),
    contains: () => true, querySelectorAll: () => [], querySelector: () => ({ append(node) { node.removed = false; } }), closest: () => ({ scrollIntoView() {} }), focus() {}, insertAdjacentHTML() {}
  };
  return {
    root, storage, overlays,
    click(data) { const button = { dataset: data }; rootEvents.get('click')({ target: { closest: () => button }, stopPropagation() {} }); },
    key(key, extra = {}) { windowEvents.get('keydown')({ key, target: { closest: () => null }, preventDefault() {}, ...extra }); },
    restore() { for (const [key, descriptor] of Object.entries(original)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } }
  };
}

test('all fifteen lessons have a previous button in each step and restart the preceding step from zero', () => {
  const env = environment();
  try {
    for (const [single, curriculum] of [[true, singleLessons], [false, lessons]]) {
      for (let lesson = 0; lesson < curriculum.length; lesson++) {
        const storageKey = `cybertype-intro-surrounding${single ? '-single' : '-v2'}:test`;
        for (const phase of [0, 1, 2]) {
          const results = curriculum.map((_, index) => index === lesson ? { correct: 24, mastered: true } : null);
          env.storage.set(storageKey, JSON.stringify({ lesson, phase, results }));
          const dispose = mountSurrounding(env.root, 'test', { single });
          try {
            assert.match(env.root.innerHTML, /<footer[^>]*><button data-action="previous">上一步<\/button>/);
            env.click({ action: 'resume' });
            env.key(sequence(lesson, phase, curriculum)[0]);
            env.click({ action: 'previous' });
            const saved = JSON.parse(env.storage.get(storageKey));
            assert.equal(saved.lesson, lesson);
            assert.equal(saved.phase, phase - 1);
            assert.deepEqual(saved.results, results);
            if (phase > 0) {
              assert.match(env.root.innerHTML, /<progress[^>]*value="0"/);
              assert.match(env.root.innerHTML, /data-action="pause"/);
            } else assert.equal(env.root.dataset.view, 'overview');
            assert.equal(env.overlays.at(-1).hidden, true);
          } finally { dispose(); }
        }
      }
    }
  } finally { env.restore(); }
});

test('self-test reactions ignore corrections, survive hints, and clear on pause, navigation and unmount', () => {
  const env = environment();
  try {
    for (const single of [true, false]) {
      const curriculum = single ? singleLessons : lessons;
      const key = `cybertype-intro-surrounding${single ? '-single' : '-v2'}:feedback-test`;
      env.storage.set(key, JSON.stringify({ lesson: 0, phase: 2, results: curriculum.map(() => null) }));
      const dispose = mountSurrounding(env.root, 'feedback-test', { single });
      const overlay = env.overlays.at(-1);
      try {
        env.click({ action: 'resume' });
        assert.equal(overlay.hidden, false);
        assert.match(overlay.innerHTML, /link-poses\.png/);
        assert.doesNotMatch(overlay.innerHTML, /正确，太帅了！|不太对，再试试！/);
        env.key('!');
        assert.match(overlay.innerHTML, /不太对，再试试！/);
        assert.equal(overlay.className, 'surround-reaction retry is-reacting');
        assert.equal(overlay.hidden, false);
        env.click({ action: 'hint' });
        assert.equal(overlay.hidden, false);
        env.key(sequence(0, 2, curriculum)[0]);
        assert.match(overlay.innerHTML, /不太对，再试试！/);
        env.key(sequence(0, 2, curriculum)[1]);
        assert.match(overlay.innerHTML, /正确，太帅了！/);
        assert.equal(overlay.className, 'surround-reaction correct is-reacting');
        env.click({ action: 'pause' });
        assert.equal(overlay.hidden, true);
        env.click({ action: 'resume' });
        env.key(sequence(0, 2, curriculum)[2], { repeat: true });
        assert.equal(overlay.hidden, false);
        assert.doesNotMatch(overlay.innerHTML, /正确，太帅了！|不太对，再试试！/);
        env.key(sequence(0, 2, curriculum)[2]);
        assert.equal(overlay.hidden, false);
        env.click({ action: 'previous' });
        assert.equal(overlay.hidden, true);
      } finally { dispose(); }
      assert.equal(overlay.removed, true);
    }
  } finally { env.restore(); }
});

test('Link is already visible on entering self-test and remains visible after its message expires', () => {
  const env = environment();
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const timers = new Map();
  let timerId = 0;
  globalThis.setTimeout = callback => { timers.set(++timerId, callback); return timerId; };
  globalThis.clearTimeout = id => timers.delete(id);
  try {
    for (const [single, curriculum] of [[true, singleLessons], [false, lessons]]) {
      const storageKey = `cybertype-intro-surrounding${single ? '-single' : '-v2'}:visible-test`;
      env.storage.set(storageKey, JSON.stringify({ lesson: 0, phase: 1, results: curriculum.map(() => null) }));
      const dispose = mountSurrounding(env.root, 'visible-test', { single });
      const image = env.overlays.at(-1);
      try {
        env.click({ action: 'resume' });
        for (const key of sequence(0, 1, curriculum)) env.key(key);
        assert.equal(JSON.parse(env.storage.get(storageKey)).phase, 2);
        assert.equal(image.hidden, false);
        assert.match(image.innerHTML, /link-poses\.png/);
        assert.match(env.root.innerHTML, /data-reaction-slot/);
        env.key(sequence(0, 2, curriculum)[0]);
        assert.match(image.innerHTML, /正确，太帅了！/);
        const callbacks = [...timers.values()];
        timers.clear();
        callbacks.forEach(callback => callback());
        assert.equal(image.hidden, false);
        assert.match(image.innerHTML, /link-poses\.png/);
        assert.doesNotMatch(image.innerHTML, /正确，太帅了！/);
        assert.doesNotMatch(image.className, /is-reacting/);
      } finally { dispose(); }
    }
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    env.restore();
  }
});
