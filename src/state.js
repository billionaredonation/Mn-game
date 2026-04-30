const LS_KEY = 'mn-game-state';

const defaultState = {
  player:          {},
  citiesRuntime:   {}          // динамика экономики, меняется игроками
};

export function getState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? structuredClone(defaultState); }
  catch { return structuredClone(defaultState); }
}

export function setState(path, value) {
  const st   = getState();
  const keys = path.split('.');
  let obj    = st;
  keys.slice(0, -1).forEach(k => { obj[k] ??= {}; obj = obj[k]; });
  obj[keys.at(-1)] = value;
  localStorage.setItem(LS_KEY, JSON.stringify(st));
}

export function updateRuntime(cityId, patch) {
  const st   = getState();
  st.citiesRuntime[cityId] = { ...(st.citiesRuntime[cityId] || {}), ...patch };
  localStorage.setItem(LS_KEY, JSON.stringify(st));
}
