import { show } from './router.js';
import { initRuntime, getState } from './state.js';

initRuntime();                     // загружаем / инициализируем localStorage

/* страницы ---------------------------------------------------------------- */
import '../pages/welcome1/welcome1.js';
import '../pages/welcome2/welcome2.js';
import '../pages/welcome3/welcome3.js';
import '../pages/home/home.js';    // ←  убрали ?v=74 ▸ иначе файл 404
/* ------------------------------------------------------------------------- */

/* расширяем Web-App, если Telegram есть */
window.Telegram?.WebApp?.expand?.();

/* маршрутизация ----------------------------------------------------------- */
const st = getState();             // { player: { nickname?, city? } }

if (!st.player?.nickname) {
  show('welcome1');
} else if (!st.player?.city) {
  show('welcome3');
} else {
  show('home');
}
