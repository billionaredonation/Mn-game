const APP_VERSION = '90';

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

async function boot() {
  const routerModule = await import('./router.js?v=' + APP_VERSION);
  const stateModule = await import('./state.js?v=' + APP_VERSION);

  await Promise.all([
    import('../pages/welcome1/welcome1.js?v=' + APP_VERSION),
    import('../pages/welcome2/welcome2.js?v=' + APP_VERSION),
    import('../pages/welcome3/welcome3.js?v=' + APP_VERSION),
    import('../pages/home/home.js?v=' + APP_VERSION)
  ]);

  stateModule.initRuntime();

  const st = stateModule.getState();
  const nickname = st.nickname || (st.player && st.player.nickname);
  const city = st.city || (st.player && st.player.city);
  const screens = routerModule.screens;

  if (!screens.welcome1 || !screens.welcome2 || !screens.welcome3 || !screens.home) {
    throw new Error('Screens not registered: ' + Object.keys(screens).join(', '));
  }

  if (!nickname) {
    routerModule.show('welcome1');
  } else if (!city) {
    routerModule.show('welcome3');
  } else {
    routerModule.show('home');
  }
}

expandTelegramWebApp();
boot().catch(renderBootError);


