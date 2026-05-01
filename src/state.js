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

function normalizeLoadedState(loaded) {
  loaded.player = loaded.player || {};

  loaded.nickname = loaded.nickname || loaded.player.nickname || null;
  loaded.city = loaded.city || loaded.player.city || null;
  loaded.cityName = loaded.cityName || loaded.player.cityName || null;
  loaded.regionId = loaded.regionId || loaded.player.regionId || null;

  loaded.player.nickname = loaded.player.nickname || loaded.nickname;
  loaded.player.city = loaded.player.city || loaded.city;
  loaded.player.cityName = loaded.player.cityName || loaded.cityName;
  loaded.player.regionId = loaded.player.regionId || loaded.regionId;

  if (typeof loaded.player.money !== 'number') loaded.player.money = 0;
  if (typeof loaded.player.energy !== 'number') loaded.player.energy = 100;
  if (typeof loaded.player.xp !== 'number') loaded.player.xp = 0;

  loaded.player.skills = loaded.player.skills || {};
  if (typeof loaded.player.skills.strength !== 'number') loaded.player.skills.strength = 1;
  if (typeof loaded.player.skills.endurance !== 'number') loaded.player.skills.endurance = 1;
  if (typeof loaded.player.skills.intellect !== 'number') loaded.player.skills.intellect = 1;
  if (typeof loaded.player.skills.charisma !== 'number') loaded.player.skills.charisma = 1;

  loaded.citiesRuntime = loaded.citiesRuntime || {};

  return loaded;
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    return normalizeLoadedState(saved ? Object.assign(clone(defaultState), saved) : clone(defaultState));
  } catch (error) {
    return normalizeLoadedState(clone(defaultState));
  }
}

const stateStore = window.__MN_GAME_STATE__ || {
  state: load()
};

window.__MN_GAME_STATE__ = stateStore;

export let state = stateStore.state;

export function save() {
  stateStore.state = state;

  state.player = state.player || {};
  state.player.nickname = state.nickname || state.player.nickname || null;
  state.player.city = state.city || state.player.city || null;
  state.player.cityName = state.cityName || state.player.cityName || null;
  state.player.regionId = state.regionId || state.player.regionId || null;

  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

export function setState(path, value) {
  const keys = path.split('.');
  let obj = state;

  keys.slice(0, -1).forEach((key) => {
    if (!obj[key]) obj[key] = {};
    obj = obj[key];
  });

  obj[keys[keys.length - 1]] = value;
  save();
}

export function updateRuntime(cityId, patch) {
  state.citiesRuntime[cityId] = Object.assign({}, state.citiesRuntime[cityId] || {}, patch);
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


