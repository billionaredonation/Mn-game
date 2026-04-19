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

  const errorChainTextEl = document.getElementById("farmErrorChainText");
  const errorChainFillEl = document.getElementById("farmErrorChainFill");

  let hits = 0;
  let mistakes = 0;
  let money = 0;
  let actions = 0;
  let xp = 0;
  let level = 1;
  let errorChain = 0;

  function rewardByLevel(lvl) {
    if (lvl === 1) return { money: 10, xp: 2 };
    if (lvl === 2) return { money: 15, xp: 4 };
    if (lvl === 3) return { money: 20, xp: 6 };
    if (lvl === 4) return { money: 30, xp: 8 };
    if (lvl === 5) return { money: 40, xp: 10 };
    if (lvl === 6) return { money: 60, xp: 15 };
    if (lvl === 7) return { money: 90, xp: 20 };
    if (lvl === 8) return { money: 130, xp: 30 };
    if (lvl === 9) return { money: 180, xp: 40 };
    return { money: 250, xp: 50 };
  }

  function updateLevelByXp() {
    if (xp >= 10000) level = 10;
    else if (xp >= 7500) level = 9;
    else if (xp >= 6500) level = 8;
    else if (xp >= 5000) level = 7;
    else if (xp >= 2500) level = 6;
    else if (xp >= 2000) level = 5;
    else if (xp >= 1000) level = 4;
    else if (xp >= 500) level = 3;
    else if (xp >= 100) level = 2;
    else level = 1;
  }

  function clampMoney(value) {
    return Math.max(0, value);
  }

  function updateUI() {
    const reward = rewardByLevel(level);

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);
    if (moneyEl) moneyEl.textContent = `${money} ₴`;
    if (xpEl) xpEl.textContent = `${xp} / 10000 XP`;
    if (levelEl) levelEl.textContent = `Ур. ${level}`;
    if (autoEl) autoEl.textContent = `${actions % 3} / 3`;

    const rewardMoneyEl = document.getElementById("farmRewardPerAction");
    const rewardXpEl = document.getElementById("farmXpPerAction");

    if (rewardMoneyEl) rewardMoneyEl.textContent = `+${reward.money} ₴`;
    if (rewardXpEl) rewardXpEl.textContent = `+${reward.xp} XP`;

    if (progressFill) {
      progressFill.style.width = `${Math.min((xp / 10000) * 100, 100)}%`;
    }

    if (errorChainTextEl) {
      errorChainTextEl.textContent = `${errorChain} / 3`;
    }

    if (errorChainFillEl) {
      errorChainFillEl.style.width = `${(errorChain / 3) * 100}%`;
    }
  }

  function saveProgress() {
    if (money <= 0 && xp <= 0) {
      return;
    }

    window.MN_STATE.balance += money;
    window.MN_STATE.xp += xp;
    saveState();

    money = 0;
    xp = 0;

    updateUI();
  }

  function applyMistakePenalty() {
    const reward = rewardByLevel(level);

    mistakes += 1;
    errorChain += 1;

    if (errorChain === 1) {
      const penalty = Math.round(reward.money * 0.2);
      money = clampMoney(money - penalty);
    } else if (errorChain === 2) {
      const penalty = Math.round(reward.money * 0.4);
      money = clampMoney(money - penalty);
    } else if (errorChain >= 3) {
      money = 0;
      errorChain = 0;
    }
  }

  function applyHarvestReward() {
    const reward = rewardByLevel(level);

    hits += 1;
    money += reward.money;
    xp += reward.xp;
    actions += 1;

    updateLevelByXp();

    if (actions % 3 === 0) {
      saveProgress();
    }
  }

  function spawn() {
    if (!board) return;

    board.innerHTML = "";

    for (let i = 0; i < 9; i += 1) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "farm-cell";

      const bad = Math.random() < 0.25;
      item.textContent = bad ? "🐛" : "🌾";

      item.onclick = () => {
        if (bad) {
          applyMistakePenalty();
        } else {
          applyHarvestReward();
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
