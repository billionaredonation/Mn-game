function renderCityButtons() {
  const cityList = document.getElementById("cityList");
  if (!cityList) return;

  cityList.innerHTML = "";

  window.MN_CITIES.forEach((city) => {
    const button = document.createElement("button");
    button.className = "option-btn city-option";
    button.dataset.cityId = city.id;
    button.dataset.cityName = city.name;
    button.innerHTML = `
      ${city.name}
      <span class="city-bonus">${city.bonus}</span>
    `;

    if (window.MN_STATE.cityId === city.id) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      document.querySelectorAll(".city-option").forEach((btn) => {
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
  const nextBtn = document.getElementById("welcome1NextBtn");
  nextBtn.addEventListener("click", () => {
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

    hint.textContent = "Ник сохранён";
    hint.classList.remove("error");
    hint.classList.add("success");

    setTimeout(() => {
      loadScreen("welcome/welcome-3-city.html", initWelcome3);
    }, 250);
  });
}

function initWelcome3() {
  renderCityButtons();

  const nextBtn = document.getElementById("welcome3NextBtn");
  const hint = document.getElementById("cityHint");

  if (window.MN_STATE.cityName) {
    hint.textContent = `Выбран город: ${window.MN_STATE.cityName}`;
    hint.classList.add("success");
  }

  nextBtn.addEventListener("click", () => {
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
  const nextBtn = document.getElementById("welcome4NextBtn");
  const hint = document.getElementById("genderHint");

  genderButtons.forEach((button) => {
    if (button.dataset.gender === window.MN_STATE.gender) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      genderButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      window.MN_STATE.gender = button.dataset.gender;
      saveState();

      hint.textContent =
        window.MN_STATE.gender === "male"
          ? "Выбран мужской персонаж"
          : "Выбран женский персонаж";

      hint.classList.remove("error");
      hint.classList.add("success");
    });
  });

  nextBtn.addEventListener("click", () => {
    if (!window.MN_STATE.gender) {
      hint.textContent = "Сначала выберите пол персонажа";
      hint.classList.remove("success");
      hint.classList.add("error");
      return;
    }

    const city = getCityById(window.MN_STATE.cityId);

    if (city && !localStorage.getItem("mn_balance")) {
      window.MN_STATE.balance = city.startBalance;
    }

    if (!localStorage.getItem("mn_level")) {
      window.MN_STATE.level = 1;
    }

    if (!localStorage.getItem("mn_xp")) {
      window.MN_STATE.xp = 0;
    }

    saveState();
    loadScreen("welcome/welcome-5-main.html", initWelcome5);
  });
}

function initWelcome5() {
  const nicknameEl = document.getElementById("summaryNickname");
  const cityEl = document.getElementById("summaryCity");
  const genderEl = document.getElementById("summaryGender");
  const bonusEl = document.getElementById("summaryBonus");
  const moneyEl = document.getElementById("summaryBalance");

  const enterBtn = document.getElementById("enterMainBtn");
  const restartBtn = document.getElementById("restartWelcomeBtn");

  const city = getCityById(window.MN_STATE.cityId);

  nicknameEl.textContent = window.MN_STATE.nickname || "—";
  cityEl.textContent = window.MN_STATE.cityName || "—";
  genderEl.textContent =
    window.MN_STATE.gender === "female" ? "Женский" : "Мужской";
  bonusEl.textContent = city ? city.shortBonus : "—";
  moneyEl.textContent = `${formatMoney(window.MN_STATE.balance)} ₴`;

  enterBtn.addEventListener("click", () => {
    loadScreen("GL_Displays/main-home.html", initMainHome);
  });

  restartBtn.addEventListener("click", () => {
    clearState();
    loadScreen("welcome/welcome-1-start.html", initWelcome1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadScreen("welcome/welcome-1-start.html", initWelcome1);
});
