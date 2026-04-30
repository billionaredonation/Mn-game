import { show } from './router.js?v=37';
import { initRuntime, getState } from './state.js?v=37';

import '../pages/welcome1/welcome1.js?v=37';
import '../pages/welcome2/welcome2.js?v=37';
import '../pages/welcome3/welcome3.js?v=37';
import '../pages/home/home.js?v=37';

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.expand) {
  window.Telegram.WebApp.expand();
}

initRuntime();

const st = getState();

if (!st.nickname) {
  show('welcome1');
} else if (!st.city) {
  show('welcome3');
} else {
  show('home');
}
