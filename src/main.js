import { show } from './router.js?v=4';

import '../pages/welcome1/welcome1.js?v=4';
import '../pages/welcome2/welcome2.js?v=4';
import '../pages/welcome3/welcome3.js?v=4';
import '../pages/home/home.js?v=4';

window.Telegram?.WebApp?.expand();

/*
  ВРЕМЕННО ДЛЯ ТЕСТА:
  Каждый запуск очищает прогресс и кидает на welcome1.
  Потом уберём, когда нормально настроим выбор города.
*/
localStorage.removeItem('player');

show('welcome1');
