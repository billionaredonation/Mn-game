const startScreen = document.getElementById("start-screen");
const nicknameScreen = document.getElementById("nickname-screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const nicknameInput = document.getElementById("nicknameInput");
const hintText = document.getElementById("hintText");

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
    hintText.textContent = "Ник должен быть не короче 3 символов";
    hintText.classList.add("error");
    return;
  }

  hintText.textContent = "Ник сохранён";
  hintText.classList.remove("error");

  localStorage.setItem("mn_nickname", nickname);
});

nicknameInput.addEventListener("input", () => {
  hintText.textContent = "От 3 до 16 символов";
  hintText.classList.remove("error");
});
