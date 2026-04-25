import { show } from './router.js';
import { state } from './state.js';

import '../pages/welcome1/welcome1.js?v=8';
import '../pages/welcome2/welcome2.js?v=8';
import '../pages/welcome3/welcome3.js?v=14';
import '../pages/home/home.js?v=9';

window.Telegram?.WebApp?.expand();

if (!state.nickname) {
  show('welcome1');
} else if (!state.city) {
  show('welcome3');
} else {
  show('home');
}
