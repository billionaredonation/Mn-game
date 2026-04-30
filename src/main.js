import { show, screens } from './router.js?v=83';
import { initRuntime, getState } from './state.js?v=83';

function renderBootError(error) {
  const root = document.getElementById('app');
  const message = error && error.message ? error.message : String(error);

  console.error(error);

  if (!root) {
    return;
  }

  root.innerHTML = `
    <div style="padding:20px;color:white;background:#050505;min-height:100vh;font-family:Arial">
      <h3 style="margin:0 0 10px">Ошибка запуска</h3>
      <pre style="white-space:pre-wrap;font-size:13px;opacity:.85">${message}</pre>
    </div>
  `;
}

function expandTelegramWebApp() {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.expand) {
    window.Telegram.WebApp.expand();
  }
}

function startApp() {
  initRuntime();

  const st = getState();
  const nickname = st.nickname || (st.player && st.player.nickname);
  const city = st.city || (st.player && st.player.city);

  if (!screens.welcome1 || !screens.welcome2 || !screens.welcome3 || !screens.home) {
    throw new Error('Screens not registered: ' + Object.keys(screens).join(', '));
  }

  if (!nickname) {
    show('welcome1');
  } else if (!city) {
    show('welcome3');
  } else {
    show('home');
  }
}

expandTelegramWebApp();

Promise.all([
  import('../pages/welcome1/welcome1.js?v=83'),
  import('../pages/welcome2/welcome2.js?v=83'),
  import('../pages/welcome3/welcome3.js?v=83'),
  import('../pages/home/home.js?v=83')
])
  .then(startApp)
  .catch(renderBootError);

