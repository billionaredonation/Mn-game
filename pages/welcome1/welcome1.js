import { register, show } from '../../src/router.js';

register('welcome1', (root) => {
  root.className = 'page welcome1';

  root.innerHTML = `
    <div class="welcome-bg"></div>

    <section class="welcome-card welcome1-card">
      <div class="welcome-logo">MN</div>

      <p class="welcome-step">Старт игры</p>

      <h1 class="welcome-title">MN RPG</h1>

      <p class="welcome-subtitle">
        RPG-світ з елементами roleplay на основі реальних мап України та українських міст.
      </p>

      <div class="welcome1-info">
        <p>
          Обирай місто, розвивай персонажа, відкривай роботи, навички та власний шлях.
        </p>

        <p>
          У майбутньому буде додано онлайн.
        </p>
      </div>

      <div class="welcome-actions">
        <button class="welcome-btn" id="nextBtn" type="button">
          Далі
        </button>
      </div>
    </section>
  `;

  const nextBtn = root.querySelector('#nextBtn');

  nextBtn.addEventListener('click', () => {
    show('welcome2');
  });
});
