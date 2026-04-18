function getPlayerInitials(name) {
  if (!name) return "MN";
  const clean = name.trim();
  if (!clean) return "MN";
  return clean.slice(0, 2).toUpperCase();
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

  const resetBtn = document.getElementById("resetProfileBtn");
  const iconCards = document.querySelectorAll(".icon-card");

  const city = getCityById(window.MN_STATE.cityId);

  playerNameEl.textContent = window.MN_STATE.nickname || "Игрок";
  playerMetaEl.textContent =
    window.MN_STATE.gender === "female"
      ? "Женский персонаж"
      : "Мужской персонаж";

  playerBadgeEl.textContent = getPlayerInitials(window.MN_STATE.nickname);
  playerCityChipEl.textContent = window.MN_STATE.cityName || "Без города";
  cityBonusEl.textContent = city ? city.bonus : "Бонус не выбран";
  balanceEl.textContent = `${formatMoney(window.MN_STATE.balance)} ₴`;
  levelEl.textContent = String(window.MN_STATE.level);
  xpEl.textContent = `${window.MN_STATE.xp} XP`;
  startBonusEl.textContent = city ? city.shortBonus : "—";

  iconCards.forEach((card) => {
    card.addEventListener("click", () => {
      const section = card.dataset.section;
      alert(`Раздел "${section}" подключим следующим шагом.`);
    });
  });

  resetBtn.addEventListener("click", () => {
    clearState();
    loadScreen("welcome/welcome-1-start.html", initWelcome1);
  });
}
