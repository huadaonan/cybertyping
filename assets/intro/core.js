/** Observed lesson sequences; spaces are physical spacebar presses. */
export const sequences = ['', 'fjasdkl; ', 'fjfjdkdkslsla;a;  ', 'ff jj dd kk ss ll aa ;; fj dk sl a; asdf jkl;'];

/** Advance only on a fresh, matching keydown from a Latin input method. */
export function advance(step, index, event) {
  if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return index;
  return event.key?.toLowerCase() === sequences[step]?.[index] ? index + 1 : index;
}

/** Restore only bounded course data; malformed browser data starts a new course. */
export function restore(raw) {
  const initial = {step:0,index:0,unlocked:0,checks:[false,false,false,false],hands:true};
  try {
    const saved = JSON.parse(raw);
    if (!saved || !Number.isInteger(saved.step) || saved.step < 0 || saved.step > 4 ||
        !Number.isInteger(saved.unlocked) || saved.unlocked < saved.step || saved.unlocked > 4 ||
        !Number.isInteger(saved.index) || saved.index < 0 || saved.index > (sequences[saved.step]?.length ?? 0) ||
        !Array.isArray(saved.checks) || saved.checks.length !== 4 || !saved.checks.every(v => typeof v === 'boolean') ||
        (saved.step > 0 && !saved.checks.every(Boolean))) return initial;
    return {...initial, ...saved, hands:saved.hands !== false};
  } catch { return initial; }
}
