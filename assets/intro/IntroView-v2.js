import { f as h, y as players } from '../index-9d92e3d2-r2.js';
import { sequences, advance, restore } from './core.js';
import { display, fingers, hands, handsSwitch, keyboard, trackHands } from './visuals.js';
import { mountSurrounding } from './SurroundingCourse.js';

const labels = ['坐姿准备', '双手归位', '基准键练习', '小练习', '基准键周边', '基准键周边键'];
const descriptions = ['调整好舒服的坐姿', '让手指找到基准位置', '从食指向小指逐个练习', '用短组合巩固指法', '10 小节，逐个手指练习', '5 小节，左右手合练'];

export default {
  name: 'IntroView',
  computed: { playerId() { return players().currentId; } },
  watch: {
    playerId() {
      this.disposeIntro?.();
      this.disposeIntro = mountCourse(this.$el, this.playerId);
    }
  },
  render() { return h('section', {class:'intro-course', tabindex:-1}); },
  mounted() { this.disposeIntro = mountCourse(this.$el, this.playerId); },
  beforeUnmount() { this.disposeIntro?.(); }
};

function mountCourse(root, playerId) {
  const storageKey = `cybertype-intro:${playerId}`;
  let state;
  try { state = restore(localStorage.getItem(storageKey)); } catch { state = restore(null); }
  let paused = state.step > 0 && state.step < 4;
  let feedback = '照着提示轻按一次，慢慢来。';
  let wrong = '';
  let disposeSurrounding;
  const handAlignment = trackHands(root);
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { feedback = '浏览器无法保存进度，本次仍可继续练习。'; }
  };
  const move = step => {
    state.step = step;
    state.index = 0;
    state.unlocked = Math.max(step, state.unlocked);
    paused = false;
    wrong = '';
    feedback = '照着提示轻按一次，慢慢来。';
    save(); render(); root.focus({preventScroll:true});
  };
  function render() {
    disposeSurrounding?.();
    disposeSurrounding = undefined;
    const key = sequences[state.step]?.[state.index] ?? 'f';
    root.innerHTML = `<link rel="stylesheet" href="/assets/intro/intro.css"><link rel="stylesheet" href="/assets/intro/surrounding.css">
      <header class="intro-heading"><div><p class="intro-eyebrow">FIRST CONTACT / 指法训练</p><h1>新手入门</h1><p>从坐姿到基准键，再认识周边键，一步一步练习。</p></div><a href="#/">返回首页 ↗</a></header>
      <div class="intro-layout"><aside class="intro-sidebar"><nav class="intro-steps" aria-label="入门教学步骤">${labels.map((label,i) => `<button data-step="${i}" ${i>state.unlocked?'disabled':''} aria-current="${i===state.step?'step':'false'}"><span>${(i===4?state.surroundingComplete:i<state.unlocked)?'✓':i+1}</span><div><strong>${label}</strong><small>${descriptions[i]}</small></div></button>`).join('')}</nav><div class="intro-sidebar-note"><p>肩膀放松，手腕自然。<br>先按准，再慢慢练熟。</p><a href="#/placement">暂时跳过</a></div></aside>
      <div class="intro-panel">${state.step === 0 ? `
        <h2>先调整好舒服的坐姿</h2><p>调整完成后逐项确认，再开始放置双手。练习间隙也记得活动一下。</p>
        <div class="intro-posture"><svg viewBox="0 0 360 240" role="img" aria-label="坐姿与桌椅位置的侧视示意"><path d="M30 145H320M280 145V230M110 125V195H170M110 195V230M100 195H155" fill="none" stroke="#52737b" stroke-width="6"/><circle cx="145" cy="45" r="22" fill="#00ffcc"/><path d="M140 73L130 135L180 155L180 220H220M140 90L180 125H235" fill="none" stroke="#00ffcc" stroke-width="12" stroke-linecap="round"/><path d="M245 70H310V115H245ZM278 115V142" fill="none" stroke="#b18bfa" stroke-width="4"/><text x="20" y="25" fill="#acc3d2" font-size="14">肩膀放松 · 手腕自然 · 双脚有支撑</text></svg>
        <div>${['肩膀放松，上臂自然靠近身体','手腕与前臂自然成一直线','背部有支撑，双脚平放或使用脚踏','键盘靠近身体，手指自然弯曲'].map((text,i) => `<label><input type="checkbox" data-check="${i}" ${state.checks[i]?'checked':''}>${text}</label>`).join('')}</div></div>
        <p class="intro-note">坐姿由你确认，调整到舒服即可。</p><button class="intro-primary" data-action="start" ${state.checks.every(Boolean)?'':'disabled'}>坐姿已准备好，开始归位 →</button>
      ` : state.step >= 4 ? `
        <div class="surround-course" tabindex="-1"></div>
      ` : `
        <h2>${['','让双手找到自己的位置','让每根手指记住自己的位置','把基准键连起来，试一小段'][state.step]}</h2>
        <div class="intro-explanation"><p class="intro-instruction">${fingers[key]}${state.step===1?'放在':'按'} <strong>${display(key)}</strong>${state.step===1?' 上，轻按一次 '+display(key):'，其他手指轻放在基准位'}</p>
        <p class="intro-note">${state.step===1?'F 和 J 的凸点，是双手的定位点。':'松开按键后再继续，不需要追求速度。'}</p></div>
        ${state.step>1?`<div class="intro-sequence" aria-label="本阶段练习内容">${[...sequences[state.step]].map((ch,i) => `<span class="${i<state.index?'done':i===state.index?'current':''}">${ch===' '?'␣':ch.toUpperCase()}</span>`).join('')}</div>`:''}
        <div class="intro-practice with-hands">${keyboard(key, {wrong})}${state.hands?hands():''}${paused?'<div class="intro-overlay"><h2>练习已暂停</h2><button class="intro-primary" data-action="resume">继续练习</button></div>':''}</div>
        <p class="intro-legend">左手 <b>A S D F</b>　右手 <b>J K L ;</b>　拇指 <b>空格</b></p>
        <p class="intro-note">请照图摆放手指，按键反馈只确认按下的键。</p>
        <p class="intro-feedback" role="status" aria-live="polite">${feedback}</p>
        <footer class="intro-controls"><button data-action="back">上一步</button><button data-action="${paused?'resume':'pause'}">${paused?'继续练习':'暂停练习'}</button>${handsSwitch(state.hands)}<span>${paused?'已暂停':`等待按 ${display(key)} · ${state.index+1}/${sequences[state.step].length}`}</span></footer>
      `}</div></div>`;
    if (state.step >= 4) disposeSurrounding = mountSurrounding(root.querySelector('.surround-course'), playerId, {
      single: state.step === 4,
      showHands: state.hands,
      onHandsChange: visible => { state.hands = visible; save(); },
      onComplete: () => {
        state.unlocked = 5;
        if (state.step === 4) state.surroundingComplete = true;
        save();
        root.querySelector('[data-step="5"]').disabled = false;
        if (state.step === 4) root.querySelector('[data-step="4"]>span').textContent = '✓';
      },
      onContinue: () => move(5)
    });
    handAlignment.update();
  }
  const click = event => {
    if (event.target.closest('.surround-course')) return;
    const button = event.target.closest('button');
    if (!button || !root.contains(button) || button.disabled) return;
    if (button.dataset.step !== undefined) { move(Number(button.dataset.step)); return; }
    switch (button.dataset.action) {
      case 'start': if (state.checks.every(Boolean)) move(1); return;
      case 'back': move(state.step-1); return;
      case 'retry': move(2); return;
      case 'hands': state.hands = !state.hands; save(); break;
      case 'pause': paused = true; break;
      case 'resume': paused = false; break;
    }
    render(); root.focus({preventScroll:true});
  };
  const change = event => {
    if (event.target.dataset.check === undefined) return;
    state.checks[Number(event.target.dataset.check)] = event.target.checked;
    save();
    root.querySelector('[data-action="start"]').disabled = !state.checks.every(Boolean);
  };
  const keydown = event => {
    if (state.step<1 || state.step>3 || paused || event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,button,a,[contenteditable="true"]')) return;
    if (event.key==='Escape') { paused = true; render(); return; }
    if (event.key.length!==1) return;
    event.preventDefault();
    const key = sequences[state.step][state.index];
    const next = advance(state.step, state.index, event);
    if (next === state.index) {
      wrong = Object.hasOwn(fingers,event.key.toLowerCase()) ? event.key.toLowerCase() : '';
      feedback = `再试一次，用${fingers[key]}轻按 ${display(key)}。按错无需退格。`;
    } else {
      wrong = '';
      feedback = `对了，${fingers[key]}负责 ${display(key)}。`;
      state.index = next;
      if (next === sequences[state.step].length) { move(state.step+1); return; }
      save();
    }
    render();
  };
  const blur = () => { if (state.step>0 && state.step<4) { paused = true; render(); } };
  const visibility = () => { if (document.hidden) blur(); };
  root.addEventListener('click',click);
  root.addEventListener('change',change);
  window.addEventListener('keydown',keydown);
  window.addEventListener('blur',blur);
  document.addEventListener('visibilitychange',visibility);
  render(); root.focus({preventScroll:true});
  return () => {
    disposeSurrounding?.();
    handAlignment.dispose();
    root.removeEventListener('click',click);
    root.removeEventListener('change',change);
    window.removeEventListener('keydown',keydown);
    window.removeEventListener('blur',blur);
    document.removeEventListener('visibilitychange',visibility);
  };
}
