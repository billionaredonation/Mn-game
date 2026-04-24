import { register, show } from '../../src/router.js';
import { state } from '../../src/state.js';

register('home', (root) => {
  root.className = 'page home';

  root.innerHTML = `
    <h2>Добро пожаловать, ${state.nickname || 'игрок'} из ${state.city || 'города'}!</h2>
    <p>Главный экран MVP — тут позже появятся иконки.</p>

    <button class="btn" id="resetBtn">Сбросить прогресс</button>
  `;

  root.querySelector('#resetBtn').onclick = () => {
    localStorage.removeItem('player');

    state.nickname = null;
    state.city = null;

    show('welcome1');
  };
});
