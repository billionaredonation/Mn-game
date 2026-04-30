import { initRuntime } from './state.js';
import { show } from './router.js';

function renderBootError(err) {
  console.error(err);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div style="
      padding:20px;
      color:white;
      background:#050505;
      min-height:100vh;
      font-family:Arial;
    ">
      ❌ Ошибка загрузки<br><br>
      ${err?.message || err}
    </div>
  `;
}

async function boot() {
  // Telegram init (если есть)
  if (window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.expand();
    } catch (e) {
      console.warn('Telegram init error', e);
    }
  }

  // Инициализация состояния
  await initRuntime();

  // Первый экран
  show('welcome1');
}

// 🚨 ВАЖНО: без двойного .catch
boot().catch(renderBootError);

