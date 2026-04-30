function renderBootError(error) {
  const root = document.getElementById('app');
  const message = error && error.stack ? error.stack : String(error && error.message ? error.message : error);

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
  expandTelegramWebApp();

  const router = await import('./router.js?v=84');
  const stateModule = await import('./state.js?v=84');

  await Promise.all([
    import('../pages/welcome1/welcome1.js?v=84'),
    import('../pages/welcome2/welcome2.js?v=84'),
    import('../pages/welcome3/welcome3.js?v=84'),
    import('../pages/home/home.js?v=84')
  ]);

  stateModule.initRuntime();

  const st = stateModule.getState();
  const nickname = st.nickname || (st.player && st.player.nickname);
  const city = st.city || (st.player && st.player.city);
  const screens = router.screens;

  if (!screens.welcome1 || !screens.welcome2 || !screens.welcome3 || !screens.home) {
    throw new Error('Screens not registered: ' + Object.keys(screens).join(', '));
  }

  if (!nickname) {
    router.show('welcome1');
  } else if (!city) {
    router.show('welcome3');
  } else {
    router.show('home');
  }
}

boot().catch(renderBootError);

  .catch(renderBootError);

