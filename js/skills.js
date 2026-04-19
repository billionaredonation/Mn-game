function getSkillConfig(skillCode, xp = 0, storedLevel = 1) {
  if (skillCode === "farmer") {
    const levels = [
      { level: 1, minXp: 0, reward: 10, actionXp: 1.0, nextXp: 500 },
      { level: 2, minXp: 500, reward: 15, actionXp: 1.5, nextXp: 1000 },
      { level: 3, minXp: 1000, reward: 20, actionXp: 2.0, nextXp: 2000 },
      { level: 4, minXp: 2000, reward: 30, actionXp: 2.5, nextXp: 2500 },
      { level: 5, minXp: 2500, reward: 40, actionXp: 3.0, nextXp: 3500 },
      { level: 6, minXp: 3500, reward: 60, actionXp: 3.5, nextXp: 5000 },
      { level: 7, minXp: 5000, reward: 90, actionXp: 4.0, nextXp: 7000 },
      { level: 8, minXp: 7000, reward: 130, actionXp: 4.5, nextXp: 8500 },
      { level: 9, minXp: 8500, reward: 180, actionXp: 5.0, nextXp: 10000 },
      { level: 10, minXp: 10000, reward: 250, actionXp: 6.0, nextXp: 10000 }
    ];

    let derived = levels[0];

    for (const lvl of levels) {
      if (xp >= lvl.minXp) {
        derived = lvl;
      }
    }

    const realLevel = Math.max(Number(storedLevel || 1), derived.level);
    const current = levels.find((lvl) => lvl.level === realLevel) || derived;
    const nextLevel = levels.find((lvl) => lvl.level === realLevel + 1) || null;

    const maxXp = 10000;
    const currentFloor = current.minXp;
    const currentCeil = nextLevel ? nextLevel.minXp : maxXp;
    const currentRange = Math.max(currentCeil - currentFloor, 1);
    const progressInsideLevel = Math.min(Math.max(xp - currentFloor, 0), currentRange);

    const progressPercent = realLevel >= 10
      ? 100
      : Math.min(Math.round((progressInsideLevel / currentRange) * 100), 100);

    return {
      code: "farmer",
      title: "Фермер",
      icon: "🌾",
      description: "Работа с урожаем, полями и сельским трудом.",
      level: realLevel,
      xp,
      maxXp,
      reward: current.reward,
      actionXp: current.actionXp,
      nextXp: nextLevel ? nextLevel.minXp : maxXp,
      progressPercent
    };
  }

  return {
    code: skillCode,
    title: skillCode,
    icon: "📘",
    description: "Навык без описания.",
    level: Number(storedLevel || 1),
    xp: xp || 0,
    maxXp: 10000,
    reward: 0,
    actionXp: 0,
    nextXp: 10000,
    progressPercent: 0
  };
}

function formatSkillXp(value) {
  const num = Number(value || 0);

  if (Number.isInteger(num)) {
    return String(num);
  }

  return num.toFixed(1).replace(/\.0$/, "");
}

function renderSkillsList(skills) {
  const container = document.getElementById("skillsList");
  if (!container) return;

  if (!skills || !skills.length) {
    container.innerHTML = `
      <div class="profile-main-card">
        <p class="eyebrow">ПУСТО</p>
        <div class="empty-state">
          <div class="empty-state-icon">📘</div>
          <h3>Навыков пока нет</h3>
          <p>Как только появятся профессии и прокачка, навыки будут отображаться здесь.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = skills.map((skill) => {
    const config = getSkillConfig(
      skill.skill_code,
      Number(skill.xp || 0),
      Number(skill.level || 1)
    );

    return `
      <div class="skill-card">
        <div class="skill-card-top">
          <div class="skill-icon">${config.icon}</div>

          <div class="skill-top-info">
            <div class="skill-title-row">
              <h3>${config.title}</h3>
              <span class="skill-level-chip">Ур. ${config.level}</span>
            </div>

            <p class="skill-description">${config.description}</p>
          </div>
        </div>

        <div class="skill-progress-wrap">
          <div class="skill-progress-meta">
            <span>${formatSkillXp(config.xp)} / ${formatSkillXp(config.maxXp)} XP</span>
            <span>${config.progressPercent}%</span>
          </div>

          <div class="skill-progress-bar">
            <div class="skill-progress-fill" style="width: ${config.progressPercent}%"></div>
          </div>
        </div>

        <div class="skill-stats-grid">
          <div class="skill-mini-stat">
            <span class="skill-mini-label">За действие</span>
            <strong class="skill-mini-value">+${config.reward} ₴</strong>
          </div>

          <div class="skill-mini-stat">
            <span class="skill-mini-label">Опыт</span>
            <strong class="skill-mini-value">+${formatSkillXp(config.actionXp)} XP</strong>
          </div>
        </div>

        <div class="skill-next-row">
          <span>Следующий порог</span>
          <strong>${formatSkillXp(config.nextXp)} XP</strong>
        </div>
      </div>
    `;
  }).join("");
}

window.getSkillConfig = getSkillConfig;
window.renderSkillsList = renderSkillsList;
window.formatSkillXp = formatSkillXp;
