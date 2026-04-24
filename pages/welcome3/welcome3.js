import { register, show } from '../../src/router.js';
import { state, save }    from '../../src/state.js';

const MAP_IMG = './Zaporizya.png';

register('welcome3', (root) => {
  root.className = 'page welcome3';
  root.innerHTML = `
    <h2>Выбери стартовый город</h2>

    <div class="map-wrapper">
      <img id="cityMap" src="${MAP_IMG}" alt="Карта города" />
    </div>

    <p id="selectedCityText" class="selected-city-text">
      Город пока не выбран
    </p>

    <button class="btn" id="nextBtn">Далее</button>
  `;

  const img = root.querySelector('#cityMap');
  const selectedCityText = root.querySelector('#selectedCityText');
  const nextBtn = root.querySelector('#nextBtn');

  img.onclick = () => {
    state.city = 'zaporizhzhia';
    save();

    selectedCityText.textContent = 'Выбран город: Запорожье';
    nextBtn.classList.add('active');
  };

  nextBtn.onclick = () => {
    if (!state.city) {
      alert('Сначала кликни по карте, чтобы выбрать город!');
      return;
    }

    show('home');
  };
});
