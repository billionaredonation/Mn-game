const startScreen = document.getElementById("start-screen");
const nicknameScreen = document.getElementById("nickname-screen");
const cityScreen = document.getElementById("city-screen");
const doneScreen = document.getElementById("done-screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const cityNextBtn = document.getElementById("cityNextBtn");
const restartBtn = document.getElementById("restartBtn");

const nicknameInput = document.getElementById("nicknameInput");
const hintText = document.getElementById("hintText");
const cityHint = document.getElementById("cityHint");
const summaryText = document.getElementById("summaryText");

const cityButtons = document.querySelectorAll(".city-btn");

let selectedCity = "";

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
    hintText.classList.remove("success");
    hintText.classList.add("error");
    return;
  }

  localStorage.setItem("mn_nickname", nickname);

  hintText.textContent = "Ник сохранён";
  hintText.classList.remove("error");
  hintText.classList.add("success");

  setTimeout(() => {
    showScreen(cityScreen);
  }, 250);
});

nicknameInput.addEventListener("input", () => {
  hintText.textContent = "От 3 до 16 символов";
  hintText.classList.remove("error", "success");
});

cityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cityButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    selectedCity = button.dataset.city;
    cityHint.textContent = `Выбран город: ${selectedCity}`;
    cityHint.classList.remove("error");
    cityHint.classList.add("success");
  });
});

cityNextBtn.addEventListener("click", () => {
  const nickname = localStorage.getItem("mn_nickname") || "";

  if (!selectedCity) {
    cityHint.textContent = "Сначала выберите город";
    cityHint.classList.remove("success");
    cityHint.classList.add("error");
    return;
  }

  localStorage.setItem("mn_city", selectedCity);

  summaryText.textContent = `Игрок ${nickname} начинает путь в городе ${selectedCity}.`;
  showScreen(doneScreen);
});

restartBtn.addEventListener("click", () => {
  localStorage.removeItem("mn_nickname");
  localStorage.removeItem("mn_city");

  nicknameInput.value = "";
  selectedCity = "";

  cityButtons.forEach((btn) => btn.classList.remove("selected"));
  hintText.textContent = "От 3 до 16 символов";
  hintText.classList.remove("error", "success");
  cityHint.textContent = "Выберите один город";
  cityHint.classList.remove("error", "success");

  showScreen(startScreen);
});
