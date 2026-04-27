import { register, show } from '../../src/router.js';

register('welcome1', (root) => {
  root.className = 'page welcome1';

  root.innerHTML = `
    <div class="welcome1-card">
      <h1>MN</h1>

      <p>
        MN — RPG-світ з елементами roleplay на основі реальних мап України
        та українських міст.
      </p>

      <p>
        У майбутньому буде додано онлайн.
      </p>

      <h2>Ласкаво просимо!</h2>

      <button class="btn" id="nextBtn">
        Далі
      </button>
    </div>
  `;

  root.querySelector('#nextBtn').addEventListener('click', () => {
    show('welcome2');
  });
});
