/* ────────── глобальный state (localStorage) ────────── */
import { citiesBase } from './data/citiesBase.js';

const LS_KEY = 'mn-game-state';
const defaultState = { player: {}, citiesRuntime: {} };

/* -- low-level I/O -- */
const load = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? structuredClone(defaultState); }
  catch { return structuredClone(defaultState); }
};
const save = (st) => localStorage.setItem(LS_KEY, JSON.stringify(st));

/* -- runtime snapshot -- */
let state = load();

/* ---------- API ---------- */
export const getState = () => state;

export const setState = (path, value) => {
  const keys = path.split('.');
  let obj = state;
  keys.slice(0, -1).forEach(k => { obj[k] ??= {}; obj = obj[k]; });
  obj[keys.at(-1)] = value;
  save(state);
};

export const updateRuntime = (cityId, patch) => {
  state.citiesRuntime[cityId] = {
    ...(state.citiesRuntime[cityId] || {}),
    ...patch
  };
  save(state);
};

export const initRuntime = () => {
  if (Object.keys(state.citiesRuntime).length) return;
  const blank = {};
  for (const id in citiesBase) blank[id] = {};
  state.citiesRuntime = blank;
  save(state);
};
