window.MN_STATE = {
  playerUuid: localStorage.getItem("mn_player_uuid") || "",
  playerId: localStorage.getItem("mn_player_id") || "",
  nickname: localStorage.getItem("mn_nickname") || "",
  gender: localStorage.getItem("mn_gender") || "",
  cityId: localStorage.getItem("mn_city_id") || "",
  cityName: localStorage.getItem("mn_city_name") || "",
  balance: Number(localStorage.getItem("mn_balance") || 0),
  level: Number(localStorage.getItem("mn_level") || 1),
  xp: Number(localStorage.getItem("mn_xp") || 0),
  energy: Number(localStorage.getItem("mn_energy") || 100),
  reputation: Number(localStorage.getItem("mn_reputation") || 0)
};

window.MN_APP = document.getElementById("app");
window.MN_CITIES_DB = [];

window.saveState = function () {
  localStorage.setItem("mn_player_uuid", window.MN_STATE.playerUuid || "");
  localStorage.setItem("mn_player_id", window.MN_STATE.playerId || "");
  localStorage.setItem("mn_nickname", window.MN_STATE.nickname || "");
  localStorage.setItem("mn_gender", window.MN_STATE.gender || "");
  localStorage.setItem("mn_city_id", window.MN_STATE.cityId || "");
  localStorage.setItem("mn_city_name", window.MN_STATE.cityName || "");
  localStorage.setItem("mn_balance", String(window.MN_STATE.balance || 0));
  localStorage.setItem("mn_level", String(window.MN_STATE.level || 1));
  localStorage.setItem("mn_xp", String(window.MN_STATE.xp || 0));
  localStorage.setItem("mn_energy", String(window.MN_STATE.energy || 100));
  localStorage.setItem("mn_reputation", String(window.MN_STATE.reputation || 0));
};

window.applyPlayerDataToState = function (player, city) {
  window.MN_STATE.playerUuid = player.id || "";
  window.MN_STATE.playerId = player.player_id || "";
  window.MN_STATE.nickname = player.nickname || "";
  window.MN_STATE.gender = player.gender || "";
  window.MN_STATE.cityId = player.city_id || "";
  window.MN_STATE.cityName = city?.name || "";
  window.MN_STATE.balance = Number(player.balance || 0);
  window.MN_STATE.level = Number(player.level || 1);
  window.MN_STATE.xp = Number(player.xp || 0);
  window.MN_STATE.energy = Number(player.energy || 100);
  window.MN_STATE.reputation = Number(player.reputation || 0);

  saveState();
};

window.loadScreen = async function (path, afterLoad) {
  const response = await fetch(path);
  const html = await response.text();
  window.MN_APP.innerHTML = html;

  if (typeof afterLoad === "function") {
    afterLoad();
  }
};

window.formatMoney = function (value) {
  return new Intl.NumberFormat("ru-RU").format(value);
};

window.getCityById = function (cityId) {
  return window.MN_CITIES_DB.find((city) => city.id === cityId) || null;
};

window.getPlayerInitials = function (name) {
  if (!name) return "MN";
  return name.trim().slice(0, 2).toUpperCase();
};
