async function initFarmScreen() {
  const board = document.getElementById("farmBoard");
  const backBtn = document.getElementById("farmBackBtn");

  const hitsEl = document.getElementById("farmHitsValue");
  const mistakesEl = document.getElementById("farmMistakesValue");
  const grossMoneyEl = document.getElementById("farmGrossMoneyValue");
  const penaltyEl = document.getElementById("farmPenaltyValue");
  const netMoneyEl = document.getElementById("farmNetMoneyValue");
  const xpEl = document.getElementById("farmXpValue");
  const levelEl = document.getElementById("farmLevelChip");
  const autoEl = document.getElementById("farmAutosaveInfo");
  const progressFill = document.getElementById("farmProgressFill");

  const errorChainTextEl = document.getElementById("farmErrorChainText");
  const errorChainFillEl = document.getElementById("farmErrorChainFill");
  const autosaveFillEl = document.getElementById("farmAutosaveVisualFill");

  let hits = 0;
  let mistakes = 0;

  let grossMoney = 0;
  let penaltyMoney = 0;

  let unsavedNetMoney = 0;
  let unsavedFarmerXp = 0;
  let pendingReputation = 0;

  let successChain = 0;
  let errorChain = 0;
  let chainNetMoney = 0;

  let totalFarmerXp = 0;
  let farmerLevel = 1;

  function rewardByLevel(lvl) {
    if (lvl === 1) return { money: 10, xp: 1.0 };
    if (lvl === 2) return { money: 15, xp: 1.5 };
    if (lvl === 3) return { money: 20, xp: 2.0 };
    if (lvl === 4) return { money: 30, xp: 2.5 };
    if (lvl === 5) return { money: 40, xp: 3.0 };
    if (lvl === 6) return { money: 60, xp: 3.5 };
    if (lvl === 7) return { money: 90, xp: 4.0 };
    if (lvl === 8) return { money: 130, xp: 4.5 };
    if (lvl === 9) return { money: 180, xp: 5.0 };
    return { money: 250, xp: 6.0 };
  }

  function getFarmerLevelByXp(xp, storedLevel = 1) {
    let derived = 1;

    if (xp >= 10000) derived = 10;
    else if (xp >= 8500) derived = 9;
    else if (xp >= 7000) derived = 8;
    else if (xp >= 5000) derived = 7;
    else if (xp >= 3500) derived = 6;
    else if (xp >= 2500) derived = 5;
    else if (xp >= 2000) derived = 4;
    else if (xp >= 1000) derived = 3;
    else if (xp >= 500) derived = 2;

    return Math.max(Number(storedLevel || 1), derived);
  }

  function clampMoney(value) {
    return Math.max(0, Math.round(value));
  }

  function formatXpValue(value) {
    const num = Number(value || 0);
    if (Number.isInteger(num)) return String(num);
    return num.toFixed(1).replace(/\.0$/, "");
  }

  function getCurrentFarmerXp() {
    return totalFarmerXp + unsavedFarmerXp;
  }

  function getCurrentFarmerLevel() {
    return getFarmerLevelByXp(getCurrentFarmerXp(), farmerLevel);
  }

  function getNetMoney() {
    return clampMoney(grossMoney - penaltyMoney);
  }

  function showMoneyToast(amount, type = "plus") {
    if (typeof window.showToast !== "function") return;

    const abs = Math.abs(Math.round(amount));
    if (abs <= 0) return;

    if (type === "minus") {
      window.showToast(`−${abs} ₴`, "error");
    } else {
      window.showToast(`+${abs} ₴`, "success");
    }
  }

  async function loadFarmerProgress() {
    const localXp = Number(localStorage.getItem("mn_farmer_xp") || 0);
    const localLevel = Number(localStorage.getItem("mn_farmer_level") || 1);

    totalFarmerXp = localXp;
    farmerLevel = getFarmerLevelByXp(totalFarmerXp, localLevel);

    try {
      if (window.loadPlayerSkills && window.MN_STATE.playerUuid) {
        const skills = await window.loadPlayerSkills(window.MN_STATE.playerUuid);
        const farmerSkill = skills.find((skill) => skill.skill_code === "farmer");

        if (farmerSkill) {
          totalFarmerXp = Math.max(totalFarmerXp, Number(farmerSkill.xp || 0));
          farmerLevel = getFarmerLevelByXp(
            totalFarmerXp,
            Number(farmerSkill.level || farmerLevel)
          );
        }
      }
    } catch (error) {
      console.warn("Не удалось загрузить farmer из БД:", error);
    }

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));
  }

  function updateUI() {
    const currentLevel = getCurrentFarmerLevel();
    const currentReward = rewardByLevel(currentLevel);
    const currentFarmerXp = getCurrentFarmerXp();
    
    if (autoEl) autoEl.textContent = `${successChain} / 3`;

    if (autosaveFillEl) {
     autosaveFillEl.style.width = `${(successChain / 3) * 100}%`;
  }

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);

    if (grossMoneyEl) grossMoneyEl.textContent = `${formatMoney(grossMoney)} ₴`;
    if (penaltyEl) penaltyEl.textContent = `${formatMoney(penaltyMoney)} ₴`;
    if (netMoneyEl) netMoneyEl.textContent = `${formatMoney(getNetMoney())} ₴`;

    if (xpEl) xpEl.textContent = `${formatXpValue(currentFarmerXp)} / 10000 XP`;
    if (levelEl) levelEl.textContent = `Ур. ${currentLevel}`;
    if (autoEl) autoEl.textContent = `${successChain} / 3`;

    const rewardMoneyEl = document.getElementById("farmRewardPerAction");
    const rewardXpEl = document.getElementById("farmXpPerAction");

    if (rewardMoneyEl) rewardMoneyEl.textContent = `+${formatMoney(currentReward.money)} ₴`;
    if (rewardXpEl) rewardXpEl.textContent = `+${formatXpValue(currentReward.xp)} XP`;

    if (progressFill) {
      progressFill.style.width = `${Math.min((currentFarmerXp / 10000) * 100, 100)}%`;
    }

    if (errorChainTextEl) errorChainTextEl.textContent = `${errorChain} / 3`;
    if (errorChainFillEl) errorChainFillEl.style.width = `${(errorChain / 3) * 100}%`;
  }

  async function syncToDatabase(newBalance, newReputation, newFarmerXp, newFarmerLevel) {
    if (!window.sb || !window.MN_STATE.playerUuid) return;

    try {
      const playerUpdate = await window.sb
        .from("players")
        .update({
          balance: newBalance,
          reputation: newReputation
        })
        .eq("id", window.MN_STATE.playerUuid);

      if (playerUpdate.error) throw playerUpdate.error;

      const skillUpsert = await window.sb
        .from("player_skills")
        .upsert(
          {
            player_uuid: window.MN_STATE.playerUuid,
            skill_code: "farmer",
            xp: newFarmerXp,
            level: newFarmerLevel,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "player_uuid,skill_code"
          }
        );

      if (skillUpsert.error) throw skillUpsert.error;
    } catch (error) {
      console.warn("Не удалось синхронизировать ферму с БД:", error);
    }
  }

  async function saveProgress() {
    if (unsavedNetMoney <= 0 && unsavedFarmerXp <= 0 && pendingReputation <= 0) {
      return;
    }

    const savedMoney = unsavedNetMoney;
    const savedXp = unsavedFarmerXp;
    const savedRep = pendingReputation;

    window.MN_STATE.balance = Number(window.MN_STATE.balance || 0) + savedMoney;
    window.MN_STATE.reputation = Number(window.MN_STATE.reputation || 0) + savedRep;
    saveState();

    totalFarmerXp += savedXp;
    farmerLevel = getFarmerLevelByXp(totalFarmerXp, farmerLevel);

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));

    unsavedNetMoney = 0;
    unsavedFarmerXp = 0;
    pendingReputation = 0;
    successChain = 0;
    chainNetMoney = 0;

    updateUI();

    await syncToDatabase(
      Number(window.MN_STATE.balance || 0),
      Number(window.MN_STATE.reputation || 0),
      totalFarmerXp,
      farmerLevel
    );

    if (savedMoney > 0) {
      showMoneyToast(savedMoney, "plus");
    }
  }

  function applyMistakePenalty() {
    const currentLevel = getCurrentFarmerLevel();
    const reward = rewardByLevel(currentLevel);

    mistakes += 1;
    errorChain += 1;

    if (errorChain === 1) {
      const penalty = Math.round(reward.money * 0.2);
      penaltyMoney += penalty;
      unsavedNetMoney = clampMoney(unsavedNetMoney - penalty);
      chainNetMoney = clampMoney(chainNetMoney - penalty);
      showMoneyToast(-penalty, "minus");
    } else if (errorChain === 2) {
      const penalty = Math.round(reward.money * 0.4);
      penaltyMoney += penalty;
      unsavedNetMoney = clampMoney(unsavedNetMoney - penalty);
      chainNetMoney = clampMoney(chainNetMoney - penalty);
      showMoneyToast(-penalty, "minus");
    } else if (errorChain >= 3) {
      const burned = chainNetMoney;

      penaltyMoney += burned;
      unsavedNetMoney = clampMoney(unsavedNetMoney - burned);

      chainNetMoney = 0;
      errorChain = 0;
      successChain = 0;

      if (burned > 0) {
        showMoneyToast(-burned, "minus");
      }
    }
  }

  async function applyHarvestReward() {
    const oldLevel = getCurrentFarmerLevel();
    const currentReward = rewardByLevel(oldLevel);

    hits += 1;
    grossMoney += currentReward.money;

    unsavedNetMoney += currentReward.money;
    chainNetMoney += currentReward.money;
    unsavedFarmerXp += currentReward.xp;

    const newLevel = getCurrentFarmerLevel();

    if (newLevel > oldLevel && typeof window.showToast === "function") {
      window.showToast(
        `🎉 Навык Фермер повышен до ${newLevel} уровня!`,
        "success"
      );
    }

    successChain += 1;

    if (successChain >= 3) {
      pendingReputation += 1;
      await saveProgress();
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

      item.onclick = async () => {
        if (bad) {
          applyMistakePenalty();
        } else {
          await applyHarvestReward();
        }

        updateUI();
        spawn();
      };

      board.appendChild(item);
    }
  }

  if (backBtn) {
    backBtn.onclick = async () => {
      await saveProgress();
      loadScreen("GL_Displays/farm-select.html", initFarmSelectScreen);
    };
  }

  await loadFarmerProgress();
  updateUI();
  spawn();
}



window.initFarmRareGame = async function () {
  const board = document.getElementById("farmBoard");
  const backBtn = document.getElementById("farmBackBtn");

  const hitsEl = document.getElementById("farmHitsValue");
  const mistakesEl = document.getElementById("farmMistakesValue");
  const grossMoneyEl = document.getElementById("farmGrossMoneyValue");
  const penaltyEl = document.getElementById("farmPenaltyValue");
  const netMoneyEl = document.getElementById("farmNetMoneyValue");
  const xpEl = document.getElementById("farmXpValue");
  const levelEl = document.getElementById("farmLevelChip");
  const autoEl = document.getElementById("farmAutosaveInfo");
  const progressFill = document.getElementById("farmProgressFill");

  const errorChainTextEl = document.getElementById("farmErrorChainText");
  const errorChainFillEl = document.getElementById("farmErrorChainFill");

  let hits = 0;
  let mistakes = 0;

  let grossMoney = 0;
  let penaltyMoney = 0;

  let unsavedNetMoney = 0;
  let unsavedFarmerXp = 0;
  let pendingReputation = 0;

  let successChain = 0;
  let errorChain = 0;
  let chainNetMoney = 0;

  let totalFarmerXp = 0;
  let farmerLevel = 1;

  function rewardByLevel(lvl) {
    if (lvl === 1) return { money: 10, xp: 1.0 };
    if (lvl === 2) return { money: 15, xp: 1.5 };
    if (lvl === 3) return { money: 20, xp: 2.0 };
    if (lvl === 4) return { money: 30, xp: 2.5 };
    if (lvl === 5) return { money: 40, xp: 3.0 };
    if (lvl === 6) return { money: 60, xp: 3.5 };
    if (lvl === 7) return { money: 90, xp: 4.0 };
    if (lvl === 8) return { money: 130, xp: 4.5 };
    if (lvl === 9) return { money: 180, xp: 5.0 };
    return { money: 250, xp: 6.0 };
  }

  function getFarmerLevelByXp(xp, storedLevel = 1) {
    let derived = 1;

    if (xp >= 10000) derived = 10;
    else if (xp >= 8500) derived = 9;
    else if (xp >= 7000) derived = 8;
    else if (xp >= 5000) derived = 7;
    else if (xp >= 3500) derived = 6;
    else if (xp >= 2500) derived = 5;
    else if (xp >= 2000) derived = 4;
    else if (xp >= 1000) derived = 3;
    else if (xp >= 500) derived = 2;

    return Math.max(Number(storedLevel || 1), derived);
  }

  function clampMoney(value) {
    return Math.max(0, Math.round(value));
  }

  function formatXpValue(value) {
    const num = Number(value || 0);
    if (Number.isInteger(num)) return String(num);
    return num.toFixed(1).replace(/\.0$/, "");
  }

  function getCurrentFarmerXp() {
    return totalFarmerXp + unsavedFarmerXp;
  }

  function getCurrentFarmerLevel() {
    return getFarmerLevelByXp(getCurrentFarmerXp(), farmerLevel);
  }

  function getNetMoney() {
    return clampMoney(grossMoney - penaltyMoney);
  }

  function showMoneyToast(amount, type = "plus") {
    if (typeof window.showToast !== "function") return;

    const abs = Math.abs(Math.round(amount));
    if (abs <= 0) return;

    if (type === "minus") {
      window.showToast(`−${abs} ₴`, "error");
    } else {
      window.showToast(`+${abs} ₴`, "success");
    }
  }

  async function loadFarmerProgress() {
    const localXp = Number(localStorage.getItem("mn_farmer_xp") || 0);
    const localLevel = Number(localStorage.getItem("mn_farmer_level") || 1);

    totalFarmerXp = localXp;
    farmerLevel = getFarmerLevelByXp(totalFarmerXp, localLevel);

    try {
      if (window.loadPlayerSkills && window.MN_STATE.playerUuid) {
        const skills = await window.loadPlayerSkills(window.MN_STATE.playerUuid);
        const farmerSkill = skills.find((skill) => skill.skill_code === "farmer");

        if (farmerSkill) {
          totalFarmerXp = Math.max(totalFarmerXp, Number(farmerSkill.xp || 0));
          farmerLevel = getFarmerLevelByXp(
            totalFarmerXp,
            Number(farmerSkill.level || farmerLevel)
          );
        }
      }
    } catch (error) {
      console.warn("Не удалось загрузить farmer из БД:", error);
    }

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));
  }

  function updateUI() {
    const currentLevel = getCurrentFarmerLevel();
    const currentReward = rewardByLevel(currentLevel);
    const currentFarmerXp = getCurrentFarmerXp();

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);

    if (grossMoneyEl) grossMoneyEl.textContent = `${formatMoney(grossMoney)} ₴`;
    if (penaltyEl) penaltyEl.textContent = `${formatMoney(penaltyMoney)} ₴`;
    if (netMoneyEl) netMoneyEl.textContent = `${formatMoney(getNetMoney())} ₴`;

    if (xpEl) xpEl.textContent = `${formatXpValue(currentFarmerXp)} / 10000 XP`;
    if (levelEl) levelEl.textContent = `Ур. ${currentLevel}`;
    if (autoEl) autoEl.textContent = `${successChain} / 3`;

    const rewardMoneyEl = document.getElementById("farmRewardPerAction");
    const rewardXpEl = document.getElementById("farmXpPerAction");

    if (rewardMoneyEl) rewardMoneyEl.textContent = `+${formatMoney(currentReward.money)} ₴`;
    if (rewardXpEl) rewardXpEl.textContent = `+${formatXpValue(currentReward.xp)} XP`;

    if (progressFill) {
      progressFill.style.width = `${Math.min((currentFarmerXp / 10000) * 100, 100)}%`;
    }

    if (errorChainTextEl) errorChainTextEl.textContent = `${errorChain} / 3`;
    if (errorChainFillEl) errorChainFillEl.style.width = `${(errorChain / 3) * 100}%`;
  }

  async function syncToDatabase(newBalance, newReputation, newFarmerXp, newFarmerLevel) {
    if (!window.sb || !window.MN_STATE.playerUuid) return;

    try {
      const playerUpdate = await window.sb
        .from("players")
        .update({
          balance: newBalance,
          reputation: newReputation
        })
        .eq("id", window.MN_STATE.playerUuid);

      if (playerUpdate.error) throw playerUpdate.error;

      const skillUpsert = await window.sb
        .from("player_skills")
        .upsert(
          {
            player_uuid: window.MN_STATE.playerUuid,
            skill_code: "farmer",
            xp: newFarmerXp,
            level: newFarmerLevel,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "player_uuid,skill_code"
          }
        );

      if (skillUpsert.error) throw skillUpsert.error;
    } catch (error) {
      console.warn("Не удалось синхронизировать редкую ферму с БД:", error);
    }
  }

  async function saveProgress() {
    if (unsavedNetMoney <= 0 && unsavedFarmerXp <= 0 && pendingReputation <= 0) {
      return;
    }

    const savedMoney = unsavedNetMoney;
    const savedXp = unsavedFarmerXp;
    const savedRep = pendingReputation;

    window.MN_STATE.balance = Number(window.MN_STATE.balance || 0) + savedMoney;
    window.MN_STATE.reputation = Number(window.MN_STATE.reputation || 0) + savedRep;
    saveState();

    totalFarmerXp += savedXp;
    farmerLevel = getFarmerLevelByXp(totalFarmerXp, farmerLevel);

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));

    unsavedNetMoney = 0;
    unsavedFarmerXp = 0;
    pendingReputation = 0;
    successChain = 0;
    chainNetMoney = 0;

    updateUI();

    await syncToDatabase(
      Number(window.MN_STATE.balance || 0),
      Number(window.MN_STATE.reputation || 0),
      totalFarmerXp,
      farmerLevel
    );

    if (savedMoney > 0) {
      showMoneyToast(savedMoney, "plus");
    }
  }

  function applyMistakePenalty() {
    const currentLevel = getCurrentFarmerLevel();
    const reward = rewardByLevel(currentLevel);

    mistakes += 1;
    errorChain += 1;

    if (errorChain === 1) {
      const penalty = Math.round(reward.money * 0.2);
      penaltyMoney += penalty;
      unsavedNetMoney = clampMoney(unsavedNetMoney - penalty);
      chainNetMoney = clampMoney(chainNetMoney - penalty);
      showMoneyToast(-penalty, "minus");
    } else if (errorChain === 2) {
      const penalty = Math.round(reward.money * 0.4);
      penaltyMoney += penalty;
      unsavedNetMoney = clampMoney(unsavedNetMoney - penalty);
      chainNetMoney = clampMoney(chainNetMoney - penalty);
      showMoneyToast(-penalty, "minus");
    } else if (errorChain >= 3) {
      const burned = chainNetMoney;
      penaltyMoney += burned;
      unsavedNetMoney = clampMoney(unsavedNetMoney - burned);

      chainNetMoney = 0;
      errorChain = 0;
      successChain = 0;

      if (burned > 0) {
        showMoneyToast(-burned, "minus");
      }
    }
  }

  async function applyHarvestReward(kind) {
    const oldLevel = getCurrentFarmerLevel();
    const currentReward = rewardByLevel(oldLevel);

    let moneyReward = currentReward.money;
    let xpReward = currentReward.xp;

    if (kind === "berry") {
      moneyReward = currentReward.money * 2;
    }

    if (kind === "banana") {
      xpReward = currentReward.xp * 2;
    }

    hits += 1;
    grossMoney += moneyReward;
    unsavedNetMoney += moneyReward;
    chainNetMoney += moneyReward;
    unsavedFarmerXp += xpReward;

    const newLevel = getCurrentFarmerLevel();

    if (newLevel > oldLevel && typeof window.showToast === "function") {
      window.showToast(
        `🎉 Навык Фермер повышен до ${newLevel} уровня!`,
        "success"
      );
    }

    successChain += 1;

    if (successChain >= 3) {
      pendingReputation += 1;
      await saveProgress();
    }
  }

  function spawn() {
    if (!board) return;

    board.innerHTML = "";

    for (let i = 0; i < 9; i += 1) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "farm-cell";

      const roll = Math.random();

      let kind = "carrot";
      let symbol = "🥕";

      if (roll < 0.5) {
        kind = "bug";
        symbol = "🐛";
      } else if (roll < 0.9) {
        kind = "carrot";
        symbol = "🥕";
      } else if (roll < 0.95) {
        kind = "banana";
        symbol = "🍌";
      } else {
        kind = "berry";
        symbol = "🍇";
      }

      item.textContent = symbol;

      item.onclick = async () => {
        if (kind === "bug") {
          applyMistakePenalty();
        } else {
          await applyHarvestReward(kind);
        }

        updateUI();
        spawn();
      };

      board.appendChild(item);
    }
  }

  if (backBtn) {
    backBtn.onclick = async () => {
      await saveProgress();
      loadScreen("GL_Displays/farm-select.html", initFarmSelectScreen);
    };
  }

  await loadFarmerProgress();
  updateUI();
  spawn();
};
