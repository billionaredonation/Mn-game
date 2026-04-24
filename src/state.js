export const state = JSON.parse(localStorage.getItem('player')) || {
  nickname: null,
  city: null
};

export const save = () =>
  localStorage.setItem('player', JSON.stringify(state));
