import { register, show } from '../../src/router.js';
import { state } from '../../src/state.js';

const CITY_MAPS = {
  vinnytsia: {
    name: 'Винница',
    map: './VinitsaMap.png?v=29'
  },
  lutsk: {
    name: 'Луцк',
    map: './LutskMap.png?v=29'
  },
  luhansk: {
    name: 'Луганск',
    map: './LuganskMap.png?v=29'
  },
  dnipro: {
    name: 'Днепр',
    map: './DneprMap.png?v=29'
  },
  donetsk: {
    name: 'Донецк',
    map: './DonetskMap.png?v=29'
  },
  zhytomyr: {
    name: 'Житомир',
    map: './ZutomyrMap.png?v=29'
  },
  uzhhorod: {
    name: 'Ужгород',
    map: './UzgorodMap.png?v=29'
  },
  zaporizhzhia: {
    name: 'Запорожье',
    map: './ZaporizyaMap.png?v=29'
  },
  'ivano-frankivsk': {
    name: 'Ивано-Франковск',
    map: './IvanoFrankovskMap.png?v=29'
  },
  kyiv: {
    name: 'Киев',
    map: './KiyvMap.png?v=29'
  },
  kropyvnytskyi: {
    name: 'Кропивницкий',
    map: './KropivnitskyiMap.png?v=29'
  },
  crimea: {
    name: 'Крым',
    map: './KrymMap.png?v=29'
  },
  lviv: {
    name: 'Львов',
    map: './LvivMap.png?v=29'
  },
  mykolaiv: {
    name: 'Николаев',
    map: './NikolaevMap.png?v=29'
  },
  odesa: {
    name: 'Одесса',
    map: './OdessaMap.png?v=29'
  },
  poltava: {
    name: 'Полтава',
    map: './PoltavaMap.png?v=29'
  },
  rivne: {
    name: 'Ровно',
    map: './RovnoMap.png?v=29'
  },
  sumy: {
    name: 'Сумы',
    map: './SumyMap.png?v=29'
  },
  ternopil: {
    name: 'Тернополь',
    map: './TernopilMap.png?v=29'
  },
  kharkiv: {
    name: 'Харьков',
    map: './KharkivMap.png?v=29'
  },
  kherson: {
    name: 'Херсон',
    map: './KhersonMap.png?v=29'
  },
  khmelnytskyi: {
    name: 'Хмельницкий',
    map: './KhmelnitskiyMap.png?v=29'
  },
  cherkasy: {
    name: 'Черкассы',
    map: './CherkasyMap.png?v=29'
  },
  chernihiv: {
    name: 'Чернигов',
    map: './ChernigovMap.png?v=29'
  },
  chernivtsi: {
    name: 'Черновцы',
    map: './ChernivtsiMap.png?v=29'
  }
};

register('home', (root) => {
  root.className = 'page home';

  const cityId = state.city;
  const cityData = CITY_MAPS[cityId] || CITY_MAPS.zaporizhzhia;

  const cityName = cityData.name;
  const cityMap = cityData.map;

  root.innerHTML = `
    <div class="home-top">
      <div>
        <h2>${cityName}</h2>
        <p>Добро пожаловать, ${state.nickname || 'игрок'}.</p>
      </div>

      <button class="home-reset-btn" id="resetBtn" type="button">
        Сбросить
      </button>
    </div>

    <div class="city-map-shell">
      <img class="city-map-image" src="${cityMap}" alt="Карта города ${cityName}" />

      <button class="map-icon profile-icon" id="profileBtn" type="button">
        <span class="map-icon-emoji">👤</span>
        <span class="map-icon-label">Профиль</span>
      </button>

      <button class="map-icon jobs-icon" id="jobsBtn" type="button">
        <span class="map-icon-emoji">💼</span>
        <span class="map-icon-label">Работы</span>
      </button>

      <button class="map-icon house-icon" id="houseBtn" type="button">
        <span class="map-icon-emoji">🏠</span>
        <span class="map-icon-label">Дома</span>
      </button>

      <button class="map-icon settings-icon" id="settingsBtn" type="button">
        <span class="map-icon-emoji">⚙️</span>
        <span class="map-icon-label">Настройки</span>
      </button>
    </div>

    <div class="home-info" id="homeInfo">
      Нажми на иконку на карте
    </div>
  `;

  root.querySelector('#resetBtn').addEventListener('click', resetProgress);

  root.querySelector('#profileBtn').addEventListener('click', () => {
    setInfo(root, `Профиль игрока: ${state.nickname || 'Без ника'}`);
  });

  root.querySelector('#jobsBtn').addEventListener('click', () => {
    setInfo(root, 'Работы: скоро здесь появятся первые задания.');
  });

  root.querySelector('#houseBtn').addEventListener('click', () => {
    setInfo(root, 'Дома: покупка и аренда появятся позже.');
  });

  root.querySelector('#settingsBtn').addEventListener('click', () => {
    setInfo(root, 'Настройки: интерфейс, звук и управление добавим позже.');
  });
});

function setInfo(root, text) {
  root.querySelector('#homeInfo').textContent = text;
}

function resetProgress() {
  localStorage.removeItem('player');

  state.nickname = null;
  state.city = null;
  state.cityName = null;
  state.regionId = null;

  show('welcome1');
}
