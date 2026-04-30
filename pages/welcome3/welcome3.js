import { register, show } from '../../src/router.js';
import { state, save } from '../../src/state.js';

const MAP_IMG = './UkraineMap.png?v=9';
const REGIONS_SVG = './ua.svg?v=5';

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

const CITY_META = {
  zaporizhzhia: {
    image: './pages/welcome3/cities/zaporizhzhia.jpg',
    title: 'Запорожье',
    subtitle: 'Индустриальный стартовый регион',
    property: 128,
    cars: 64,
    houses: 42,
    jobs: ['Завод', 'Доставка', 'СТО'],
    inflation: 'Средняя',
    devaluation: 'Умеренная',
    economy: 'Стабильная экономика для старта'
  },

  kyiv: {
    image: './pages/welcome3/cities/kyiv.jpg',
    title: 'Киев',
    subtitle: 'Большие деньги, высокая конкуренция',
    property: 340,
    cars: 210,
    houses: 96,
    jobs: ['Офис', 'Курьерка', 'IT'],
    inflation: 'Высокая',
    devaluation: 'Средняя',
    economy: 'Дорогой, но прибыльный регион'
  },

  dnipro: {
    image: './pages/welcome3/cities/dnipro.jpg',
    title: 'Днепр',
    subtitle: 'Баланс бизнеса и рабочих профессий',
    property: 220,
    cars: 135,
    houses: 71,
    jobs: ['Склад', 'Мастерская', 'Логистика'],
    inflation: 'Средняя',
    devaluation: 'Средняя',
    economy: 'Сбалансированная экономика'
  },

  odesa: {
    image: './pages/welcome3/cities/odesa.jpg',
    title: 'Одесса',
    subtitle: 'Торговля, туризм и быстрые деньги',
    property: 250,
    cars: 180,
    houses: 84,
    jobs: ['Порт', 'Такси', 'Торговля'],
    inflation: 'Высокая',
    devaluation: 'Умеренная',
    economy: 'Регион с быстрым оборотом денег'
  },

  lviv: {
    image: './pages/welcome3/cities/lviv.jpg',
    title: 'Львов',
    subtitle: 'Туризм, сервис и стабильный рост',
    property: 190,
    cars: 118,
    houses: 60,
    jobs: ['Кафе', 'Отель', 'Курьер'],
    inflation: 'Средняя',
    devaluation: 'Низкая',
    economy: 'Спокойный регион для постепенного развития'
  },

  default: {
    image: './pages/welcome3/cities/default.jpg',
    title: 'Регион Украины',
    subtitle: 'Стартовая зона для развития персонажа',
    property: 90,
    cars: 45,
    houses: 30,
    jobs: ['Подработка', 'Доставка', 'Склад'],
    inflation: 'Средняя',
    devaluation: 'Умеренная',
    economy: 'Базовая экономика региона'
  }
};

register('welcome3', (root) => {
  root.className = 'page welcome-page welcome3';

  root.innerHTML = `
    <div class="welcome-bg"></div>

    <div class="welcome3-loader" id="welcome3Loader">
      <div class="loader-logo">MN</div>
      <div class="loader-title">Загрузка карты</div>
      <div class="loader-text">Подготавливаем области Украины...</div>
      <div class="loader-bar"><span></span></div>
    </div>

    <section class="welcome-card welcome3-card">
      <div class="welcome-logo">MN</div>

      <div class="welcome-header">
        <p class="welcome-step">Шаг 3 / 3</p>
        <h2 class="welcome-title">Выбери город</h2>
        <p class="welcome-subtitle">
          Открой карту, найди область и изучи экономику региона.
        </p>
      </div>

      <div class="compact-map-card">
        <div class="compact-map">
          <img class="compact-map-image" src="${MAP_IMG}" alt="Карта Украины" />
          <div class="compact-regions-layer" id="compactRegionsLayer">
            <div class="map-loading">Загрузка...</div>
          </div>
        </div>
      </div>

      <div class="city-selection-box">
        <span id="citySelectionText">Город пока не выбран</span>
      </div>

      <div class="welcome-actions">
        <button class="welcome-btn secondary open-map-btn" id="openMapBtn" type="button">
          Открыть карту
        </button>

        <button class="welcome-btn primary next-btn" id="nextBtn" type="button" disabled>
          Далее
        </button>
      </div>
    </section>

    <div class="map-modal hidden" id="mapModal">
      <div class="map-modal-panel">
        <div class="map-modal-header">
          <div>
            <h3>Выбор стартового города</h3>
            <p>Двигай карту одним пальцем, приближай двумя. Тап по области открывает экономику города.</p>
          </div>

          <button class="close-map-btn" id="closeMapBtn" type="button" aria-label="Закрыть карту">
            ×
          </button>
        </div>

        <div class="full-map-viewport" id="fullMapViewport">
          <div class="full-map-content" id="fullMapContent">
            <img class="full-map-image" src="${MAP_IMG}" alt="Карта Украины" />
            <div class="full-regions-layer" id="fullRegionsLayer">
              <div class="map-loading">Загрузка областей...</div>
            </div>
          </div>
        </div>

        <div class="city-preview-card" id="cityPreviewCard">
          <div class="city-preview-empty">
            Выбери область на карте, чтобы увидеть экономику города
          </div>
        </div>

        <button class="welcome-btn primary confirm-city-btn" id="confirmCityBtn" type="button" disabled>
          Подтвердить выбор
        </button>
      </div>
    </div>
  `;

  const loader = root.querySelector('#welcome3Loader');
  const compactRegionsLayer = root.querySelector('#compactRegionsLayer');
  const fullRegionsLayer = root.querySelector('#fullRegionsLayer');
  const citySelectionText = root.querySelector('#citySelectionText');
  const cityPreviewCard = root.querySelector('#cityPreviewCard');
  const nextBtn = root.querySelector('#nextBtn');
  const openMapBtn = root.querySelector('#openMapBtn');
  const mapModal = root.querySelector('#mapModal');
  const closeMapBtn = root.querySelector('#closeMapBtn');
  const confirmCityBtn = root.querySelector('#confirmCityBtn');
  const fullMapViewport = root.querySelector('#fullMapViewport');
  const fullMapContent = root.querySelector('#fullMapContent');

  let svgTextCache = '';
  let selectedRegion = null;
  let pendingRegion = null;
  let compactRegionElements = [];
  let fullRegionElements = [];
  let visualFrame = null;
  let transformFrame = null;

  const isTouchDevice =
    window.matchMedia('(pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const view = {
    x: 0,
    y: 0,
    scale: 1.55,
    rotate: 0
  };

  const pointers = new Map();

  const gesture = {
    mode: 'none',
    moved: false,
    isTouch: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    startDistance: 0,
    baseScale: 1
  };

  function makeRegionInfo(regionId) {
    const regionData = REGION_DATA[regionId];

    if (!regionData) {
      return null;
    }

    return {
      regionId,
      cityId: regionData.cityId,
      cityName: regionData.cityName
    };
  }

  function getCityMeta(regionInfo) {
    if (!regionInfo) {
      return CITY_META.default;
    }

    return CITY_META[regionInfo.cityId] || {
      ...CITY_META.default,
      title: regionInfo.cityName
    };
  }

  function renderCityPreview(regionInfo) {
    if (!regionInfo) {
      cityPreviewCard.innerHTML = `
        <div class="city-preview-empty">
          Выбери область на карте, чтобы увидеть экономику города
        </div>
      `;
      return;
    }

    const meta = getCityMeta(regionInfo);

    cityPreviewCard.innerHTML = `
      <div class="city-preview-top">
        <div class="city-preview-image">
          <img src="${meta.image}" alt="${meta.title}" />
        </div>

        <div class="city-preview-main">
          <h4>${meta.title}</h4>
          <p>${meta.subtitle}</p>
        </div>
      </div>

      <div class="city-preview-grid">
        <div class="city-preview-stat">
          <span>Имущество</span>
          <strong>${meta.property}</strong>
        </div>

        <div class="city-preview-stat">
          <span>Машины</span>
          <strong>${meta.cars}</strong>
        </div>

        <div class="city-preview-stat">
          <span>Дома</span>
          <strong>${meta.houses}</strong>
        </div>

        <div class="city-preview-stat">
          <span>Инфляция</span>
          <strong>${meta.inflation}</strong>
        </div>
      </div>

      <div class="city-preview-economy">
        <span>Экономика</span>
        <p>${meta.economy}</p>
      </div>

      <div class="city-preview-jobs">
        <span>Работы региона</span>
        <div>
          ${meta.jobs.map((job) => `<b>${job}</b>`).join('')}
        </div>
      </div>

      <div class="city-preview-warning">
        Девальвация: ${meta.devaluation}
      </div>
    `;
  }

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }

  async function preloadAssets() {
    const [svgResponse] = await Promise.all([
      fetch(REGIONS_SVG),
      preloadImage(MAP_IMG)
    ]);

    if (!svgResponse.ok) {
      throw new Error(`SVG load error: ${svgResponse.status}`);
    }

    svgTextCache = await svgResponse.text();
  }

  function setMainText(text) {
    citySelectionText.textContent = text;
  }

  function getAllRegions() {
    return [...compactRegionElements, ...fullRegionElements];
  }

  function updateVisualState() {
    if (visualFrame) {
      cancelAnimationFrame(visualFrame);
    }

    visualFrame = requestAnimationFrame(() => {
      const allRegions = getAllRegions();

      allRegions.forEach((regionEl) => {
        regionEl.classList.remove('is-selected', 'is-pending');
      });

      const activeRegion = pendingRegion || selectedRegion;

      allRegions.forEach((regionEl) => {
        const isActive = activeRegion && regionEl.id === activeRegion.regionId;

        if (!isActive) {
          return;
        }

        if (pendingRegion) {
          regionEl.classList.add('is-pending');
        } else {
          regionEl.classList.add('is-selected');
        }
      });

      if (selectedRegion) {
        nextBtn.disabled = false;
        nextBtn.classList.add('active');
        setMainText(`Выбран город: ${selectedRegion.cityName}`);
      } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove('active');
        setMainText('Город пока не выбран');
      }

      if (pendingRegion) {
        confirmCityBtn.disabled = false;
        confirmCityBtn.classList.add('active');
      } else {
        confirmCityBtn.disabled = true;
        confirmCityBtn.classList.remove('active');
      }

      visualFrame = null;
    });
  }

  function previewRegion(regionInfo) {
    if (!regionInfo || isTouchDevice) {
      return;
    }

    renderCityPreview(regionInfo);
  }

  function resetPreview() {
    if (pendingRegion) {
      renderCityPreview(pendingRegion);
      return;
    }

    renderCityPreview(null);
  }

  function choosePendingRegion(regionInfo) {
    if (!regionInfo) {
      return;
    }

    pendingRegion = regionInfo;

    renderCityPreview(regionInfo);
    updateVisualState();
  }

  function confirmRegion() {
    if (!pendingRegion) {
      return;
    }

    selectedRegion = pendingRegion;
    pendingRegion = null;

    state.city = selectedRegion.cityId;
    state.cityName = selectedRegion.cityName;
    state.regionId = selectedRegion.regionId;

    save();

    mapModal.classList.add('hidden');
    renderCityPreview(null);
    updateVisualState();
  }

  function applyTransform() {
    if (transformFrame) {
      return;
    }

    transformFrame = requestAnimationFrame(() => {
      view.rotate = 0;

      fullMapContent.style.transform = `
        translate3d(${view.x}px, ${view.y}px, 0)
        scale(${view.scale})
      `;

      transformFrame = null;
    });
  }

  function resetTransform() {
    view.x = 0;
    view.y = 0;
    view.scale = isTouchDevice ? 1.42 : 1.55;
    view.rotate = 0;

    applyTransform();
  }

  function clampView() {
    view.scale = Math.max(1, Math.min(3.4, view.scale));
    view.rotate = 0;

    const maxOffset = 460 * view.scale;

    view.x = Math.max(-maxOffset, Math.min(maxOffset, view.x));
    view.y = Math.max(-maxOffset, Math.min(maxOffset, view.y));
  }

  function distance(a, b) {
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

  function startPan(pointer) {
    gesture.mode = 'pan';
    gesture.moved = false;
    gesture.isTouch = pointer.pointerType === 'touch' || pointer.pointerType === 'pen';
    gesture.startX = pointer.clientX;
    gesture.startY = pointer.clientY;
    gesture.baseX = view.x;
    gesture.baseY = view.y;
  }

  function startPinch() {
    const pts = [...pointers.values()];

    if (pts.length < 2) {
      return;
    }

    gesture.mode = 'pinch';
    gesture.moved = false;
    gesture.isTouch = pts.some((point) => point.pointerType === 'touch' || point.pointerType === 'pen');

    gesture.startDistance = distance(pts[0], pts[1]);
    gesture.baseScale = view.scale;
    gesture.baseX = view.x;
    gesture.baseY = view.y;
    gesture.startX = (pts[0].clientX + pts[1].clientX) / 2;
    gesture.startY = (pts[0].clientY + pts[1].clientY) / 2;
  }

  function onPointerDown(event) {
    const isMouse = event.pointerType === 'mouse';
    const isTouch = event.pointerType === 'touch' || event.pointerType === 'pen';

    if (isMouse && event.button !== 2) {
      return;
    }

    if (isMouse) {
      event.preventDefault();
    }

    pointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType
    });

    fullMapViewport.setPointerCapture?.(event.pointerId);

    if (isTouch && pointers.size === 1) {
      startPan(event);
      return;
    }

    if (isTouch && pointers.size === 2) {
      startPinch();
      return;
    }

    if (isMouse) {
      startPan(event);
    }
  }

  function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) {
      return;
    }

    pointers.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType
    });

    if (gesture.mode === 'pan' && pointers.size === 1) {
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;

      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        gesture.moved = true;
      }

      view.x = gesture.baseX + dx;
      view.y = gesture.baseY + dy;
      view.rotate = 0;

      clampView();
      applyTransform();
      return;
    }

    if (gesture.mode === 'pinch' && pointers.size >= 2) {
      const pts = [...pointers.values()];

      const currentDistance = distance(pts[0], pts[1]);
      const scaleRatio = currentDistance / gesture.startDistance;

      const midX = (pts[0].clientX + pts[1].clientX) / 2;
      const midY = (pts[0].clientY + pts[1].clientY) / 2;

      view.scale = gesture.baseScale * scaleRatio;
      view.x = gesture.baseX + (midX - gesture.startX);
      view.y = gesture.baseY + (midY - gesture.startY);
      view.rotate = 0;

      clampView();

      gesture.moved = true;

      applyTransform();
    }
  }

  function onPointerUp(event) {
    pointers.delete(event.pointerId);

    if (pointers.size === 1) {
      const remainingPointer = [...pointers.values()][0];

      startPan({
        clientX: remainingPointer.clientX,
        clientY: remainingPointer.clientY,
        pointerType: remainingPointer.pointerType
      });

      return;
    }

    if (pointers.size === 0) {
      gesture.mode = 'none';
      gesture.isTouch = false;
    }

    fullMapViewport.releasePointerCapture?.(event.pointerId);
  }

  function onWheel(event) {
    event.preventDefault();

    if (event.deltaY > 0) {
      view.scale -= 0.12;
    } else {
      view.scale += 0.12;
    }

    view.rotate = 0;

    clampView();
    applyTransform();
  }

  function prepareSvg(svg, mode) {
    svg.classList.add('ukraine-regions-svg');
    svg.classList.add(mode);

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    svg.querySelectorAll('*').forEach((el) => {
      el.style.pointerEvents = 'none';
    });

    svg.querySelectorAll(
      '#points, #label_points, text, circle, rect, line, polyline, ellipse'
    ).forEach((el) => {
      el.style.display = 'none';
    });

    const regions = Array.from(svg.querySelectorAll('path[id], polygon[id]'));

    regions.forEach((region) => {
      const hasRegionData = Boolean(REGION_DATA[region.id]);

      if (!hasRegionData) {
        region.style.display = 'none';
        return;
      }

      region.style.display = '';
      region.style.pointerEvents = mode === 'full' ? 'all' : 'none';
    });

    return regions.filter((region) => REGION_DATA[region.id]);
  }

  function setupRegion(path, storage, mode) {
    const regionInfo = makeRegionInfo(path.id);

    path.classList.add('ukraine-region');

    if (!regionInfo) {
      path.classList.add('is-disabled');
      return;
    }

    path.classList.add('is-selectable');

    path.dataset.cityId = regionInfo.cityId;
    path.dataset.cityName = regionInfo.cityName;
    path.style.pointerEvents = mode === 'full' ? 'all' : 'none';

    if (state.regionId === regionInfo.regionId || state.city === regionInfo.cityId) {
      selectedRegion = regionInfo;
    }

    if (mode === 'full') {
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', regionInfo.cityName);

      if (!isTouchDevice) {
        path.addEventListener('mouseenter', () => previewRegion(regionInfo));
        path.addEventListener('mouseleave', resetPreview);
        path.addEventListener('focus', () => previewRegion(regionInfo));
        path.addEventListener('blur', resetPreview);
      }

      path.addEventListener('pointerdown', (event) => {
        const isMouseLeft = event.pointerType === 'mouse' && event.button === 0;

        if (isMouseLeft) {
          event.preventDefault();
          event.stopPropagation();
        }
      });

      path.addEventListener('pointerup', (event) => {
        const isMouseLeft = event.pointerType === 'mouse' && event.button === 0;
        const isTouchTap = event.pointerType !== 'mouse' && !gesture.moved;

        if (!isMouseLeft && !isTouchTap) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        choosePendingRegion(regionInfo);
      });

      path.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (gesture.moved) {
          return;
        }

        choosePendingRegion(regionInfo);
      });

      path.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choosePendingRegion(regionInfo);
        }
      });
    }

    storage.push(path);
  }

  function loadSvgInto(layer, storage, mode) {
    layer.innerHTML = svgTextCache;

    const svg = layer.querySelector('svg');

    if (!svg) {
      throw new Error('SVG tag not found');
    }

    const regions = prepareSvg(svg, mode);

    regions.forEach((path) => {
      setupRegion(path, storage, mode);
    });
  }

  async function initRegions() {
    try {
      await preloadAssets();

      loadSvgInto(compactRegionsLayer, compactRegionElements, 'compact');
      loadSvgInto(fullRegionsLayer, fullRegionElements, 'full');

      updateVisualState();

      loader.classList.add('is-hidden');

      setTimeout(() => {
        loader.remove();
      }, 280);
    } catch (error) {
      console.error(error);

      loader.classList.add('is-hidden');

      compactRegionsLayer.innerHTML = `
        <div class="map-error">Ошибка загрузки SVG</div>
      `;

      fullRegionsLayer.innerHTML = `
        <div class="map-error">Ошибка загрузки SVG</div>
      `;

      setMainText('Ошибка загрузки карты областей');
    }
  }

  openMapBtn.addEventListener('click', () => {
    mapModal.classList.remove('hidden');

    pendingRegion = null;
    pointers.clear();

    gesture.mode = 'none';
    gesture.moved = false;
    gesture.isTouch = false;

    renderCityPreview(null);
    resetTransform();
    updateVisualState();
  });

  closeMapBtn.addEventListener('click', () => {
    mapModal.classList.add('hidden');

    pendingRegion = null;
    pointers.clear();

    gesture.mode = 'none';
    gesture.moved = false;
    gesture.isTouch = false;

    renderCityPreview(null);
    updateVisualState();
  });

  confirmCityBtn.addEventListener('click', confirmRegion);

  nextBtn.addEventListener('click', () => {
    if (!selectedRegion) {
      alert('Сначала выбери город на карте');
      return;
    }

    show('home');
  });

  fullMapViewport.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  fullMapViewport.addEventListener('pointerdown', onPointerDown);
  fullMapViewport.addEventListener('pointermove', onPointerMove);
  fullMapViewport.addEventListener('pointerup', onPointerUp);
  fullMapViewport.addEventListener('pointercancel', onPointerUp);
  fullMapViewport.addEventListener('wheel', onWheel, { passive: false });

  initRegions();
});
