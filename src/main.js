import { show } from './router.js?v=3';
import { state } from './state.js?v=3';

import '../pages/welcome1/welcome1.js?v=3';
import '../pages/welcome2/welcome2.js?v=3';
import '../pages/welcome3/welcome3.js?v=3';
import '../pages/home/home.js?v=3';

window.Telegram?.WebApp?.expand();

if (!state.nickname) {
  show('welcome1');
} else if (!state.city) {
  show('welcome3');
} else {
  show('home');
}
