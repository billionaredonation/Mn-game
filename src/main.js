import { show } from './router.js';
import { state } from './state.js';

import '../pages/welcome1/welcome1.js?v=31';
import '../pages/welcome2/welcome2.js?v=32';
import '../pages/welcome3/welcome3.js?v=30';
import '../pages/home/home.js?v=32';

window.Telegram?.WebApp?.expand();

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

document.documentElement.classList.toggle('is-mobile', isMobile);
document.documentElement.classList.toggle('low-performance', Boolean(lowMemory));

if (!state.nickname) {
  show('welcome1');
} else if (!state.city) {
  show('welcome3');
} else {
  show('home');
}
