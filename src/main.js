/* ────────── точка входа ────────── */
import { show } from './router.js';
import { initRuntime, getState } from './state.js';

/* инициализируем citiesRuntime перед любым UI */
initRuntime();

/* lazy-импорт экранов (одна версия v=73 для сброса кэша) */
import '../pages/welcome1/welcome1.js?v=75';
import '../pages/welcome2/welcome2.js?v=75';
import '../pages/welcome3/welcome3.js?v=75';
import '../pages/home/home.js?v=75';

/* окружение: раскрыть Web-App, флаги устройства */
window.Telegram?.WebApp?.expand();
const isMobile  = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

document.documentElement.classList.toggle('is-mobile', isMobile);
document.documentElement.classList.toggle('low-performance', Boolean(lowMemory));

/* выбрать стартовый экран */
const st = getState();
if (!st.player?.nickname)       show('welcome1');
else if (!st.player?.city)      show('welcome3');
else                            show('home');
