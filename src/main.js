/* ------------------------------------------------------------------
 *   Т О Ч К А   В Х О Д А   П Р И Л О Ж Е Н И Я
 * ------------------------------------------------------------------ */

import { show } from './router.js';
import { initRuntime, getState } from './state.js';

/* ---------- one-time init ---------- */
initRuntime();                 // создаём citiesRuntime, если его нет

/* ---------- lazy-импорт экранов (версия v=72) ---------- */
import '../pages/welcome1/welcome1.js?v=72';
import '../pages/welcome2/welcome2.js?v=72';
import '../pages/welcome3/welcome3.js?v=72';
import '../pages/home/home.js?v=72';

/* ---------- UI-флаги окружения ---------- */
window.Telegram?.WebApp?.expand();

const isMobile   = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const lowMemory  = navigator.deviceMemory && navigator.deviceMemory <= 4;

document.documentElement.classList.toggle('is-mobile', isMobile);
document.documentElement.classList.toggle(
  'low-performance',
  Boolean(lowMemory)
);

/* ---------- первый экран по состоянию игрока ---------- */
const state = getState();

if (!state.player?.nickname) {
  show('welcome1');
} else if (!state.player?.city) {
  show('welcome3');
} else {
  show('home');
}
