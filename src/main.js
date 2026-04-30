import { show } from './router.js';
import { loadState } from './state.js';
import './styles/base.css';

/* ---------- file:// защита ---------- */
if (location.protocol === 'file:') {
  document.body.innerHTML =
    '<style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;text-align:center;padding:20px}</style>' +
    '<h2>Игра не может работать по <code>file://</code>.<br>' +
    'Опубликуйте её на GitHub&nbsp;Pages<br>' +
    'или откройте через любой HTTP-сервер.</h2>';
  throw new Error('file:// not supported');
}
/* ------------------------------------ */

/* ---------- Telegram fallback ---------- */
if (
  typeof window.Telegram === 'undefined' ||
  !window.Telegram.WebApp ||
  typeof window.Telegram.WebApp.expand !== 'function'
) {
  window.Telegram = {
    WebApp: {
      expand() {},
      ready() {},
      sendData() {},
    },
  };
}
/* --------------------------------------- */

Telegram.WebApp.expand();

const state = loadState();

if (!state.nickname) {
  const { default: Welcome1 } = await import('./pages/welcome/step1.js');
  show(Welcome1);
} else if (!state.city) {
  const { default: Welcome2 } = await import('./pages/welcome/step2.js');
  show(Welcome2);
} else {
  const { default: Home } = await import('./pages/home/index.js');
  show(Home);
}

Telegram.WebApp.ready();
