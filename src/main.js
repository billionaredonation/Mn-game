import { show } from './router.js';
import { initRuntime, getState } from './state.js';

import '../pages/welcome1/welcome1.js';
import '../pages/welcome2/welcome2.js';
import '../pages/welcome3/welcome3.js';
import '../pages/home/home.js';

window.Telegram?.WebApp?.expand?.();

initRuntime();

const st = getState();

if (!st.nickname) {
  show('welcome1');
} else if (!st.city) {
  show('welcome3');
} else {
  show('home');
}
