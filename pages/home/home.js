import { register } from '../../src/router.js';
import { state }    from '../../src/state.js';

register('home', (root) => {
  root.className = 'page home';
  root.innerHTML = `
    <h2>Добро пожаловать, ${state.nickname} из ${state.city || '??'}!</h2>
    <p>Это главный экран MVP. Здесь позже появятся иконки «Профиль», «Работа», «Дом» и др.</p>`;
});
