import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons, singleLessons, sequence, startSession, typeKey, restoreProgress, completeLesson } from './surrounding.js';

test('ten introductory lessons train one hand at a time before the paired course', () => {
  assert.deepEqual(singleLessons.map(lesson => lesson.areas.map(area => area.home)), [['f'], ['j'], ['d'], ['k'], ['s'], ['l'], ['a'], [';'], ['f'], ['j']]);
});

test('both curricula cover all new keys in every step with the same short exercise lengths', () => {
  assert.ok([lessons, singleLessons].every(curriculum => curriculum.every((lesson, index) => [0, 1, 2].every(phase => {
    const text = sequence(index, phase, curriculum);
    return text.length === (phase === 0 ? lesson.areas.flatMap(area => area.keys).length : phase === 1 ? 16 : 24) &&
      lesson.areas.every(area => area.keys.every(({ key }) => text.includes(key)));
  }))));
});

test('single-hand progress can restore lesson ten without accepting it in the paired course', () => {
  const saved = JSON.stringify({ lesson: 9, phase: 2, results: Array(10).fill(null) });
  assert.deepEqual([restoreProgress(saved, singleLessons).lesson, restoreProgress(saved).phase], [9, -1]);
});

test('single-hand input advances against its own curriculum', () => {
  assert.equal(typeKey(startSession(1, 0), { key: 'u' }, singleLessons).index, 1);
});

test('five lessons pair the same fingers on both hands in the requested order', () => {
  assert.deepEqual(lessons.map(lesson => lesson.areas.map(area => area.home)), [['f', 'j'], ['d', 'k'], ['s', 'l'], ['a', ';'], ['f', 'j']]);
});

test('paired lessons cover every non-home letter and the three lower punctuation keys once', () => {
  assert.deepEqual(lessons.flatMap(lesson => lesson.areas.flatMap(area => area.keys.map(({ key }) => key))).sort(), [...'qwertyuiopzxcvbnmgh,./'].sort());
});

test('guided and independent exercises stay within the current pair of finger areas', () => {
  assert.ok(lessons.every((lesson, index) => sequence(index, 1).length === 16 &&
    sequence(index, 2).length === 24 &&
    [...sequence(index, 1), ...sequence(index, 2)].every(key => lesson.areas.some(area => key === area.home || area.keys.some(item => item.key === key)))));
});

test('each step practises every new key and gives both hands equal coverage', () => {
  assert.ok(lessons.every((lesson, index) => [0, 1, 2].every(phase => {
    const text = sequence(index, phase);
    return lesson.areas.every(area => area.keys.every(({ key }) => text.includes(key))) &&
      lesson.areas.map(area => [...text].filter(key => key === area.home || area.keys.some(item => item.key === key)).length).every(count => count === text.length / 2);
  })));
});

test('independent practice includes consecutive new keys without a compulsory home key', () => {
  assert.ok(lessons.every((lesson, index) => lesson.areas.every(area => sequence(index, 2).includes(area.keys.map(({ key }) => key).join('')))));
});

test('holding a key, composition and shortcuts cannot complete a target', () => {
  const session = startSession(0, 0);
  assert.deepEqual([
    { key: 'r', repeat: true }, { key: 'r', isComposing: true },
    { key: 'r', ctrlKey: true }, { key: 'r', metaKey: true }, { key: 'r', altKey: true }
  ].map(event => typeKey(session, event)), Array(5).fill(session));
});

test('two mistakes reveal the hint while a correction cannot restore first-try credit', () => {
  const session = startSession(0, 2);
  const once = typeKey(session, { key: 'x' });
  const twice = typeKey(once, { key: 'x' });
  const corrected = typeKey(twice, { key: sequence(0, 2)[0].toUpperCase() });
  assert.deepEqual([once.index, once.hint, twice.hint, corrected.index, corrected.correct, corrected.missed, corrected.hint], [0, false, true, 1, 0, false, false]);
});

test('a corrected run records its real accuracy, permits continuation and preserves earlier mastery', () => {
  const progress = restoreProgress(null);
  const mastered = completeLesson(progress, 22);
  const retried = completeLesson(mastered, 20);
  assert.deepEqual([mastered.phase, mastered.results[0], retried.results[0]], [3, { correct: 22, mastered: true }, { correct: 20, mastered: true }]);
});

test('a completed lesson below 90 percent is marked for review', () => {
  assert.deepEqual(completeLesson(restoreProgress(null), 21).results[0], { correct: 21, mastered: false });
});

test('saved progress is isolated, bounded and discards unknown properties', () => {
  const progress = completeLesson({ ...restoreProgress(null), lesson: 4 }, 23);
  assert.deepEqual(restoreProgress(JSON.stringify({ ...progress, phase: 2, index: 17, extra: '<script>' })), { ...progress, phase: 2 });
});

test('corrupt data and an unfinished summary safely return to the course list', () => {
  const initial = restoreProgress(null);
  assert.deepEqual(['invalid', '{"lesson":99}', JSON.stringify({ ...initial, phase: 3 }),
    JSON.stringify({ ...initial, results: [{ correct: 50, mastered: true }, ...initial.results.slice(1)] })
  ].map(raw => restoreProgress(raw)), Array(4).fill(initial));
});
