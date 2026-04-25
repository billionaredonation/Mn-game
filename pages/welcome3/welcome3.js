import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

const MAP_IMG = './UkraineMap.png?v=6';

const REGIONS = [
  {
    id: 'lviv',
    name: 'Львов',
    points: '11,31 17,24 26,26 30,35 25,45 14,43'
  },
  {
    id: 'kyiv',
    name: 'Киев',
    points: '44,22 53,21 58,28 55,38 46,39 40,31'
  },
  {
    id: 'kharkiv',
    name: 'Харьков',
    points: '69,26 80,25 86,34 81,44 70,42 65,34'
  },
  {
    id: 'vinnytsia',
    name: 'Винница',
    points: '36,41 47,39 51,49 45,59 34,56 30,47'
  },
  {
    id: 'dnipro',
    name: 'Днепр',
    points: '56,45 67,43 73,52 69,62 58,61 53,52'
  },
  {
    id: 'zaporizhzhia',
    name: 'Запорожье',
    points: '60,58 71,57 76,67 70,77 59,74 54,65'
  },
  {
    id: 'mykolaiv',
    name: 'Николаев',
    points: '45,60 57,59 61,68 55,76 44,74 39,66'
  },
  {
    id: 'odesa',
    name: 'Одесса',
    points: '33,62 45,60 48,73 42,86 31,82 27,70'
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

      <svg class="regions-svg" viewBox="0 0 100 100" preserveAspectRatio="none" id="regionsSvg"></svg>
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

  const svg = root.querySelector('#regionsSvg');
  const citySelectionText = root.querySelector('#citySelectionText');
  const nextBtn = root.querySelector('#nextBtn');

  let selectedRegion = REGIONS.find((region) => region.id === state.city) || null;
  const regionElements = [];

  function setText(text) {
    citySelectionText.textContent = text;
  }

  function updateSelection() {
    regionElements.forEach((regionEl) => {
      const isSelected = selectedRegion && regionEl.dataset.regionId === selectedRegion.id;
      regionEl.classList.toggle('is-selected', Boolean(isSelected));
    });

    if (selectedRegion) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
      setText(`Выбран город: ${selectedRegion.name}`);
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      setText('Наведи или нажми на область города');
    }
  }

  function previewRegion(region) {
    if (selectedRegion && selectedRegion.id === region.id) {
      setText(`Выбран город: ${region.name}`);
      return;
    }

    setText(`Вы хотите выбрать ${region.name}?`);
  }

  function resetPreview() {
    if (selectedRegion) {
      setText(`Выбран город: ${selectedRegion.name}`);
    } else {
      setText('Наведи или нажми на область города');
    }
  }

  function selectRegion(region) {
    selectedRegion = region;

    state.city = region.id;
    state.cityName = region.name;
    save();

    updateSelection();
  }

  REGIONS.forEach((region) => {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    polygon.setAttribute('points', region.points);
    polygon.setAttribute('tabindex', '0');
    polygon.setAttribute('role', 'button');
    polygon.setAttribute('aria-label', region.name);

    polygon.classList.add('region-polygon');
    polygon.dataset.regionId = region.id;

    polygon.addEventListener('mouseenter', () => previewRegion(region));
    polygon.addEventListener('mouseleave', resetPreview);

    polygon.addEventListener('focus', () => previewRegion(region));
    polygon.addEventListener('blur', resetPreview);

    polygon.addEventListener('click', () => selectRegion(region));

    polygon.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectRegion(region);
      }
    });

    svg.appendChild(polygon);
    regionElements.push(polygon);
  });

  updateSelection();

  nextBtn.addEventListener('click', () => {
    if (!selectedRegion) {
      alert('Сначала выбери область на карте');
      return;
    }

    show('home');
  });
});
