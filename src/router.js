export const screens = {};               // id → render(root)
export function register(id, fn) { screens[id] = fn; }

export function show(id, props = {}) {
  const root = document.getElementById('app');
  root.innerHTML = '';
  screens[id](root, props);
  window.currentScreen = id;
}
