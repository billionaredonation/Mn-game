import { register, show } from '../../src/router.js';
import { state } from '../../src/state.js';

const CITY_MAPS = {
  zaporizhzhia: {
    name: 'Запорожье',
    map: './Zaporizya.png'
  }
};

register('home', (root) => {
  root.className = 'page home';

  const cityId = state.city;
  const cityName = state.cityName || state.city || 'город';
  const cityData = CITY_MAPS[cityId];

  if (!cityData) {
    root.innerHTML = `
      <div class="home-top">
        <div>
          <h2>${cityName}</h2>
          <p>Карта этого города пока в разработке.</p>
        </div>

        <button class="home-reset-btn" id="resetBtn">Сбросить</button>
      </div>

      <div class="home-placeholder">
        <h3>Скоро здесь появится карта города</h3>
        <p>Пока выбери Запорожье, чтобы протестировать главный экран.</p>
      </div>
    `;

    root.querySelector('#resetBtn').onclick = resetProgress;
    return;
  }

  root.innerHTML = `
    <div class="home-top">
      <div>
        <h2>${cityData.name}</h2>
        <p>Добро пожаловать, ${state.nickname || 'игрок'}.</p>
      </div>

      <button class="home-reset-btn" id="resetBtn">Сбросить</button>
    </div>

    <div class="city-map-shell">
      <img class="city-map-image" src="${cityData.map}" alt="Карта города ${cityData.name}" />

      <button class="map-icon profile-icon" id="profileBtn" type="button">
        👤
        <span>Профиль</span>
      </button>

      <button class="map-icon jobs-icon" id="jobsBtn" type="button">
        💼
        <span>Работы</span>
      </button>

      <button class="map-icon settings-icon" id="settingsBtn" type="button">
        ⚙️
        <span>Настройки</span>
      </button>

      <button class="map-icon house-icon" id="houseBtn" type="button">
        🏠
        <span>Дома</span>
      </button>
    </div>

    <div class="home-info" id="homeInfo">
      Нажми на иконку на карте
    </div>
  `;

  root.querySelector('#resetBtn').onclick = resetProgress;

  root.querySelector('#profileBtn').onclick = () => {
    setInfo(root, `Профиль игрока: ${state.nickname || 'Без ника'}`);
  };

  root.querySelector('#jobsBtn').onclick = () => {
    setInfo(root, 'Раздел работ: скоро здесь будут первые задания.');
  };

  root.querySelector('#settingsBtn').onclick = () => {
    setInfo(root, 'Настройки: звук, интерфейс и управление добавим позже.');
  };

  root.querySelector('#houseBtn').onclick = () => {
    setInfo(root, 'Недвижимость: дома и бизнесы появятся в следующих обновлениях.');
  };
});

function setInfo(root, text) {
  root.querySelector('#homeInfo').textContent = text;
}

function resetProgress() {
  localStorage.removeItem('player');

  state.nickname = null;
  state.city = null;
  state.cityName = null;

  show('welcome1');
}
