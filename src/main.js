import { show }           from './router.js';
import './router.js';      // создаёт screens коллекцию
import './state.js';

// страницы-регистрации
import '../pages/welcome1/welcome1.js';
import '../pages/welcome2/welcome2.js';
import '../pages/welcome3/welcome3.js';
import '../pages/home/home.js';

// раскрываем web-view
window.Telegram?.WebApp?.expand();

// определяем стартовый экран
import { state } from './state.js';
show(state.nickname ? (state.city ? 'home' : 'welcome3') : 'welcome1');
