function shortBonusText(city) {
  if (!city) return "";

  const map = {
    kyiv: "+7% Финансы",
    lviv: "+7% Сервис",
    odesa: "+7% Торговля",
    kharkiv: "+7% Технологии",
    dnipro: "+7% Промка",
    zaporizhzhia: "+7% Заводы",
    vinnytsia: "+7% Агро",
    poltava: "+7% Ресурсы",
    chernihiv: "+7% Логистика",
    sumy: "+7% Производство",
    mykolaiv: "+7% Верфи",
    kherson: "+7% Экспорт",
    cherkasy: "+7% Пищевая",
    zhytomyr: "+7% Стройка",
    rivne: "+7% Ремесло",
    ternopil: "+7% Навыки",
    "ivano-frankivsk": "+7% Туризм",
    lutsk: "+7% Склады",
    uzhhorod: "+7% Экспорт",
    kropyvnytskyi: "+7% Фермерство"
  };

  return map[city.id] || city.short_bonus || city.bonus || "";
}

function renderCityButtons() {
  const cityList = document.getElementById("cityList");
  if (!cityList) return;

  cityList.innerHTML = "";

  window.MN_CITIES_DB.forEach((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-card";
    button.dataset.cityId = city.id;
    button.dataset.cityName = city.name;

    button.innerHTML = `
      <span class="city-card-name">${city.name}</span>
      <span class="city-card-bonus">${shortBonusText(city)}</span>
    `;

    if (window.MN_STATE.cityId === city.id) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      document.querySelectorAll(".city-card").forEach((btn) => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
      window.MN_STATE.cityId = city.id;
      window.MN_STATE.cityName = city.name;
      saveState();

      const hint = document.getElementById("cityHint");
      if (hint) {
        hint.textContent = `Выбран город: ${city.name}`;
        hint.classList.remove("error");
        hint.classList.add("success");
      }
    });

    cityList.appendChild(button);
  });
}

function initWelcome1() {
  document.getElementById("welcome1NextBtn").addEventListener("click", () => {
    loadScreen("welcome/welcome-2-nickname.html", initWelcome2);
  });
}

function initWelcome2() {
  const input = document.getElementById("nicknameInput");
  const hint = document.getElementById("nicknameHint");
  const nextBtn = document.getElementById("welcome2NextBtn");

  if (window.MN_STATE.nickname) {
    input.value = window.MN_STATE.nickname;
  }

  input.addEventListener("input", () => {
    hint.textContent = "От 3 до 16 символов";
    hint.classList.remove("error", "success");
  });

  nextBtn.addEventListener("click", () => {
    const nickname = input.value.trim();

    if (nickname.length < 3) {
      hint.textContent = "Ник должен быть не короче 3 символов";
      hint.classList.remove("success");
      hint.classList.add("error");
      return;
    }

    window.MN_STATE.nickname = nickname;
    saveState();

    loadScreen("welcome/welcome-3-city.html", initWelcome3);
  });
}

async function initWelcome3() {
  const hint = document.getElementById("cityHint");
  hint.textContent = "Загрузка городов...";
  hint.classList.remove("error", "success");

  window.MN_CITIES_DB = await loadCitiesFromDB();
  renderCityButtons();

  hint.textContent = window.MN_STATE.cityName
    ? `Выбран город: ${window.MN_STATE.cityName}`
    : "Выберите один город";

  document.getElementById("welcome3NextBtn").addEventListener("click", () => {
    if (!window.MN_STATE.cityId) {
      hint.textContent = "Сначала выберите город";
      hint.classList.remove("success");
      hint.classList.add("error");
      return;
    }

    loadScreen("welcome/welcome-4-gender.html", initWelcome4);
  });
}

function initWelcome4() {
  const genderButtons = document.querySelectorAll(".gender-option");
  const hint = document.getElementById("genderHint");

  genderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      genderButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      window.MN_STATE.gender = button.dataset.gender;
      saveState();

      hint.textContent = `Выбран пол: ${window.MN_STATE.gender}`;
      hint.classList.remove("error");
      hint.classList.add("success");
    });
  });

  document.getElementById("welcome4NextBtn").addEventListener("click", () => {
    if (!window.MN_STATE.gender) {
      hint.textContent = "Сначала выберите пол";
      hint.classList.remove("success");
      hint.classList.add("error");
      return;
    }

    loadScreen("welcome/welcome-5-main.html", initWelcome5);
  });
}

function initWelcome5() {
  const city = getCityById(window.MN_STATE.cityId);

  document.getElementById("summaryNickname").textContent = window.MN_STATE.nickname || "—";
  document.getElementById("summaryCity").textContent = window.MN_STATE.cityName || "—";
  document.getElementById("summaryGender").textContent = window.MN_STATE.gender || "—";
  document.getElementById("summaryBonus").textContent = city ? shortBonusText(city) : "—";
  document.getElementById("summaryBalance").textContent = city ? `${formatMoney(city.start_balance)} ₴` : "—";

  document.getElementById("enterMainBtn").addEventListener("click", async () => {
    const btn = document.getElementById("enterMainBtn");

    try {
      btn.disabled = true;
      btn.textContent = "Создание профиля...";

      const result = await createPlayerInDB({
        nickname: window.MN_STATE.nickname,
        gender: window.MN_STATE.gender,
        cityId: window.MN_STATE.cityId
      });

      applyPlayerDataToState(result.player, result.city);
      loadScreen("GL_Displays/main-home.html", initMainHome);
    } catch (error) {
      console.error(error);
      alert("Не удалось создать игрока. Возможно, ник уже занят.");
      btn.disabled = false;
      btn.textContent = "В главный экран";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await testSupabaseConnection();

  if (!ok) return;

  if (window.MN_STATE.playerUuid) {
    const player = await getPlayerByUuid(window.MN_STATE.playerUuid);

    if (player) {
      window.MN_CITIES_DB = await loadCitiesFromDB();
      const city = getCityById(player.city_id);
      applyPlayerDataToState(player, city);
      loadScreen("GL_Displays/main-home.html", initMainHome);
      return;
    }
  }

  loadScreen("welcome/welcome-1-start.html", initWelcome1);
});
