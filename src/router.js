export const screens = {};

export function register(id, fn) {
  screens[id] = fn;
}

export function show(id, props = {}) {
  const root = document.getElementById('app');

  if (!root) {
    console.error('Root element #app not found');
    return;
  }

  root.innerHTML = '';

  if (!screens[id]) {
    console.error(`Screen "${id}" is not registered`);
    root.innerHTML = `
      <div style="padding:20px;color:white;font-family:Arial">
        Ошибка: экран "${id}" не найден
      </div>
    `;
    return;
  }

  screens[id](root, props);
  window.currentScreen = id;
}
