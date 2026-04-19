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

  function getFarmerLevelByXp(xp) {
    if (xp >= 10000) return 10;
    if (xp >= 7500) return 9;
    if (xp >= 6500) return 8;
    if (xp >= 5000) return 7;
    if (xp >= 2500) return 6;
    if (xp >= 2000) return 5;
    if (xp >= 1000) return 4;
    if (xp >= 500) return 3;
    if (xp >= 100) return 2;
    return 1;
  }

  function clampMoney(value) {
    return Math.max(0, Math.round(value));
  }

  function getCurrentFarmerXp() {
    return totalFarmerXp + unsavedFarmerXp;
  }

  function getCurrentFarmerLevel() {
    return getFarmerLevelByXp(getCurrentFarmerXp());
  }

  function getNetMoney() {
    return clampMoney(grossMoney - penaltyMoney);
  }

  function showMoneyToast(amount, type = "plus") {
    const toast = document.createElement("div");
    toast.className = `money-toast ${type}`;
    toast.textContent = amount > 0 ? `+${amount} ₴` : `${amount} ₴`;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 260);
    }, 1100);
  }

  async function loadFarmerProgress() {
    const localXp = Number(localStorage.getItem("mn_farmer_xp") || 0);
    const localLevel = Number(localStorage.getItem("mn_farmer_level") || 1);

    totalFarmerXp = localXp;
    farmerLevel = Math.max(localLevel, getFarmerLevelByXp(totalFarmerXp));

    try {
      if (window.loadPlayerSkills && window.MN_STATE.playerUuid) {
        const skills = await window.loadPlayerSkills(window.MN_STATE.playerUuid);
        const farmerSkill = skills.find((skill) => skill.skill_code === "farmer");

        if (farmerSkill) {
          totalFarmerXp = Math.max(totalFarmerXp, Number(farmerSkill.xp || 0));
          farmerLevel = Math.max(farmerLevel, Number(farmerSkill.level || 1));
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
    const netMoney = getNetMoney();

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);

    if (grossMoneyEl) grossMoneyEl.textContent = `${grossMoney} ₴`;
    if (penaltyEl) penaltyEl.textContent = `${penaltyMoney} ₴`;
    if (netMoneyEl) netMoneyEl.textContent = `${netMoney} ₴`;

    if (xpEl) xpEl.textContent = `${currentFarmerXp} / 10000 XP`;
    if (levelEl) levelEl.textContent = `Ур. ${currentLevel}`;
    if (autoEl) autoEl.textContent = `${successChain} / 3`;

    const rewardMoneyEl = document.getElementById("farmRewardPerAction");
    const rewardXpEl = document.getElementById("farmXpPerAction");

    if (rewardMoneyEl) rewardMoneyEl.textContent = `+${currentReward.money} ₴`;
    if (rewardXpEl) rewardXpEl.textContent = `+${currentReward.xp} XP`;

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

    window.MN_STATE.balance = Number(window.MN_STATE.balance || 0) + unsavedNetMoney;
    window.MN_STATE.reputation = Number(window.MN_STATE.reputation || 0) + pendingReputation;
    saveState();

    totalFarmerXp += unsavedFarmerXp;
    farmerLevel = getFarmerLevelByXp(totalFarmerXp);

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));

    const savedMoney = unsavedNetMoney;
    const savedXp = unsavedFarmerXp;
    const savedRep = pendingReputation;

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

    console.log("Farm save:", { savedMoney, savedXp, savedRep });
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

  if (newLevel > oldLevel) {
    showToast(
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
      loadScreen("GL_Displays/work.html", initWorkScreen);
    };
  }

  await loadFarmerProgress();
  updateUI();
  spawn();
        }
