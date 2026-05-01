import { register, show } from '../../src/router.js?v=90';
import { state, save } from '../../src/state.js?v=90';
import { ensurePlayer, canWork, applyJobReward } from '../../src/game/player.js?v=90';
import { getCity, normalizeCityId } from '../../src/game/cities/index.js?v=90';

register('home', (root) => {
  root.className = 'page home';

  state.city = normalizeCityId(state.city);

  const city = getCity(state.city);
  const player = ensurePlayer(state);

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
          <img class="city-map-image" src="${city.map}" alt="${city.name}" />
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

      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectJob(job);
      });
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
    if (!selectedJob) {
      return;
    }

    if (!canWork(player, selectedJob)) {
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

    applyJobReward(player, selectedJob);
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
    if (!camera.dragging) {
      return;
    }

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
});
