import { register, show } from '../../src/router.js';
import { state } from '../../src/state.js';

const ASSET_VERSION = '31';

function mapUrl(fileName) {
  return `${new URL(`../../${fileName}`, import.meta.url).href}?v=${ASSET_VERSION}`;
}

const CITY_MAPS = {
  vinnytsia: {
    name: 'Винница',
    file: 'VinitsaMap.png'
  },
  lutsk: {
    name: 'Луцк',
    file: 'LutskMap.png'
  },
  luhansk: {
    name: 'Луганск',
    file: 'LuganskMap.png'
  },
  dnipro: {
    name: 'Днепр',
    file: 'DneprMap.png'
  },
  donetsk: {
    name: 'Донецк',
    file: 'DonetskMap.png'
  },
  zhytomyr: {
    name: 'Житомир',
    file: 'ZutomyrMap.png'
  },
  uzhhorod: {
    name: 'Ужгород',
    file: 'UzgorodMap.png'
  },
  zaporizhzhia: {
    name: 'Запорожье',
    file: 'ZaporizyaMap.png'
  },
  'ivano-frankivsk': {
    name: 'Ивано-Франковск',
    file: 'IvanoFrankovskMap.png'
  },
  kyiv: {
    name: 'Киев',
    file: 'KiyvMap.png'
  },
  kropyvnytskyi: {
    name: 'Кропивницкий',
    file: 'KropivnitskyiMap.png'
  },
  crimea: {
    name: 'Крым',
    file: 'KrymMap.png'
  },
  lviv: {
    name: 'Львов',
    file: 'LvivMap.png'
  },
  mykolaiv: {
    name: 'Николаев',
    file: 'NikolaevMap.png'
  },
  odesa: {
    name: 'Одесса',
    file: 'OdessaMap.png'
  },
  poltava: {
    name: 'Полтава',
    file: 'PoltavaMap.png'
  },
  rivne: {
    name: 'Ровно',
    file: 'RovnoMap.png'
  },
  sumy: {
    name: 'Сумы',
    file: 'SumyMap.png'
  },
  ternopil: {
    name: 'Тернополь',
    file: 'TernopilMap.png'
  },
  kharkiv: {
    name: 'Харьков',
    file: 'KharkivMap.png'
  },
  kherson: {
    name: 'Херсон',
    file: 'KhersonMap.png'
  },
  khmelnytskyi: {
    name: 'Хмельницкий',
    file: 'KhmelnitskiyMap.png'
  },
  cherkasy: {
    name: 'Черкассы',
    file: 'CherkasyMap.png'
  },
  chernihiv: {
    name: 'Чернигов',
    file: 'ChernigovMap.png'
  },
  chernivtsi: {
    name: 'Черновцы',
    file: 'ChernivtsiMap.png'
  }
};

register('home', (root) => {
  root.className = 'page home';

  const cityId = state.city;
  const cityData = CITY_MAPS[cityId] || CITY_MAPS.zaporizhzhia;

  const cityName = cityData.name;
  const cityMap = mapUrl(cityData.file);

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
