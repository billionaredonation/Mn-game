function initFarmScreen() {
  const backBtn = document.getElementById("farmBackBtn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      loadScreen("GL_Displays/work.html", initWorkScreen);
    });
  }
}
