async function initMineScreen() {
  const board = document.getElementById("mineBoard");
  const backBtn = document.getElementById("mineBackBtn");

  const hitsEl = document.getElementById("mineHitsValue");
  const mistakesEl = document.getElementById("mineMistakesValue");
  const grossMoneyEl = document.getElementById("mineGrossMoneyValue");
  const penaltyEl = document.getElementById("minePenaltyValue");
  const netMoneyEl = document.getElementById("mineNetMoneyValue");
  const xpEl = document.getElementById("mineXpValue");
  const levelEl = document.getElementById("mineLevelChip");
  const progressFill = document.getElementById("mineProgressFill");
  const autosaveEl = document.getElementById("mineAutosaveInfo");
  const autosaveFillEl = document.getElementById("mineAutosaveFill");

  let hits = 0;
  let mistakes = 0;

  let grossMoney = 0;
  let penaltyMoney = 0;

  let unsavedNetMoney = 0;
  let unsavedMinerXp = 0;
  let pendingReputation = 0;

  let successChain = 0;
  let chainNetMoney = 0;

  let totalMinerXp = 0;
  let minerLevel = 1;

  function minerLevelByXp(xp, storedLevel = 1) {
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

  function levelMultiplier(level) {
    if (level === 1) return 1.0;
    if (level === 2) return 1.15;
    if (level === 3) return 1.3;
    if (level === 4) return 1.45;
    if (level === 5) return 1.6;
    if (level === 6) return 1.8;
    if (level === 7) return 2.0;
    if (level === 8) return 2.25;
    if (level === 9) return 2.5;
    return 3.0;
  }

  function clampMoney(value) {
    return Math.max(0, Math.round(value));
  }

  function formatXpValue(value) {
    const num = Number(value || 0);
    if (Number.isInteger(num)) return String(num);
    return num.toFixed(1).replace(/\.0$/, "");
  }

  function getCurrentMinerXp() {
    return totalMinerXp + unsavedMinerXp;
  }

  function getCurrentMinerLevel() {
    return minerLevelByXp(getCurrentMinerXp(), minerLevel);
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

  async function loadMinerProgress() {
    const localXp = Number(localStorage.getItem("mn_miner_xp") || 0);
    const localLevel = Number(localStorage.getItem("mn_miner_level") || 1);

    totalMinerXp = localXp;
    minerLevel = minerLevelByXp(totalMinerXp, localLevel);

    try {
      if (window.loadPlayerSkills && window.MN_STATE.playerUuid) {
        const skills = await window.loadPlayerSkills(window.MN_STATE.playerUuid);
        const minerSkill = skills.find((skill) => skill.skill_code === "miner");

        if (minerSkill) {
          totalMinerXp = Math.max(totalMinerXp, Number(minerSkill.xp || 0));
          minerLevel = minerLevelByXp(
            totalMinerXp,
            Number(minerSkill.level || minerLevel)
          );
        }
      }
    } catch (error) {
      console.warn("Не удалось загрузить miner из БД:", error);
    }

    localStorage.setItem("mn_miner_xp", String(totalMinerXp));
    localStorage.setItem("mn_miner_level", String(minerLevel));
  }

  function updateUI() {
    const currentLevel = getCurrentMinerLevel();
    const currentXp = getCurrentMinerXp();

    if (hitsEl) hitsEl.textContent = String(hits);
    if (mistakesEl) mistakesEl.textContent = String(mistakes);

    if (grossMoneyEl) grossMoneyEl.textContent = `${formatMoney(grossMoney)} ₴`;
    if (penaltyEl) penaltyEl.textContent = `${formatMoney(penaltyMoney)} ₴`;
    if (netMoneyEl) netMoneyEl.textContent = `${formatMoney(getNetMoney())} ₴`;

    if (xpEl) xpEl.textContent = `${formatXpValue(currentXp)} / 10000 XP`;
    if (levelEl) levelEl.textContent = `Ур. ${currentLevel}`;

    if (autosaveEl) autosaveEl.textContent = `${successChain} / 3`;
    if (autosaveFillEl) autosaveFillEl.style.width = `${(successChain / 3) * 100}%`;

    if (progressFill) {
      progressFill.style.width = `${Math.min((currentXp / 10000) * 100, 100)}%`;
    }
  }

  async function syncToDatabase(newBalance, newReputation, newMinerXp, newMinerLevel) {
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
            skill_code: "miner",
            xp: newMinerXp,
            level: newMinerLevel,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "player_uuid,skill_code"
          }
        );

      if (skillUpsert.error) throw skillUpsert.error;
    } catch (error) {
      console.warn("Не удалось синхронизировать шахту с БД:", error);
    }
  }

  async function saveProgress() {
    if (unsavedNetMoney <= 0 && unsavedMinerXp <= 0 && pendingReputation <= 0) {
      return;
    }

    const savedMoney = unsavedNetMoney;
    const savedXp = unsavedMinerXp;
    const savedRep = pendingReputation;

    window.MN_STATE.balance = Number(window.MN_STATE.balance || 0) + savedMoney;
    window.MN_STATE.reputation = Number(window.MN_STATE.reputation || 0) + savedRep;
    saveState();

    totalMinerXp += savedXp;
    minerLevel = minerLevelByXp(totalMinerXp, minerLevel);

    localStorage.setItem("mn_miner_xp", String(totalMinerXp));
    localStorage.setItem("mn_miner_level", String(minerLevel));

    unsavedNetMoney = 0;
    unsavedMinerXp = 0;
    pendingReputation = 0;
    successChain = 0;
    chainNetMoney = 0;

    updateUI();

    await syncToDatabase(
      Number(window.MN_STATE.balance || 0),
      Number(window.MN_STATE.reputation || 0),
      totalMinerXp,
      minerLevel
    );

    if (savedMoney > 0) {
      showMoneyToast(savedMoney, "plus");
    }
  }

  function applySandCollapse() {
    const burned = chainNetMoney;

    mistakes += 1;
    penaltyMoney += burned;
    unsavedNetMoney = clampMoney(unsavedNetMoney - burned);

    chainNetMoney = 0;
    successChain = 0;

    if (burned > 0) {
      showMoneyToast(-burned, "minus");
    }
  }

  function applyPenaltyFlat(amount) {
    mistakes += 1;
    penaltyMoney += amount;
    unsavedNetMoney = clampMoney(unsavedNetMoney - amount);
    chainNetMoney = clampMoney(chainNetMoney - amount);
    showMoneyToast(-amount, "minus");
  }

  async function applyReward(kind) {
    const oldLevel = getCurrentMinerLevel();
    const mult = levelMultiplier(oldLevel);

    let moneyReward = 0;
    let xpReward = 0;

    if (kind === "earth") {
      moneyReward = 2 * mult;
      xpReward = 0.4 * mult;
    }

    if (kind === "sand") {
      moneyReward = 2 * mult;
      xpReward = 0.5 * mult;
    }

    if (kind === "stone") {
      moneyReward = 10 * mult;
      xpReward = 1.5 * mult;
    }

    if (kind === "metal") {
      moneyReward = 15 * mult;
      xpReward = 1.7 * mult;
    }

    hits += 1;
    grossMoney += moneyReward;
    unsavedNetMoney += moneyReward;
    chainNetMoney += moneyReward;
    unsavedMinerXp += xpReward;

    const newLevel = getCurrentMinerLevel();

    if (newLevel > oldLevel && typeof window.showToast === "function") {
      window.showToast(
        `🎉 Навык Шахтёр повышен до ${newLevel} уровня!`,
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

      let kind = "sand";
      let symbol = "🟧";

      if (roll < 0.6) {
        kind = "sand";
        symbol = "🟧";
      } else if (roll < 0.7) {
        kind = "earth";
        symbol = "🟫";
      } else if (roll < 0.85) {
        kind = "stone";
        symbol = "🗿";
      } else {
        kind = "metal";
        symbol = "🔩";
      }

      item.textContent = symbol;

      item.onclick = async () => {
        if (kind === "sand") {
          if (Math.random() < 0.5) {
            await applyReward("sand");
          } else {
            applySandCollapse();
          }
        } else if (kind === "earth") {
          if (Math.random() < 0.5) {
            await applyReward("earth");
          } else {
            applyPenaltyFlat(4);
          }
        } else if (kind === "stone") {
          await applyReward("stone");
        } else if (kind === "metal") {
          await applyReward("metal");
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

  await loadMinerProgress();
  updateUI();
  spawn();
}
