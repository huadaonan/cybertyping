import { lessons, singleLessons, sequence, startSession, typeKey, firstAttemptFeedback, restoreProgress, completeLesson, INDEPENDENT_TARGETS, MASTERY_ACCURACY } from './surrounding.js';
import { display, hands, handsSwitch, keyboard, trackHands } from './visuals.js';
import { createReactions } from './reactions.js';

/** Mount the home-key extension inside the existing introduction, scoped to one player. */
export function mountSurrounding(root, playerId, { single = false, showHands = true, onHandsChange, onComplete, onContinue } = {}) {
  const curriculum = single ? singleLessons : lessons;
  const title = single ? '基准键周边' : '基准键周边键';
  root.dataset.curriculum = single ? 'single' : 'paired';
  const storageKey = `cybertype-intro-surrounding${single ? "-single" : "-v2"}:${playerId}`;
  let progress;
  try { progress = restoreProgress(localStorage.getItem(storageKey), curriculum); } catch { progress = restoreProgress(null, curriculum); }
  let session = startSession(progress.lesson, progress.phase);
  let paused = progress.phase >= 0 && progress.phase < 3;
  let feedback = '慢慢来，先按准就很好。';
  let wrong = '';
  let storageFailed = false;
  const handAlignment = trackHands(root);
  const reactions = createReactions();

  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); }
    catch { storageFailed = true; }
  };
  const go = (lesson, phase) => {
    const enteringLesson = lesson !== progress.lesson || progress.phase < 0 || progress.phase > 2;
    reactions.clear();
    progress = { ...progress, lesson, phase };
    session = startSession(lesson, phase);
    paused = false;
    wrong = '';
    feedback = phase === 1 ? '认识新键了！现在跟着提示练一小段。' : phase === 2 ? '现在自己试试，找不到时可以点“提示”。' : '慢慢来，先按准就很好。';
    save();
    render();
    if (phase < 0 || (phase === 0 && enteringLesson)) root.closest('.intro-course').scrollIntoView({ block: 'start' });
    root.focus({ preventScroll: true });
  };

  function render() {
    root.dataset.view = progress.phase >= 0 && progress.phase < 3 ? 'practice' : 'overview';
    const lesson = curriculum[progress.lesson];
    const completed = progress.results.filter(Boolean).length;
    const recommended = progress.results.findIndex(result => !result);
    const review = progress.results.findIndex(result => result && !result.mastered);
    const nextLesson = recommended >= 0 ? recommended : review >= 0 ? review : 0;
    root.innerHTML = progress.phase === -1 ? `
      <div class="surround-heading"><div><p class="intro-eyebrow">从基准键出发 / 每课一小步</p><h2>${title}</h2><p>手指从熟悉的位置出发，按完新键再回家。</p></div><span class="surround-count">已完成 ${completed} / ${curriculum.length} 课</span></div>
      <div class="surround-start"><p>每节三步：认识新键 → 跟着练 → 自己试试。先按准，不比速度。</p><button class="intro-primary" data-lesson="${nextLesson}">${completed === 0 ? '开始' : recommended >= 0 ? '继续' : review >= 0 ? '复习' : '再练'}第 ${nextLesson + 1} 课：${curriculum[nextLesson].name} →</button></div>
      <div class="surround-lessons" aria-label="周边键课程">${curriculum.map((item, index) => {
        const result = progress.results[index];
        return `<button class="surround-lesson ${index === nextLesson ? 'recommended' : ''}" data-lesson="${index}"><span class="surround-lesson-number">${index + 1}</span><strong>${item.name}</strong><span class="surround-lesson-keys">${item.areas.map(area => `<span>${display(area.home)} → ${area.keys.map(({ key }) => display(key)).join(' · ')}</span>`).join('')}</span><span class="surround-badge ${result?.mastered ? 'mastered' : ''}">${result ? result.mastered ? '✓ 已掌握' : '已完成 · 建议复习' : index === nextLesson ? '从这里开始' : '未练习'}</span></button>`;
      }).join('')}</div>
      <p class="intro-note">进度会按当前玩家保存。你可以选择任意一课，也可以随时回来重练。</p>
      <a class="surround-placement" href="#/placement">进入定级赛 →</a>
    ` : progress.phase === 3 ? `
      <div class="intro-complete surround-summary"><p class="intro-eyebrow">${completed === curriculum.length ? `${curriculum.length} 节短课都完成了` : `第 ${progress.lesson + 1} 课完成`}</p><h2>又记住了一组新键！</h2><p>${lesson.name} · ${lesson.areas.flatMap(area => area.keys.map(({ key }) => display(key))).join(' / ')}</p><div class="surround-score"><strong>${Math.round(progress.results[progress.lesson].correct / INDEPENDENT_TARGETS * 100)}<small>%</small></strong><span>自己试试 · 首次按对率</span></div><p>${progress.results[progress.lesson].correct / INDEPENDENT_TARGETS >= MASTERY_ACCURACY ? '按得很稳，继续保持这个节奏。' : '这一课完成了！再练一次，会更熟悉。'}</p><p class="intro-note">${INDEPENDENT_TARGETS} 个目标中，${progress.results[progress.lesson].correct} 个第一次就按对。纠正按键不重复加分。</p><div class="surround-summary-actions">${progress.lesson < curriculum.length - 1 ? `<button class="intro-primary" data-lesson="${progress.lesson + 1}">继续下一课 →</button>` : single && completed === curriculum.length ? '<button class="intro-primary" data-action="continue">进入基准键周边键 →</button>' : '<button class="intro-primary" data-action="list">返回课程，看看进步 →</button>'}<button data-lesson="${progress.lesson}">再练一次</button>${progress.lesson < curriculum.length - 1 ? '<button data-action="list">返回课程</button>' : '<a href="#/placement">进入定级赛 →</a>'}</div></div>
    ` : (() => {
      const text = sequence(progress.lesson, progress.phase, curriculum);
      const preview = progress.phase === 0 ? sequence(progress.lesson, 1, curriculum) : text;
      const key = text[session.index];
      const area = lesson.areas.find(item => item.home === key || item.keys.some(target => target.key === key));
      const target = area.keys.find(item => item.key === key);
      const hint = progress.phase < 2 || session.hint;
      return `
        <div class="surround-heading"><div><p class="intro-eyebrow">第 ${progress.lesson + 1} / ${curriculum.length} 课 · 从 ${lesson.areas.map(item => display(item.home)).join(' / ')} 出发</p><h2>${lesson.name}</h2></div><button data-action="list">返回课程</button></div>
        <ol class="surround-phases" aria-label="本课练习步骤">${['认识新键', '跟着练', '自己试试'].map((name, index) => `<li ${index === progress.phase ? 'aria-current="step"' : ''} class="${index < progress.phase ? 'done' : ''}">${index < progress.phase ? '✓' : index + 1} · ${name}</li>`).join('')}</ol>
        <div class="surround-progress"><progress max="${text.length}" value="${session.index}" aria-label="本步骤完成进度"></progress><span>${session.index} / ${text.length}</span></div>
        <div class="surround-target"><span class="surround-target-label">${progress.phase === 0 ? '认识这个新键' : '现在按'}</span><strong>${display(key)}</strong><p class="intro-instruction">${hint ? target ? `${area.finger}${target.direction}，按 <b>${display(key)}</b>，松开后回到 <b>${display(area.home)}</b>` : `${area.finger}在基准位置轻按 <b>${display(key)}</b>` : '试着自己找到它，慢一点也没关系。'}</p><p class="intro-note">${hint ? '回位是手指回到原处，不需要额外敲一下基准键。' : '需要帮助时，点下面的“提示”。'}</p></div>
        <div class="surround-sequence-slot" ${progress.phase === 0 ? 'aria-hidden="true"' : ''}><div class="intro-sequence surround-sequence" aria-label="本步骤练习内容">${[...preview].map((ch, index) => `<span class="${index < session.index ? 'done' : index === session.index ? 'current' : ''}">${display(ch)}</span>`).join('')}</div><p class="intro-note">一格一个键，格子之间不用按空格。</p></div>
        ${progress.phase === 2 ? '<div class="surround-reaction-slot" data-reaction-slot></div>' : ''}
        <div class="intro-practice surround-practice ${hint ? 'with-hands' : ''}">${hint ? `${keyboard(key, { wrong, home: area.home })}${showHands ? hands() : ''}<p class="intro-note surround-key-legend">亮色是目标键 · 虚线框是基准键 · 按提示使用对应手指</p>` : '<div class="surround-no-hint">你已经认识这些键了，自己试一小段吧。<button data-action="hint">提示</button></div>'}${paused ? '<div class="intro-overlay"><h2>休息一下也很好</h2><button class="intro-primary" data-action="resume">继续练习</button></div>' : ''}</div>
        <p class="intro-feedback" role="status" aria-live="polite">${feedback}</p>
        <footer class="intro-controls"><button data-action="previous">上一步</button>${progress.phase === 2 && hint ? '<button data-action="hide-hint">收起提示</button>' : ''}<button data-action="${paused ? 'resume' : 'pause'}">${paused ? '继续练习' : '暂停练习'}</button>${hint ? handsSwitch(showHands) : ''}<span>照图使用手指，系统只确认按下的键。</span></footer>
      `;
    })();
    if (progress.phase === 3) root.insertAdjacentHTML('afterbegin', '<div class="surround-reaction-slot surround-reaction-summary" data-reaction-slot></div>');
    reactions.place(root.querySelector('[data-reaction-slot]'), {
      active: !paused && (progress.phase === 2 || progress.phase === 3),
      idle: progress.phase === 2
    });
    if (storageFailed) root.insertAdjacentHTML('beforeend', '<p class="intro-note" role="status">浏览器暂时无法保存进度，本次仍可继续练习。</p>');
    handAlignment.update();
  }

  const click = event => {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    event.stopPropagation();
    if (button.dataset.lesson !== undefined) { go(Number(button.dataset.lesson), 0); return; }
    switch (button.dataset.action) {
      case 'previous': go(progress.lesson, progress.phase - 1); return;
      case 'list': go(progress.lesson, -1); return;
      case 'continue': onContinue?.(); return;
      case 'hint': session.hint = true; break;
      case 'hide-hint': session.hint = false; break;
      case 'pause': paused = true; reactions.clear(); break;
      case 'resume': paused = false; break;
      case 'hands': showHands = !showHands; onHandsChange?.(showHands); break;
      default: return;
    }
    render();
    root.focus({ preventScroll: true });
  };
  const keydown = event => {
    if (progress.phase < 0 || progress.phase > 2 || paused || event.target.closest('input,textarea,select,button,a,[contenteditable="true"]')) return;
    if (event.key === 'Escape') { paused = true; reactions.clear(); render(); return; }
    const next = typeKey(session, event, curriculum);
    if (next === session) return;
    event.preventDefault();
    const reaction = firstAttemptFeedback(session, next);
    if (reaction) reactions.show(reaction);
    wrong = next.index === session.index ? event.key.toLowerCase() : '';
    feedback = next.index === session.index ? '再试一次，按错不用退格。' : '对了！松开按键，再继续。';
    session = next;
    if (session.index === sequence(progress.lesson, progress.phase, curriculum).length) {
      if (progress.phase < 2) { go(progress.lesson, progress.phase + 1); return; }
      progress = completeLesson(progress, session.correct);
      save();
      if (progress.results.every(Boolean)) onComplete?.();
    }
    render();
  };
  const blur = () => {
    if (progress.phase >= 0 && progress.phase < 3 && !paused) { paused = true; reactions.clear(); render(); }
  };
  const visibility = () => { if (document.hidden) blur(); };
  root.addEventListener('click', click);
  window.addEventListener('keydown', keydown);
  window.addEventListener('blur', blur);
  document.addEventListener('visibilitychange', visibility);
  render();
  if (progress.phase >= 0 && progress.phase < 3) root.closest('.intro-course').scrollIntoView({ block: 'start' });
  if (progress.results.every(Boolean)) onComplete?.();
  return () => {
    reactions.dispose();
    handAlignment.dispose();
    root.removeEventListener('click', click);
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('blur', blur);
    document.removeEventListener('visibilitychange', visibility);
  };
}
