function initFarmScreen() {
  const board = document.getElementById("farmBoard");
  const backBtn = document.getElementById("farmBackBtn");

  const hitsEl = document.getElementById("farmHitsValue");
  const mistakesEl = document.getElementById("farmMistakesValue");
  const moneyEl = document.getElementById("farmMoneyValue");
  const xpEl = document.getElementById("farmXpValue");
  const levelEl = document.getElementById("farmLevelChip");
  const autoEl = document.getElementById("farmAutosaveInfo");
  const progressFill = document.getElementById("farmProgressFill");

  let hits = 0;
  let mistakes = 0;
  let money = 0;
  let actions = 0;
  let xp = 0;
  let level = 1;

  function rewardByLevel(lvl) {
    if (lvl === 1) return { money: 10, xp: 2 };
    if (lvl === 2) return { money: 25, xp: 4 };
    if (lvl === 3) return { money: 50, xp: 6 };
    return { money: 75, xp: 10 };
  }

  function updateUI() {
    const reward = rewardByLevel(level);

    hitsEl.textContent = hits;
    mistakesEl.textContent = mistakes;
    moneyEl.textContent = money + " ₴";
    xpEl.textContent = xp + " / 10000 XP";
    levelEl.textContent = "Ур. " + level;
    autoEl.textContent = (actions % 3) + " / 3";

    document.getElementById("farmRewardPerAction").textContent =
      "+" + reward.money + " ₴";

    document.getElementById("farmXpPerAction").textContent =
      "+" + reward.xp + " XP";

    progressFill.style.width = (xp / 10000) * 100 + "%";
  }

  function saveProgress() {
    window.MN_STATE.balance += money;
    window.MN_STATE.xp += xp;
    saveState();

    money = 0;
    xp = 0;
    updateUI();
  }

  function spawn() {
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const item = document.createElement("button");
      item.className = "farm-cell";

      const bad = Math.random() < 0.25;
      item.textContent = bad ? "🐛" : "🌾";

      item.onclick = () => {
        const reward = rewardByLevel(level);

        if (bad) {
          mistakes++;
        } else {
          hits++;
          money += reward.money;
          xp += reward.xp;
          actions++;

          if (xp >= 100 && level === 1) level = 2;
          if (xp >= 500 && level === 2) level = 3;
          if (xp >= 1000 && level === 3) level = 4;

          if (actions % 3 === 0) {
            saveProgress();
          }
        }

        updateUI();
        spawn();
      };

      board.appendChild(item);
    }
  }

  if (backBtn) {
    backBtn.onclick = () => {
      saveProgress();
      loadScreen("GL_Displays/work.html", initWorkScreen);
    };
  }

  updateUI();
  spawn();
}
