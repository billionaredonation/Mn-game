import { show } from './router.js?v=81';
import { initRuntime, getState } from './state.js?v=81';

import '../pages/welcome1/welcome1.js?v=81';
import '../pages/welcome2/welcome2.js?v=81';
import '../pages/welcome3/welcome3.js?v=81';
import '../pages/home/home.js?v=81';

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.expand) {
  window.Telegram.WebApp.expand();
}

initRuntime();

const st = getState();
const nickname = st.nickname || (st.player && st.player.nickname);
const city = st.city || (st.player && st.player.city);

if (!nickname) {
  show('welcome1');
} else if (!city) {
  show('welcome3');
} else {
  show('home');
}

