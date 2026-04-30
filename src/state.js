/* ------------------------------------------------------------------
 *  Г Л О Б А Л Ь Н Ы Й   S T A T E   И Г Р Ы   (localStorage)
 * ------------------------------------------------------------------ */

import { citiesBase } from './data/citiesBase.js';

const LS_KEY = 'mn-game-state';

/** Стартовое состояние, если в localStorage ещё пусто */
const defaultState = {
  player: {},           // { city: 'kyiv', ... }
  citiesRuntime: {}     // живые изменения экономики от игроков
};

/* ---------- низкоуровневые I/O ---------- */
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) ?? structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(st) {
  localStorage.setItem(LS_KEY, JSON.stringify(st));
}

/* ---------- in-memory экземпляр ---------- */
let state = loadState();

/* ---------- API ---------- */

/** Получить актуальный snapshot */
export const getState = () => state;

/**
 * Поставить значение по «поточной» строке:
 *   setState('player.city', 'kyiv')
 */
export function setState(path, value) {
  const keys = path.split('.');
  let obj = state;
  keys.slice(0, -1).forEach(k => {
    if (!obj[k]) obj[k] = {};
    obj = obj[k];
  });
  obj[keys.at(-1)] = value;
  saveState(state);
}

/**
 * Тонкое обновление runtime-городов
 *   updateRuntime('kyiv', { factories: 5 })
 */
export function updateRuntime(cityId, patch) {
  state.citiesRuntime[cityId] = {
    ...(state.citiesRuntime[cityId] || {}),
    ...patch
  };
  saveState(state);
}

/**
 * Простейший диспетчер action'ов
 *   dispatch({ type:'BUILD_FACTORY', payload:{ city:'kyiv', cost:500 } })
 */
export function dispatch(action) {
  reducer(state, action);
  saveState(state);
}

/* ------------------------------------------------------------------
 *                     R E D U C E R
 * ------------------------------------------------------------------ */
function reducer(st, action) {
  switch (action.type) {
    /* ----- пример игрового действия: постройка завода --------------- */
    case 'BUILD_FACTORY': {
      const { cityId, cost } = action.payload;

      const base = citiesBase[cityId] || {};
      const run  = st.citiesRuntime[cityId] ||= {};

      // увеличиваем счётчик заводов
      run.factories = (run.factories ?? base.factories ?? 0) + 1;

      // денежная масса (рост M2)
      const ms = run.moneySupply ?? base.moneySupply ?? { value: 0, delta: 0 };
      run.moneySupply = {
        value: ms.value,
        delta: ms.delta + cost
      };
      break;
    }

    /* --- далее добавляйте свои action'ы (FARM_BUILD, PRINT_MONEY…) -- */

    default:
      /* ничего не делаем */
  }
}

/* ------------------------------------------------------------------
 *     Х Е Л П Е Р   Д Л Я   П Е Р В О Г О   З А П У С К А
 * ------------------------------------------------------------------ */
/**
 * Если runtime-данные ещё пустые — создаём для каждого города пустой объект.
 * Вызывается из main.js один раз при старте приложения.
 */
export function initRuntime() {
  if (Object.keys(state.citiesRuntime).length) return;

  const blank = {};
  for (const id in citiesBase) blank[id] = {};
  state.citiesRuntime = blank;
  saveState(state);
}
