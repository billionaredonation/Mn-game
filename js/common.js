window.MN_STATE = {
  nickname: localStorage.getItem("mn_nickname") || "",
  cityId: localStorage.getItem("mn_city_id") || "",
  cityName: localStorage.getItem("mn_city_name") || "",
  gender: localStorage.getItem("mn_gender") || "",
  balance: Number(localStorage.getItem("mn_balance") || 0),
  level: Number(localStorage.getItem("mn_level") || 1),
  xp: Number(localStorage.getItem("mn_xp") || 0)
};

window.MN_APP = document.getElementById("app");

window.getCityById = function (cityId) {
  return window.MN_CITIES.find((city) => city.id === cityId) || null;
};

window.saveState = function () {
  localStorage.setItem("mn_nickname", window.MN_STATE.nickname);
  localStorage.setItem("mn_city_id", window.MN_STATE.cityId);
  localStorage.setItem("mn_city_name", window.MN_STATE.cityName);
  localStorage.setItem("mn_gender", window.MN_STATE.gender);
  localStorage.setItem("mn_balance", String(window.MN_STATE.balance));
  localStorage.setItem("mn_level", String(window.MN_STATE.level));
  localStorage.setItem("mn_xp", String(window.MN_STATE.xp));
};

window.clearState = function () {
  localStorage.removeItem("mn_nickname");
  localStorage.removeItem("mn_city_id");
  localStorage.removeItem("mn_city_name");
  localStorage.removeItem("mn_gender");
  localStorage.removeItem("mn_balance");
  localStorage.removeItem("mn_level");
  localStorage.removeItem("mn_xp");

  window.MN_STATE.nickname = "";
  window.MN_STATE.cityId = "";
  window.MN_STATE.cityName = "";
  window.MN_STATE.gender = "";
  window.MN_STATE.balance = 0;
  window.MN_STATE.level = 1;
  window.MN_STATE.xp = 0;
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
