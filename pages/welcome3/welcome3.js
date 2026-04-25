import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

const MAP_IMG = './UkraineMap.png?v=5';

const CITY_ZONES = [
  {
    id: 'lviv',
    name: 'Львов',
    x: 20.5,
    y: 37.5,
    w: 15,
    h: 13,
    rotate: -10
  },
  {
    id: 'kyiv',
    name: 'Киев',
    x: 50.5,
    y: 31.5,
    w: 15,
    h: 13,
    rotate: 4
  },
  {
    id: 'kharkiv',
    name: 'Харьков',
    x: 73.5,
    y: 35.5,
    w: 15,
    h: 13,
    rotate: -8
  },
  {
    id: 'vinnytsia',
    name: 'Винница',
    x: 42.5,
    y: 47,
    w: 15,
    h: 13,
    rotate: -5
  },
  {
    id: 'dnipro',
    name: 'Днепр',
    x: 62.5,
    y: 52,
    w: 14,
    h: 12,
    rotate: 8
  },
  {
    id: 'mykolaiv',
    name: 'Николаев',
    x: 52,
    y: 64,
    w: 14,
    h: 12,
    rotate: 5
  },
  {
    id: 'zaporizhzhia',
    name: 'Запорожье',
    x: 63.5,
    y: 61,
    w: 14,
    h: 12,
    rotate: 12
  },
  {
    id: 'odesa',
    name: 'Одесса',
    x: 45,
    y: 68,
    w: 17,
    h: 15,
    rotate: -18
  }
];

register('welcome3', (root) => {
  root.className = 'page welcome3';

  root.innerHTML = `
    <h2>Выбери стартовый город</h2>

    <p class="welcome3-subtitle">
      Нажми на область города на карте Украины
    </p>

    <div class="ukraine-map-shell">
      <img class="ukraine-map-image" src="${MAP_IMG}" alt="Карта Украины" />

      <div class="city-zones-layer" id="cityZonesLayer"></div>
    </div>

    <div class="city-selection-box">
      <p id="citySelectionText" class="city-selection-text">
        Наведи или нажми на область города
      </p>
    </div>

    <button class="btn welcome3-next-btn" id="nextBtn" disabled>
      Далее
    </button>
  `;

  const zonesLayer = root.querySelector('#cityZonesLayer');
  const citySelectionText = root.querySelector('#citySelectionText');
  const nextBtn = root.querySelector('#nextBtn');

  let selectedCity = CITY_ZONES.find((city) => city.id === state.city) || null;
  const zoneElements = [];

  function setText(text) {
    citySelectionText.textContent = text;
  }

  function updateSelection() {
    zoneElements.forEach((zone) => {
      const isSelected = selectedCity && zone.dataset.cityId === selectedCity.id;
      zone.classList.toggle('is-selected', Boolean(isSelected));
    });

    if (selectedCity) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
      setText(`Выбран город: ${selectedCity.name}`);
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      setText('Наведи или нажми на область города');
    }
  }

  function previewCity(city) {
    if (selectedCity && selectedCity.id === city.id) {
      setText(`Выбран город: ${city.name}`);
      return;
    }

    setText(`Вы хотите выбрать ${city.name}?`);
  }

  function resetPreview() {
    if (selectedCity) {
      setText(`Выбран город: ${selectedCity.name}`);
    } else {
      setText('Наведи или нажми на область города');
    }
  }

  function selectCity(city) {
    selectedCity = city;

    state.city = city.id;
    state.cityName = city.name;
    save();

    updateSelection();
  }

  CITY_ZONES.forEach((city) => {
    const zone = document.createElement('button');

    zone.type = 'button';
    zone.className = `city-zone city-zone-${city.id}`;
    zone.dataset.cityId = city.id;
    zone.setAttribute('aria-label', city.name);

    zone.style.left = `${city.x}%`;
    zone.style.top = `${city.y}%`;
    zone.style.width = `${city.w}%`;
    zone.style.height = `${city.h}%`;
    zone.style.rotate = `${city.rotate}deg`;

    zone.innerHTML = `
      <span class="city-map-glow"></span>
    `;

    zone.addEventListener('mouseenter', () => previewCity(city));
    zone.addEventListener('mouseleave', resetPreview);

    zone.addEventListener('focus', () => previewCity(city));
    zone.addEventListener('blur', resetPreview);

    zone.addEventListener('click', () => selectCity(city));

    zonesLayer.appendChild(zone);
    zoneElements.push(zone);
  });

  updateSelection();

  nextBtn.addEventListener('click', () => {
    if (!selectedCity) {
      alert('Сначала выбери город на карте');
      return;
    }

    show('home');
  });
});
