function formatGender(value) {
  if (value === "male") return "Мужской";
  if (value === "female") return "Женский";
  return value || "Персонаж";
}

function initMainHome() {
  const playerNameEl = document.getElementById("playerName");
  const playerMetaEl = document.getElementById("playerMeta");
  const playerBadgeEl = document.getElementById("playerBadge");
  const playerCityChipEl = document.getElementById("playerCityChip");
  const cityBonusEl = document.getElementById("cityBonus");
  const balanceEl = document.getElementById("balanceValue");
  const levelEl = document.getElementById("levelValue");
  const xpEl = document.getElementById("xpValue");
  const startBonusEl = document.getElementById("startBonusValue");
  const iconCards = document.querySelectorAll(".icon-card");

  const city = getCityById(window.MN_STATE.cityId);

  if (playerNameEl) playerNameEl.textContent = window.MN_STATE.nickname || "Игрок";
  if (playerMetaEl) {
    playerMetaEl.textContent = `${formatGender(window.MN_STATE.gender)} • ID ${window.MN_STATE.playerId || "—"}`;
  }
  if (playerBadgeEl) playerBadgeEl.textContent = getPlayerInitials(window.MN_STATE.nickname);
  if (playerCityChipEl) playerCityChipEl.textContent = window.MN_STATE.cityName || "Без города";
  if (cityBonusEl) cityBonusEl.textContent = city ? city.bonus : "Бонус не выбран";
  if (balanceEl) balanceEl.textContent = `${formatMoney(window.MN_STATE.balance)} ₴`;
  if (levelEl) levelEl.textContent = String(window.MN_STATE.level);
  if (xpEl) xpEl.textContent = `${window.MN_STATE.xp} XP`;
  if (startBonusEl) startBonusEl.textContent = city ? (city.short_bonus || city.bonus) : "—";

  iconCards.forEach((card) => {
    card.addEventListener("click", () => {
      const section = card.dataset.section;

      if (section === "Профиль") {
        loadScreen("GL_Displays/profile.html", initProfileScreen);
        return;
      }

      if (section === "Навыки") {
        loadScreen("GL_Displays/skills.html", initSkillsScreen);
        return;
      }

      alert(`Раздел "${section}" подключим следующим шагом.`);
    });
  });
}

function initProfileScreen() {
  const city = getCityById(window.MN_STATE.cityId);

  const avatarEl = document.getElementById("profileAvatar");
  const nicknameEl = document.getElementById("profileNickname");
  const genderEl = document.getElementById("profileGender");

  const cityTagEl = document.getElementById("profileCity");
  const playerIdEl = document.getElementById("profilePlayerId");

  const nicknameRowEl = document.getElementById("profileNicknameRow");
  const genderRowEl = document.getElementById("profileGenderRow");
  const cityRowEl = document.getElementById("profileCityRow");
  const cityBonusRowEl = document.getElementById("profileCityBonusRow");

  const balanceEl = document.getElementById("profileBalance");
  const levelEl = document.getElementById("profileLevel");
  const xpEl = document.getElementById("profileXp");
  const reputationEl = document.getElementById("profileReputation");
  const energyEl = document.getElementById("profileEnergy");
  const uuidEl = document.getElementById("profileUuid");

  const backBtn = document.getElementById("profileBackBtn");

  if (avatarEl) avatarEl.textContent = getPlayerInitials(window.MN_STATE.nickname);
  if (nicknameEl) nicknameEl.textContent = window.MN_STATE.nickname || "Игрок";
  if (genderEl) genderEl.textContent = formatGender(window.MN_STATE.gender);

  if (cityTagEl) cityTagEl.textContent = window.MN_STATE.cityName || "Без города";
  if (playerIdEl) playerIdEl.textContent = `ID ${window.MN_STATE.playerId || "—"}`;

  if (nicknameRowEl) nicknameRowEl.textContent = window.MN_STATE.nickname || "—";
  if (genderRowEl) genderRowEl.textContent = formatGender(window.MN_STATE.gender);
  if (cityRowEl) cityRowEl.textContent = window.MN_STATE.cityName || "—";
  if (cityBonusRowEl) cityBonusRowEl.textContent = city ? city.bonus : "—";

  if (balanceEl) balanceEl.textContent = `${formatMoney(window.MN_STATE.balance)} ₴`;
  if (levelEl) levelEl.textContent = String(window.MN_STATE.level);
  if (xpEl) xpEl.textContent = `${window.MN_STATE.xp} XP`;
  if (reputationEl) reputationEl.textContent = String(window.MN_STATE.reputation || 0);
  if (energyEl) energyEl.textContent = String(window.MN_STATE.energy || 100);
  if (uuidEl) uuidEl.textContent = window.MN_STATE.playerUuid || "—";

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      loadScreen("GL_Displays/main-home.html", initMainHome);
    });
  }
}

function initSkillsScreen() {
  const backBtn = document.getElementById("skillsBackBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      loadScreen("GL_Displays/main-home.html", initMainHome);
    });
  }
    }
