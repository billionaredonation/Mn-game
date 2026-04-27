const DEFAULT_STATE = {
  nickname: null,
  city: null,
  cityName: null,
  regionId: null
};

function loadState() {
  try {
    const saved = localStorage.getItem('player');

    if (!saved) {
      return { ...DEFAULT_STATE };
    }

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== 'object') {
      localStorage.removeItem('player');
      return { ...DEFAULT_STATE };
    }

    return {
      ...DEFAULT_STATE,
      ...parsed
    };
  } catch (error) {
    console.warn('Broken player state, reset:', error);
    localStorage.removeItem('player');
    return { ...DEFAULT_STATE };
  }
}

export const state = loadState();

export const save = () => {
  localStorage.setItem('player', JSON.stringify(state));
};

export const resetState = () => {
  localStorage.removeItem('player');

  state.nickname = null;
  state.city = null;
  state.cityName = null;
  state.regionId = null;
};
