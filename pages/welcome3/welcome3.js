import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

const MAP_IMG = './UkraineMap.png';

const CITY_POINTS = [
  { id: 'lviv',          name: 'Львов',       x: 18, y: 35 },
  { id: 'kyiv',          name: 'Киев',        x: 47, y: 29 },
  { id: 'kharkiv',       name: 'Харьков',     x: 70, y: 32 },
  { id: 'dnipro',        name: 'Днепр',       x: 59, y: 48 },
  { id: 'zaporizhzhia',  name: 'Запорожье',   x: 60, y: 60 },
  { id: 'odesa',         name: 'Одесса',      x: 38, y: 66 },
  { id: 'mykolaiv',      name: 'Николаев',    x: 46, y: 62 },
  { id: 'vinnytsia',     name: 'Винница',     x: 39, y: 43 }
];

register('welcome3', (root) => {
  root.className = 'page welcome3';

  root.innerHTML = `
    <h2>Выбери стартовый город</h2>
    <p class="welcome3-subtitle">
      Нажми на точку города на карте Украины
    </p>

    <div class="ukraine-map-shell">
      <img class="ukraine-map-image" src="${MAP_IMG}" alt="Карта Украины" />

      <div class="ukraine-map-points" id="cityPointsLayer"></div>
    </div>

    <div class="city-selection-box">
      <p id="citySelectionText" class="city-selection-text">
        Наведи или нажми на город, чтобы выбрать стартовую точку
      </p>
    </div>

    <button class="btn welcome3-next-btn" id="nextBtn" disabled>
      Далее
    </button>
  `;

  const pointsLayer = root.querySelector('#cityPointsLayer');
  const citySelectionText = root.querySelector('#citySelectionText');
  const nextBtn = root.querySelector('#nextBtn');

  let selectedCity = CITY_POINTS.find((city) => city.id === state.city) || null;
  let pointElements = [];

  function setSelectionText(text) {
    citySelectionText.textContent = text;
  }

  function updateButtonsState() {
    pointElements.forEach((btn) => {
      const isSelected = selectedCity && btn.dataset.cityId === selectedCity.id;
      btn.classList.toggle('is-selected', Boolean(isSelected));
    });

    if (selectedCity) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
      setSelectionText(`Выбран город: ${selectedCity.name}`);
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      setSelectionText('Наведи или нажми на город, чтобы выбрать стартовую точку');
    }
  }

  function previewCity(city) {
    if (selectedCity && selectedCity.id === city.id) {
      setSelectionText(`Выбран город: ${city.name}`);
      return;
    }

    setSelectionText(`Вы хотите выбрать ${city.name}?`);
  }

  function resetPreview() {
    if (selectedCity) {
      setSelectionText(`Выбран город: ${selectedCity.name}`);
    } else {
      setSelectionText('Наведи или нажми на город, чтобы выбрать стартовую точку');
    }
  }

  function selectCity(city) {
    selectedCity = city;

    state.city = city.id;
    state.cityName = city.name;
    save();

    updateButtonsState();
  }

  CITY_POINTS.forEach((city) => {
    const pointBtn = document.createElement('button');
    pointBtn.type = 'button';
    pointBtn.className = 'city-point';
    pointBtn.dataset.cityId = city.id;
    pointBtn.dataset.name = city.name;
    pointBtn.setAttribute('aria-label', city.name);
    pointBtn.title = city.name;

    pointBtn.style.left = `${city.x}%`;
    pointBtn.style.top = `${city.y}%`;

    pointBtn.addEventListener('mouseenter', () => previewCity(city));
    pointBtn.addEventListener('mouseleave', resetPreview);

    pointBtn.addEventListener('focus', () => previewCity(city));
    pointBtn.addEventListener('blur', resetPreview);

    pointBtn.addEventListener('click', () => {
      selectCity(city);
    });

    pointsLayer.appendChild(pointBtn);
    pointElements.push(pointBtn);
  });

  updateButtonsState();

  nextBtn.addEventListener('click', () => {
    if (!selectedCity) {
      alert('Сначала выбери город на карте');
      return;
    }

    show('home');
  });
});
