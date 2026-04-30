import { show } from './router.js';
import { initRuntime, getState } from './state.js';

initRuntime();                              // ← обязательно

import '../pages/welcome1/welcome1.js?v=74';
import '../pages/welcome2/welcome2.js?v=74';
import '../pages/welcome3/welcome3.js?v=74';
import '../pages/home/home.js?v=74';

window.Telegram?.WebApp?.expand();

const st = getState();
if (!st.player?.nickname)   show('welcome1');
else if (!st.player?.city)  show('welcome3');
else                        show('home');
