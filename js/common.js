window.MN_STATE = {
  nickname: localStorage.getItem("mn_nickname") || "",
  cityId: localStorage.getItem("mn_city_id") || "",
  cityName: localStorage.getItem("mn_city_name") || "",
  gender: localStorage.getItem("mn_gender") || ""
};

window.MN_APP = document.getElementById("app");

window.saveState = function () {
  localStorage.setItem("mn_nickname", window.MN_STATE.nickname);
  localStorage.setItem("mn_city_id", window.MN_STATE.cityId);
  localStorage.setItem("mn_city_name", window.MN_STATE.cityName);
  localStorage.setItem("mn_gender", window.MN_STATE.gender);
};

window.clearState = function () {
  localStorage.removeItem("mn_nickname");
  localStorage.removeItem("mn_city_id");
  localStorage.removeItem("mn_city_name");
  localStorage.removeItem("mn_gender");

  window.MN_STATE.nickname = "";
  window.MN_STATE.cityId = "";
  window.MN_STATE.cityName = "";
  window.MN_STATE.gender = "";
};

window.loadScreen = async function (path, afterLoad) {
  const response = await fetch(path);
  const html = await response.text();
  window.MN_APP.innerHTML = html;

  if (typeof afterLoad === "function") {
    afterLoad();
  }
};
