import { register, show } from '../../src/router.js?v=91';
import { state, save } from '../../src/state.js?v=91';

const cityMaps = {
  vinnytsia: './VinitsaMap.png',
  lutsk: './LutskMap.png',
  luhansk: './LuganskMap.png',
  dnipro: './DneprMap.png',
  donetsk: './DonetskMap.png',
  zhytomyr: './ZutomyrMap.png',
  uzhhorod: './UzgorodMap.png',
  zaporizhzhia: './Zaporozya.png',
  'ivano-frankivsk': './IvanoFrankovsk.png',
  kyiv: './KiyvMap.png',
  kropyvnytskyi: './Kropivnitskyi.png',
  crimea: './KrymMap.png',
  lviv: './Lviv.png',
  mykolaiv: './Nikolaev.png',
  odesa: './Odessa.png',
  poltava: './Poltava.png',
  rivne: './Rovno.png',
  sumy: './Sumy.png',
  ternopil: './Ternopil.png',
  kharkiv: './Kharkiv.png',
  kherson: './Kherson.png',
  khmelnytskyi: './Khmelnitskiy.png',
  cherkasy: './CherkasyMap.png',
  chernihiv: './ChernigovMap.png',
  chernivtsi: './ChernivtsiMap.png'
};

const cityNames = {
  vinnytsia: 'Винница',
  lutsk: 'Луцк',
  luhansk: 'Луганск',
  dnipro: 'Днепр',
  donetsk: 'Донецк',
  zhytomyr: 'Житомир',
  uzhhorod: 'Ужгород',
  zaporizhzhia: 'Запорожье',
  'ivano-frankivsk': 'Ивано-Франковск',
  kyiv: 'Киев',
  kropyvnytskyi: 'Кропивницкий',
  crimea: 'Крым',
  lviv: 'Львов',
  mykolaiv: 'Николаев',
  odesa: 'Одесса',
  poltava: 'Полтава',
  rivne: 'Ровно',
  sumy: 'Сумы',
  ternopil: 'Тернополь',
  kharkiv: 'Харьков',
  kherson: 'Херсон',
  khmelnytskyi: 'Хмельницкий',
  cherkasy: 'Черкассы',
  chernihiv: 'Чернигов',
  chernivtsi: 'Черновцы'
};

const aliases = {
  odessa: 'odesa',
  kiev: 'kyiv',
  kiyv: 'kyiv',
  zaporizhia: 'zaporizhzhia',
  zaporozhye: 'zaporizhzhia',
  nikolaev: 'mykolaiv',
  rovno: 'rivne'
};

const defaultJobs = [
  {
    id: 'warehouse',
    title: 'Склад',
    short: 'СКЛ',
    x: 32,
    y: 46,
    pay: 240,
    energy: 12,
    xp: 4,
    skill: 'strength',
    description: 'Разгрузка, сортировка и учет товаров. Стабильная работа для старта.'
  },
  {
    id: 'farm',
    title: 'Ферма',
    short: 'ФЕР',
    x: 68,
    y: 58,
    pay: 190,
    energy: 8,
    xp: 3,
    skill: 'endurance',
    description: 'Спокойная работа на хозяйстве. Меньше денег, зато мягче по энергии.'
  },
  {
    id: 'service',
    title: 'Сервис',
    short: 'СРВ',
    x: 52,
    y: 34,
    pay: 260,
    energy: 10,
    xp: 4,
    skill: 'charisma',
    description: 'Обслуживание клиентов и мелкие поручения по городу.'
  }
];

const cityJobs = {
  zaporizhzhia: [
    defaultJobs[0],
    {
      id: 'factory',
      title: 'Завод',
      short: 'ЗВД',
      x: 66,
      y: 42,
      pay: 350,
      energy: 16,
      xp: 6,
      skill: 'endurance',
      description: 'Производственная смена. Хорошие деньги, высокая усталость.'
    },
    defaultJobs[2]
  ],
  odesa: [
    {
      id: 'port',
      title: 'Порт',
      short: 'ПРТ',
      x: 42,
      y: 62,
      pay: 330,
      energy: 15,
      xp: 5,
      skill: 'strength',
      description: 'Погрузка, складирование и работа у причала.'
    },
    {
      id: 'taxi',
      title: 'Такси',
      short: 'ТКС',
      x: 65,
      y: 38,
      pay: 270,
      energy: 9,
      xp: 4,
      skill: 'charisma',
      description: 'Городские поездки и быстрый оборот денег.'
    },
    defaultJobs[2]
  ],
  kyiv: [
    {
      id: 'office',
      title: 'Офис',
      short: 'ОФС',
      x: 50,
      y: 38,
      pay: 300,
      energy: 10,
      xp: 5,
      skill: 'intellect',
      description: 'Административная работа, документы и первые деловые связи.'
    },
    {
      id: 'courier',
      title: 'Курьер',
      short: 'КУР',
      x: 34,
      y: 61,
      pay: 260,
      energy: 12,
      xp: 4,
      skill: 'endurance',
      description: 'Доставка заказов по городу.'
    },
    defaultJobs[0]
  ],
  lviv: [
    {
      id: 'cafe',
      title: 'Кафе',
      short: 'КФЕ',
      x: 46,
      y: 52,
      pay: 230,
      energy: 8,
      xp: 4,
      skill: 'charisma',
      description: 'Работа с гостями, чаевые и быстрый старт.'
    },
    defaultJobs[1],
    defaultJobs[2]
  ]
};

function normalizeCityId(cityId) {
  return aliases[cityId] || cityId || 'zaporizhzhia';
}

function getCity() {
  const id = normalizeCityId(state.city || (state.player && state.player.city));
  const safeId = cityMaps[id] ? id : 'zaporizhzhia';

  return {
    id: safeId,
    name: cityNames[safeId] || 'Запорожье',
    map: (cityMaps[safeId] || './Zaporozya.png') + '?v=91',
    jobs: cityJobs[safeId] || defaultJobs
  };
}

function ensurePlayer() {
  state.player = state.player || {};

  if (typeof state.player.money !== 'number') state.player.money = 0;
  if (typeof state.player.energy !== 'number') state.player.energy = 100;
  if (typeof state.player.xp !== 'number') state.player.xp = 0;

  state.player.skills = state.player.skills || {};
  if (typeof state.player.skills.strength !== 'number') state.player.skills.strength = 1;
  if (typeof state.player.skills.endurance !== 'number') state.player.skills.endurance = 1;
  if (typeof state.player.skills.intellect !== 'number') state.player.skills.intellect = 1;
  if (typeof state.player.skills.charisma !== 'number') state.player.skills.charisma = 1;

  return state.player;
}

register('home', (root) => {
  try {
    renderHome(root);
  } catch (error) {
    console.error(error);
    root.className = 'page home';
    root.innerHTML = `
      <div style="padding:20px;color:white;font-family:Arial">
        <h3>Ошибка главного меню</h3>
        <pre style="white-space:pre-wrap">${error.message || error}</pre>
      </div>
    `;
  }
});

function renderHome(root) {
  root.className = 'page home';

  const city = getCity();
  const player = ensurePlayer();

  state.city = city.id;
  state.cityName = city.name;
  save();

  let selectedJob = null;

  const camera = {
    x: 0,
    y: 0,
    scale: 1,
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0
  };

  root.innerHTML = `
    <div class="home-stage">
      <div class="home-map-viewport" id="mapViewport">
        <div class="home-map-world" id="mapWorld">
          <div class="map-depth"></div>
          <img class="city-map-image" id="cityMapImage" src="${city.map}" alt="${city.name}" />
          <div class="map-vignette"></div>
          <div class="map-light"></div>
          <div class="job-points" id="jobPoints"></div>
        </div>
      </div>

      <div class="home-hud">
        <button class="hud-btn" id="profileBtn" type="button">Профиль</button>
        <div class="hud-city">
          <span>${city.name}</span>
          <small>${state.nickname || 'игрок'}</small>
        </div>
        <button class="hud-btn" id="skillsBtn" type="button">Навыки</button>
      </div>

      <div class="player-strip">
        <span>Деньги <b id="moneyValue">${player.money}</b></span>
        <span>Энергия <b id="energyValue">${player.energy}</b></span>
        <span>Опыт <b id="xpValue">${Math.floor(player.xp)}</b></span>
      </div>

      <button class="center-map-btn" id="centerMapBtn" type="button">Центр</button>

      <div class="home-panel hidden" id="infoPanel"></div>
    </div>
  `;

  const mapViewport = root.querySelector('#mapViewport');
  const mapWorld = root.querySelector('#mapWorld');
  const jobPoints = root.querySelector('#jobPoints');
  const infoPanel = root.querySelector('#infoPanel');
  const cityMapImage = root.querySelector('#cityMapImage');

  cityMapImage.onerror = () => {
    cityMapImage.src = './UkraineMap.png?v=91';
  };

  function updateStats() {
    root.querySelector('#moneyValue').textContent = player.money;
    root.querySelector('#energyValue').textContent = player.energy;
    root.querySelector('#xpValue').textContent = Math.floor(player.xp);
  }

  function applyCamera() {
    mapWorld.style.transform =
      'translate(calc(-50% + ' + camera.x + 'px), calc(-50% + ' + camera.y + 'px)) scale(' + camera.scale + ') rotateX(7deg)';
  }

  function clampCamera() {
    const maxOffset = 360 * camera.scale;

    camera.scale = Math.max(0.86, Math.min(2.7, camera.scale));
    camera.x = Math.max(-maxOffset, Math.min(maxOffset, camera.x));
    camera.y = Math.max(-maxOffset, Math.min(maxOffset, camera.y));
  }

  function centerMap() {
    camera.x = 0;
    camera.y = 0;
    camera.scale = 1;
    applyCamera();
  }

  function showPanel(html) {
    infoPanel.innerHTML = html;
    infoPanel.classList.remove('hidden');
  }

  function closePanel() {
    infoPanel.classList.add('hidden');
    selectedJob = null;
  }

  function renderJobs() {
    jobPoints.innerHTML = city.jobs.map((job) => `
      <button
        class="job-point"
        data-job-id="${job.id}"
        type="button"
        style="left:${job.x}%;top:${job.y}%"
        aria-label="${job.title}"
      >
        <span>${job.short}</span>
      </button>
    `).join('');

    city.jobs.forEach((job) => {
      const btn = jobPoints.querySelector('[data-job-id="' + job.id + '"]');

      btn.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectJob(job);
      };
    });
  }

  function selectJob(job) {
    selectedJob = job;

    showPanel(`
      <div class="panel-head">
        <div>
          <span class="panel-kicker">Работа</span>
          <h3>${job.title}</h3>
        </div>
        <button class="panel-close" id="closePanelBtn" type="button">×</button>
      </div>

      <p>${job.description}</p>

      <div class="job-stats">
        <span>Доход <b>${job.pay}</b></span>
        <span>Энергия <b>-${job.energy}</b></span>
        <span>Опыт <b>+${job.xp}</b></span>
      </div>

      <button class="work-btn" id="workBtn" type="button">Поработать</button>
    `);

    root.querySelector('#closePanelBtn').onclick = closePanel;
    root.querySelector('#workBtn').onclick = workSelectedJob;
  }

  function workSelectedJob() {
    if (!selectedJob) return;

    if (player.energy < selectedJob.energy) {
      showPanel(`
        <div class="panel-head">
          <div>
            <span class="panel-kicker">Недостаточно энергии</span>
            <h3>${selectedJob.title}</h3>
          </div>
          <button class="panel-close" id="closePanelBtn" type="button">×</button>
        </div>
        <p>Нужно ${selectedJob.energy} энергии. Сейчас у тебя ${player.energy}.</p>
      `);

      root.querySelector('#closePanelBtn').onclick = closePanel;
      return;
    }

    player.money += selectedJob.pay;
    player.energy = Math.max(0, player.energy - selectedJob.energy);
    player.xp += selectedJob.xp;

    if (selectedJob.skill && player.skills[selectedJob.skill]) {
      player.skills[selectedJob.skill] += 0.05;
    }

    save();
    updateStats();

    showPanel(`
      <div class="panel-head">
        <div>
          <span class="panel-kicker">Смена завершена</span>
          <h3>${selectedJob.title}</h3>
        </div>
        <button class="panel-close" id="closePanelBtn" type="button">×</button>
      </div>

      <p>Ты заработал ${selectedJob.pay}, получил ${selectedJob.xp} опыта и потратил ${selectedJob.energy} энергии.</p>

      <button class="work-btn" id="workBtn" type="button">Поработать еще</button>
    `);

    root.querySelector('#closePanelBtn').onclick = closePanel;
    root.querySelector('#workBtn').onclick = workSelectedJob;
  }

  function showProfile() {
    showPanel(`
      <div class="panel-head">
        <div>
          <span class="panel-kicker">Игрок</span>
          <h3>${state.nickname || 'Игрок'}</h3>
        </div>
        <button class="panel-close" id="closePanelBtn" type="button">×</button>
      </div>

      <p>Город: ${city.name}</p>

      <div class="job-stats">
        <span>Деньги <b>${player.money}</b></span>
        <span>Энергия <b>${player.energy}</b></span>
        <span>Опыт <b>${Math.floor(player.xp)}</b></span>
      </div>

      <button class="reset-btn" id="resetBtn" type="button">Сбросить прогресс</button>
    `);

    root.querySelector('#closePanelBtn').onclick = closePanel;
    root.querySelector('#resetBtn').onclick = resetProgress;
  }

  function showSkills() {
    showPanel(`
      <div class="panel-head">
        <div>
          <span class="panel-kicker">Развитие</span>
          <h3>Навыки</h3>
        </div>
        <button class="panel-close" id="closePanelBtn" type="button">×</button>
      </div>

      <div class="skills-list">
        <span>Сила <b>${player.skills.strength.toFixed(1)}</b></span>
        <span>Выносливость <b>${player.skills.endurance.toFixed(1)}</b></span>
        <span>Интеллект <b>${player.skills.intellect.toFixed(1)}</b></span>
        <span>Харизма <b>${player.skills.charisma.toFixed(1)}</b></span>
      </div>
    `);

    root.querySelector('#closePanelBtn').onclick = closePanel;
  }

  function resetProgress() {
    localStorage.removeItem('mn-game-state');

    state.nickname = null;
    state.city = null;
    state.cityName = null;
    state.regionId = null;
    state.player = {};

    show('welcome1');
  }

  mapViewport.addEventListener('pointerdown', (event) => {
    camera.dragging = true;
    camera.startX = event.clientX;
    camera.startY = event.clientY;
    camera.baseX = camera.x;
    camera.baseY = camera.y;

    if (mapViewport.setPointerCapture) {
      mapViewport.setPointerCapture(event.pointerId);
    }
  });

  mapViewport.addEventListener('pointermove', (event) => {
    if (!camera.dragging) return;

    camera.x = camera.baseX + event.clientX - camera.startX;
    camera.y = camera.baseY + event.clientY - camera.startY;

    clampCamera();
    applyCamera();
  });

  mapViewport.addEventListener('pointerup', (event) => {
    camera.dragging = false;

    if (mapViewport.releasePointerCapture) {
      mapViewport.releasePointerCapture(event.pointerId);
    }
  });

  mapViewport.addEventListener('pointercancel', () => {
    camera.dragging = false;
  });

  mapViewport.addEventListener('wheel', (event) => {
    event.preventDefault();

    camera.scale += event.deltaY > 0 ? -0.08 : 0.08;

    clampCamera();
    applyCamera();
  }, { passive: false });

  root.querySelector('#profileBtn').onclick = showProfile;
  root.querySelector('#skillsBtn').onclick = showSkills;
  root.querySelector('#centerMapBtn').onclick = centerMap;

  renderJobs();
  updateStats();
  centerMap();
}
