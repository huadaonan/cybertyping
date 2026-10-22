import { lessons } from './surrounding.js';
import { K as rows, F as colours } from '../keyLayout-C2ezFcAu.js';

export const fingers = { a: '左手小指', s: '左手无名指', d: '左手中指', f: '左手食指', j: '右手食指', k: '右手中指', l: '右手无名指', ';': '右手小指', ' ': '大拇指', ...Object.fromEntries(lessons.flatMap(lesson => lesson.areas.flatMap(area => area.keys.map(({ key }) => [key, area.finger])))) };
export const display = key => key === ' ' ? '空格' : key.toUpperCase();

/** Both exercises use the same keyboard and finger illustrations. */
export function hands() {
  return '<div class="intro-hands" aria-label="双手指法示意"><img class="intro-left-hand" src="/assets/intro/hands.png" alt="左手小指、无名指、中指、食指对应 A S D F。"><img class="intro-right-hand" src="/assets/intro/hands.png" alt="右手食指、中指、无名指、小指对应 J K L 分号，拇指靠近空格。"></div>';
}

export function handsSwitch(visible) {
  return `<button type="button" class="intro-hands-switch" data-action="hands" role="switch" aria-checked="${visible}" aria-label="显示手形"><span class="intro-switch-track" aria-hidden="true"><span></span></span>显示手形</button>`;
}

// Fingertip centres in the original 1860 × 846 artwork, ordered by home key.
export const handLandmarks = {
  left: [['a', 335, 159], ['s', 453, 77], ['d', 587, 56], ['f', 723, 81]],
  right: [['j', 1137, 81], ['k', 1273, 56], ['l', 1407, 77], [';', 1525, 159]]
};

/** Fit a whole hand to all four keys without stretching individual fingers. */
export function fitHand(source, target) {
  const mean = points => points.reduce((sum, point) => [sum[0] + point[0] / points.length, sum[1] + point[1] / points.length], [0, 0]);
  const [sx, sy] = mean(source);
  const [tx, ty] = mean(target);
  let scale = 0, turn = 0, distance = 0;
  source.forEach(([x, y], index) => {
    const dx = x - sx, dy = y - sy;
    const ux = target[index][0] - tx, uy = target[index][1] - ty;
    scale += dx * ux + dy * uy;
    turn += dx * uy - dy * ux;
    distance += dx * dx + dy * dy;
  });
  const a = scale / distance, b = turn / distance;
  return [a, b, -b, a, tx - a * sx + b * sy, ty - b * sx - a * sy];
}

/** Re-measure real key positions after rendering and whenever the layout resizes. */
export function trackHands(root) {
  let frame;
  const align = () => {
    frame = undefined;
    root.querySelectorAll('.intro-practice').forEach(stage => {
      const bounds = stage.getBoundingClientRect();
      for (const [side, points] of Object.entries(handLandmarks)) {
        const image = stage.querySelector(`.intro-${side}-hand`);
        if (!image) continue;
        const keys = points.map(([key]) => stage.querySelector(`[data-key="${key}"]`));
        if (keys.some(key => !key)) continue;
        const targets = keys.map(key => {
          const rect = key.getBoundingClientRect();
          return [rect.left + rect.width / 2 - bounds.left - stage.clientLeft, rect.top + rect.height / 2 - bounds.top - stage.clientTop];
        });
        const matrix = fitHand(points.map(([, x, y]) => [x, y]), targets);
        image.style.transform = `matrix(${matrix.join(',')})`;
        image.style.visibility = 'visible';
      }
    });
  };
  const update = () => {
    if (frame === undefined) frame = requestAnimationFrame(align);
  };
  const observer = new ResizeObserver(update);
  observer.observe(root);
  return { update, dispose() { observer.disconnect(); if (frame !== undefined) cancelAnimationFrame(frame); } };
}

export function keyboard(key, { wrong = '', home = '' } = {}) {
  return `<div class="intro-keyboard" aria-label="键盘指法示意">${rows.map(row => `<div class="intro-keyrow">${row.map(item => `<span data-key="${item.code}" class="intro-key ${item.code === key ? 'target' : ''} ${item.code === home ? 'home' : ''} ${item.code === wrong ? 'wrong' : ''} ${item.code === 'f' || item.code === 'j' ? 'anchor' : ''}" style="flex:${item.width};--finger-colour:${colours[item.finger]}">${item.label}</span>`).join('')}</div>`).join('')}</div>`;
}
