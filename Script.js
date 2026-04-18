const startScreen = document.getElementById("start-screen");
const nicknameScreen = document.getElementById("nickname-screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const nicknameInput = document.getElementById("nicknameInput");

function showScreen(screenToShow) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  screenToShow.classList.add("active");
}

startBtn.addEventListener("click", () => {
  showScreen(nicknameScreen);
  setTimeout(() => nicknameInput.focus(), 150);
});

nextBtn.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();

  if (nickname.length < 3) {
    alert("Ник должен быть не короче 3 символов.");
    return;
  }

  localStorage.setItem("mn_nickname", nickname);
  alert(`Ник сохранён: ${nickname}`);
});
