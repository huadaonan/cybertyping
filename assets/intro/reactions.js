const messages = {
  correct: '正确，太帅了！',
  retry: '不太对，再试试！'
};

/** Inline feedback uses reserved practice space and never covers the typing controls. */
export function createReactions() {
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.href = '/assets/intro/link-poses.png';
  document.head?.append(preload);
  const overlay = document.createElement('div');
  overlay.className = 'surround-reaction';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('aria-atomic', 'true');
  overlay.hidden = true;
  let timer;
  let enabled = false;
  let allowIdle = false;
  let pose = 'retry';
  const draw = (kind, message = '') => {
    overlay.className = `surround-reaction ${kind}${message ? ' is-reacting' : ''}`;
    overlay.innerHTML = `<span class="surround-reaction-art" aria-hidden="true"><img src="/assets/intro/link-poses.png" alt="" width="320" height="160" loading="eager" decoding="sync"></span>${message ? `<strong>${message}</strong>` : ''}`;
    overlay.hidden = false;
  };
  const clear = () => {
    clearTimeout(timer);
    overlay.hidden = true;
    overlay.replaceChildren();
  };
  return {
    place(slot, { active = false, idle = false } = {}) {
      enabled = Boolean(slot) && active;
      allowIdle = idle;
      if (slot) slot.append(overlay);
      else overlay.remove();
      if (!enabled) clear();
      else if (overlay.hidden && allowIdle) draw(pose);
    },
    show(kind) {
      if (!Object.hasOwn(messages, kind)) return;
      clear();
      pose = kind;
      draw(kind, messages[kind]);
      timer = setTimeout(() => {
        if (enabled && allowIdle) draw(pose);
        else clear();
      }, 1600);
    },
    clear,
    dispose() { clear(); overlay.remove(); preload.remove(); }
  };
}
