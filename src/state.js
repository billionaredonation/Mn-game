import { citiesBase } from './data/citiesBase.js';

const LS_KEY = 'mn-game-state';

const defaultState = {
  nickname: null,
  city: null,
  cityName: null,
  regionId: null,
  player: {},
  citiesRuntime: {}
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    return saved ? { ...clone(defaultState), ...saved } : clone(defaultState);
  } catch {
    return clone(defaultState);
  }
}

export let state = load();

export function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function setState(path, value) {
  const keys = path.split('.');
  let obj = state;

  keys.slice(0, -1).forEach((key) => {
    obj[key] ??= {};
    obj = obj[key];
  });

  obj[keys[keys.length - 1]] = value;
  save();
}

export function updateRuntime(cityId, patch) {
  state.citiesRuntime[cityId] = {
    ...(state.citiesRuntime[cityId] || {}),
    ...patch
  };

  save();
}

export function initRuntime() {
  if (Object.keys(state.citiesRuntime || {}).length) return;

  const blank = {};

  for (const id in citiesBase) {
    blank[id] = {};
  }

  state.citiesRuntime = blank;
  save();
}
