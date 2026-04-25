import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

const MAP_IMG = './UkraineMap.png?v=7';
const REGIONS_SVG = './ua.svg?v=1';

const REGION_DATA = {
  UA05: { cityId: 'vinnytsia', cityName: 'Винница' },
  UA07: { cityId: 'lutsk', cityName: 'Луцк' },
  UA09: { cityId: 'luhansk', cityName: 'Луганск' },
  UA12: { cityId: 'dnipro', cityName: 'Днепр' },
  UA14: { cityId: 'donetsk', cityName: 'Донецк' },
  UA18: { cityId: 'zhytomyr', cityName: 'Житомир' },
  UA21: { cityId: 'uzhhorod', cityName: 'Ужгород' },
  UA23: { cityId: 'zaporizhzhia', cityName: 'Запорожье' },
  UA26: { cityId: 'ivano-frankivsk', cityName: 'Ивано-Франковск' },
  UA30: { cityId: 'kyiv', cityName: 'Киев' },
  UA32: { cityId: 'kyiv', cityName: 'Киев' },
  UA35: { cityId: 'kropyvnytskyi', cityName: 'Кропивницкий' },
  UA43: { cityId: 'crimea', cityName: 'Крым' },
  UA46: { cityId: 'lviv', cityName: 'Львов' },
  UA48: { cityId: 'mykolaiv', cityName: 'Николаев' },
  UA51: { cityId: 'odesa', cityName: 'Одесса' },
  UA53: { cityId: 'poltava', cityName: 'Полтава' },
  UA56: { cityId: 'rivne', cityName: 'Ровно' },
  UA59: { cityId: 'sumy', cityName: 'Сумы' },
  UA61: { cityId: 'ternopil', cityName: 'Тернополь' },
  UA63: { cityId: 'kharkiv', cityName: 'Харьков' },
  UA65: { cityId: 'kherson', cityName: 'Херсон' },
  UA68: { cityId: 'khmelnytskyi', cityName: 'Хмельницкий' },
  UA71: { cityId: 'cherkasy', cityName: 'Черкассы' },
  UA74: { cityId: 'chernihiv', cityName: 'Чернигов' },
  UA77: { cityId: 'chernivtsi', cityName: 'Черновцы' }
};

register('welcome3', (root) => {
  root.className = 'page welcome3';

  root.innerHTML = `
    <h2>Выбери стартовый город</h2>

    <p class="welcome3-subtitle">
      Наведи или нажми на область на карте Украины
    </p>

    <div class="ukraine-map-shell">
      <img class="ukraine-map-image" src="${MAP_IMG}" alt="Карта Украины" />

      <div class="regions-layer" id="regionsLayer">
        <div class="regions-loading">Загрузка областей...</div>
      </div>
    </div>

    <div class="city-selection-box">
      <p id="citySelectionText" class="city-selection-text">
        Наведи или нажми на область
      </p>
    </div>

    <button class="btn welcome3-next-btn" id="nextBtn" disabled>
      Далее
    </button>
  `;

  const regionsLayer = root.querySelector('#regionsLayer');
  const citySelectionText = root.querySelector('#citySelectionText');
  const nextBtn = root.querySelector('#nextBtn');

  let selectedRegion = null;
  let regionElements = [];

  function setText(text) {
    citySelectionText.textContent = text;
  }

  function updateSelection() {
    regionElements.forEach((regionEl) => {
      const isSelected = selectedRegion && regionEl.id === selectedRegion.regionId;
      regionEl.classList.toggle('is-selected', Boolean(isSelected));
    });

    if (selectedRegion) {
      nextBtn.disabled = false;
      nextBtn.classList.add('active');
      setText(`Выбран город: ${selectedRegion.cityName}`);
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('active');
      setText('Наведи или нажми на область');
    }
  }

  function previewRegion(regionInfo) {
    if (selectedRegion && selectedRegion.regionId === regionInfo.regionId) {
      setText(`Выбран город: ${regionInfo.cityName}`);
      return;
    }

    setText(`Вы хотите выбрать ${regionInfo.cityName}?`);
  }

  function resetPreview() {
    if (selectedRegion) {
      setText(`Выбран город: ${selectedRegion.cityName}`);
    } else {
      setText('Наведи или нажми на область');
    }
  }

  function selectRegion(regionInfo) {
    selectedRegion = regionInfo;

    state.city = regionInfo.cityId;
    state.cityName = regionInfo.cityName;
    state.regionId = regionInfo.regionId;
    save();

    updateSelection();
  }

  async function loadRegionsSvg() {
    try {
      const response = await fetch(REGIONS_SVG);

      if (!response.ok) {
        throw new Error(`SVG load error: ${response.status}`);
      }

      const svgText = await response.text();

      regionsLayer.innerHTML = svgText;

      const svg = regionsLayer.querySelector('svg');

      if (!svg) {
        throw new Error('SVG tag not found');
      }

      svg.classList.add('ukraine-regions-svg');
      svg.removeAttribute('width');
      svg.removeAttribute('height');

      const paths = Array.from(svg.querySelectorAll('path[id], polygon[id]'));

      regionElements = [];

      paths.forEach((path) => {
        const regionId = path.id;
        const regionData = REGION_DATA[regionId];

        path.classList.add('ukraine-region');

        if (!regionData) {
          path.classList.add('is-disabled');
          return;
        }

        path.classList.add('is-selectable');
        path.dataset.cityId = regionData.cityId;
        path.dataset.cityName = regionData.cityName;
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', regionData.cityName);

        const regionInfo = {
          regionId,
          cityId: regionData.cityId,
          cityName: regionData.cityName
        };

        if (state.regionId === regionId || state.city === regionData.cityId) {
          selectedRegion = regionInfo;
        }

        path.addEventListener('mouseenter', () => previewRegion(regionInfo));
        path.addEventListener('mouseleave', resetPreview);

        path.addEventListener('focus', () => previewRegion(regionInfo));
        path.addEventListener('blur', resetPreview);

        path.addEventListener('click', () => selectRegion(regionInfo));

        path.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectRegion(regionInfo);
          }
        });

        regionElements.push(path);
      });

      const pointGroups = svg.querySelectorAll('#points, #label_points');
      pointGroups.forEach((group) => {
        group.style.display = 'none';
      });

      updateSelection();
    } catch (error) {
      console.error(error);

      regionsLayer.innerHTML = `
        <div class="regions-error">
          Не удалось загрузить SVG областей
        </div>
      `;

      setText('Ошибка загрузки карты областей');
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!selectedRegion) {
      alert('Сначала выбери область на карте');
      return;
    }

    show('home');
  });

  loadRegionsSvg();
});
