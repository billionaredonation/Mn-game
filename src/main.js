import { show } from './router.js';

import '../pages/welcome1/welcome1.js?v=5';
import '../pages/welcome2/welcome2.js?v=5';
import '../pages/welcome3/welcome3.js?v=5';
import '../pages/home/home.js?v=5';

window.Telegram?.WebApp?.expand();

/*
  ВРЕМЕННО ДЛЯ ТЕСТА:
  Каждый запуск очищает прогресс и открывает welcome1.
*/
localStorage.removeItem('player');

show('welcome1');
