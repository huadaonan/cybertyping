export const GUIDED_TARGETS = 16;
export const INDEPENDENT_TARGETS = 24;
export const MASTERY_ACCURACY = 0.9;

/** Pair the same fingers on both hands, introducing one target at a time. */
export const lessons = [
  { name: '食指基础拓展', areas: [
    { finger: '左手食指', home: 'f', keys: [{ key: 'r', direction: '向上' }, { key: 'v', direction: '向下' }] },
    { finger: '右手食指', home: 'j', keys: [{ key: 'u', direction: '向上' }, { key: 'm', direction: '向下' }] }
  ] },
  { name: '中指拓展', areas: [
    { finger: '左手中指', home: 'd', keys: [{ key: 'e', direction: '向上' }, { key: 'c', direction: '向下' }] },
    { finger: '右手中指', home: 'k', keys: [{ key: 'i', direction: '向上' }, { key: ',', direction: '向下' }] }
  ] },
  { name: '无名指拓展', areas: [
    { finger: '左手无名指', home: 's', keys: [{ key: 'w', direction: '向上' }, { key: 'x', direction: '向下' }] },
    { finger: '右手无名指', home: 'l', keys: [{ key: 'o', direction: '向上' }, { key: '.', direction: '向下' }] }
  ] },
  { name: '小指拓展', areas: [
    { finger: '左手小指', home: 'a', keys: [{ key: 'q', direction: '向上' }, { key: 'z', direction: '向下' }] },
    { finger: '右手小指', home: ';', keys: [{ key: 'p', direction: '向上' }, { key: '/', direction: '向下' }] }
  ] },
  { name: '食指进一步拓展', areas: [
    { finger: '左手食指', home: 'f', keys: [{ key: 'g', direction: '向右' }, { key: 't', direction: '向右上方' }, { key: 'b', direction: '向右下方' }] },
    { finger: '右手食指', home: 'j', keys: [{ key: 'h', direction: '向左' }, { key: 'y', direction: '向左上方' }, { key: 'n', direction: '向左下方' }] }
  ] }
];

/** The first extension teaches the original ten single-hand lessons. */
export const singleLessons = lessons.flatMap(lesson => lesson.areas.map(area => ({
  name: lesson.name.replace(/食指|中指|无名指|小指/, area.finger.replace('手', '')),
  areas: [area]
})));

/** Return short exercises with no implicit spacebar or compulsory home-key presses. */
export function sequence(lessonIndex, phase, curriculum = lessons) {
  const { areas } = curriculum[lessonIndex];
  const keys = areas.flatMap(area => area.keys.map(({ key }) => key));
  if (phase === 0) return keys.join('');
  if (phase === 1) return areas.map(area => area.keys.map(({ key }) => area.home + key).join('').repeat(4).slice(0, GUIDED_TARGETS / areas.length)).join('');
  return (keys.join('') + areas.map(area => area.home).join('') + [...keys].reverse().join('') + areas.map(area => area.home).reverse().join('')).repeat(4).slice(0, INDEPENDENT_TARGETS);
}

/** A reloaded unfinished step restarts its short exercise, without losing finished lessons. */
export function startSession(lesson, phase) {
  return { lesson, phase, index: 0, correct: 0, missed: false, errors: 0, hint: false };
}

/** Only the first attempt at a target earns accuracy credit; corrections still advance. */
export function typeKey(session, event, curriculum = lessons) {
  if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.key?.length !== 1) return session;
  const target = sequence(session.lesson, session.phase, curriculum)[session.index];
  if (!target) return session;
  if (event.key.toLowerCase() !== target) return { ...session, missed: true, errors: session.errors + 1, hint: session.hint || session.errors >= 1 };
  return { ...session, index: session.index + 1, correct: session.correct + (session.missed ? 0 : 1), missed: false, errors: 0, hint: false };
}

/** Read only validated per-player progress, never executable or arbitrary saved fields. */
export function restoreProgress(raw, curriculum = lessons) {
  const initial = { lesson: 0, phase: -1, results: curriculum.map(() => null) };
  try {
    const saved = JSON.parse(raw);
    if (!saved || !Number.isInteger(saved.lesson) || saved.lesson < 0 || saved.lesson >= curriculum.length ||
        !Number.isInteger(saved.phase) || saved.phase < -1 || saved.phase > 3 ||
        !Array.isArray(saved.results) || saved.results.length !== curriculum.length ||
        !saved.results.every(result => result === null || (result && Number.isInteger(result.correct) && result.correct >= 0 && result.correct <= INDEPENDENT_TARGETS && typeof result.mastered === 'boolean')) ||
        (saved.phase === 3 && !saved.results[saved.lesson])) return initial;
    return { lesson: saved.lesson, phase: saved.phase, results: saved.results.map(result => result && { correct: result.correct, mastered: result.mastered }) };
  } catch { return initial; }
}

/** Finishing always permits continuation; an earlier mastery badge survives a retry. */
export function completeLesson(progress, correct) {
  return { ...progress, phase: 3, results: progress.results.map((result, index) => index === progress.lesson ? { correct, mastered: correct / INDEPENDENT_TARGETS >= MASTERY_ACCURACY || result?.mastered === true } : result) };
}
