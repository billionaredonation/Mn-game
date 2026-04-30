import { show } from './router.js';
import { initRuntime, getState } from './state.js';

import '../pages/welcome1/welcome1.js?v=75';
import '../pages/welcome2/welcome2.js?v=75';
import '../pages/welcome3/welcome3.js?v=75';
import '../pages/home/home.js?v=75';

window.Telegram?.WebApp?.expand();

initRuntime();

const st = getState();

if (!st.nickname) {
  show('welcome1');
} else if (!st.city) {
  show('welcome3');
} else {
  show('home');
}
