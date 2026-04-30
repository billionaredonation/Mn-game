import { show } from './router.js';
import { state, initRuntime } from './state.js';

import '../pages/welcome1/welcome1.js?v=91';
import '../pages/welcome2/welcome2.js?v=91';
import '../pages/welcome3/welcome3.js?v=91';
import '../pages/home/home.js?v=91';

function renderBootError(error) {
  console.error(error);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div style="min-height:100vh;background:#050505;color:white;padding:20px;font-family:Arial,sans-serif;">
      <h2>Ошибка загрузки</h2>
      <pre style="white-space:pre-wrap;color:#ff7777;">${error?.message || error}</pre>
    </div>
  `;
}

function boot() {
  try {
    window.Telegram?.WebApp?.expand();

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

    document.documentElement.classList.toggle('is-mobile', isMobile);
    document.documentElement.classList.toggle('low-performance', Boolean(lowMemory));

    initRuntime();

    if (!state.nickname) {
      show('welcome1');
    } else if (!state.city) {
      show('welcome3');
    } else {
      show('home');
    }
  } catch (error) {
    renderBootError(error);
  }
}

boot();
