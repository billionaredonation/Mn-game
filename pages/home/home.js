import { register, show } from '../../src/router.js';
import { state } from '../../src/state.js';

register('home', (root) => {
  root.className = 'page home';

  const cityLabel = state.cityName || state.city || 'города';

  root.innerHTML = `
    <h2>Добро пожаловать, ${state.nickname || 'игрок'} из ${cityLabel}!</h2>
    <p>Главный экран MVP — тут позже появятся иконки.</p>

    <button 
      id="resetBtn"
      style="
        margin-top: 30px;
        padding: 14px 24px;
        border: none;
        border-radius: 12px;
        background: #dc2626;
        color: white;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
      "
    >
      Сбросить прогресс
    </button>
  `;

  root.querySelector('#resetBtn').onclick = () => {
    localStorage.removeItem('player');

    state.nickname = null;
    state.city = null;
    state.cityName = null;

    show('welcome1');
  };
});
