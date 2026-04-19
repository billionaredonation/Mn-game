async function initFarmScreen() {
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

  // общий заработок за текущий заход на ферму
  let totalSessionMoney = 0;

  // несохранённый буфер
  let unsavedMoney = 0;
  let unsavedFarmerXp = 0;
  let pendingReputation = 0;

  // прогресс серии
  let successChain = 0;
  let errorChain = 0;

  // общий прогресс навыка фермера
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

  async function loadFarmerProgress() {
    const localXp = Number(localStorage.getItem("mn_farmer_xp") || 0);
    const localLevel = Number(localStorage.getItem("mn_farmer_level") || 1);

    let dbXp = 0;
    let dbLevel = 1;

    try {
      if (window.loadPlayerSkills && window.MN_STATE.playerUuid) {
        const skills = await window.loadPlayerSkills(window.MN_STATE.playerUuid);
        const farmerSkill = skills.find((skill) => skill.skill_code === "farmer");

        if (farmerSkill) {
          dbXp = Number(farmerSkill.xp || 0);
          dbLevel = Number(farmerSkill.level || 1);
        }
      }
    } catch (error) {
      console.warn("Не удалось загрузить farmer skill из БД:", error);
    }

    totalFarmerXp = Math.max(localXp, dbXp);
    farmerLevel = Math.max(localLevel, dbLevel, getFarmerLevelByXp(totalFarmerXp));

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));
  }

  function updateUI() {
    const currentLevel = getCurrentFarmerLevel();
    const currentReward = rewardByLevel(currentLevel);
    const currentFarmerXp = getCurrentFarmerXp();

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);
    if (moneyEl) moneyEl.textContent = `${totalSessionMoney} ₴`;
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

    if (errorChainTextEl) {
      errorChainTextEl.textContent = `${errorChain} / 3`;
    }

    if (errorChainFillEl) {
      errorChainFillEl.style.width = `${(errorChain / 3) * 100}%`;
    }
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

      if (playerUpdate.error) {
        throw playerUpdate.error;
      }

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

      if (skillUpsert.error) {
        throw skillUpsert.error;
      }
    } catch (error) {
      console.warn("Синхронизация фермы с БД не удалась, локально уже сохранено:", error);
    }
  }

  async function saveProgress() {
    if (unsavedMoney <= 0 && unsavedFarmerXp <= 0 && pendingReputation <= 0) {
      return;
    }

    const newBalance = Number(window.MN_STATE.balance || 0) + unsavedMoney;
    const newReputation = Number(window.MN_STATE.reputation || 0) + pendingReputation;
    const newFarmerXp = totalFarmerXp + unsavedFarmerXp;
    const newFarmerLevel = getFarmerLevelByXp(newFarmerXp);

    // сначала локально, чтобы не терять прогресс
    window.MN_STATE.balance = newBalance;
    window.MN_STATE.reputation = newReputation;
    saveState();

    totalFarmerXp = newFarmerXp;
    farmerLevel = newFarmerLevel;

    localStorage.setItem("mn_farmer_xp", String(totalFarmerXp));
    localStorage.setItem("mn_farmer_level", String(farmerLevel));

    const moneyToSave = unsavedMoney;
    const xpToSave = unsavedFarmerXp;
    const repToSave = pendingReputation;

    unsavedMoney = 0;
    unsavedFarmerXp = 0;
    pendingReputation = 0;
    successChain = 0;

    updateUI();

    await syncToDatabase(
      Number(window.MN_STATE.balance || 0),
      Number(window.MN_STATE.reputation || 0),
      totalFarmerXp,
      farmerLevel
    );

    console.log("Farm autosave:", {
      money: moneyToSave,
      farmerXp: xpToSave,
      reputation: repToSave
    });
  }

  function applyMistakePenalty() {
    const currentLevel = getCurrentFarmerLevel();
    const reward = rewardByLevel(currentLevel);

    mistakes += 1;
    errorChain += 1;

    if (errorChain === 1) {
      const penalty = Math.round(reward.money * 0.2);
      unsavedMoney = clampMoney(unsavedMoney - penalty);
      totalSessionMoney = clampMoney(totalSessionMoney - penalty);
    } else if (errorChain === 2) {
      const penalty = Math.round(reward.money * 0.4);
      unsavedMoney = clampMoney(unsavedMoney - penalty);
      totalSessionMoney = clampMoney(totalSessionMoney - penalty);
    } else if (errorChain >= 3) {
      // аннулируем только текущий несохранённый заработок
      totalSessionMoney = clampMoney(totalSessionMoney - unsavedMoney);
      unsavedMoney = 0;
      errorChain = 0;
      successChain = 0;
    }
  }

  async function applyHarvestReward() {
    const currentLevel = getCurrentFarmerLevel();
    const reward = rewardByLevel(currentLevel);

    hits += 1;
    totalSessionMoney += reward.money;
    unsavedMoney += reward.money;
    unsavedFarmerXp += reward.xp;

    successChain += 1;

    // правильное действие сбрасывает штрафную серию
    errorChain = 0;

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
