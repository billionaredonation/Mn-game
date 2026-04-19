function getSkillConfig(skillCode, xp = 0) {
  if (skillCode === "farmer") {
    const levels = [
      { level: 1, minXp: 0, reward: 10, actionXp: 2, nextXp: 100 },
      { level: 2, minXp: 100, reward: 15, actionXp: 4, nextXp: 500 },
      { level: 3, minXp: 500, reward: 20, actionXp: 6, nextXp: 1000 },
      { level: 4, minXp: 1000, reward: 30, actionXp: 8, nextXp: 2000 },
      { level: 5, minXp: 2000, reward: 40, actionXp: 10, nextXp: 2500 },
      { level: 6, minXp: 2500, reward: 60, actionXp: 15, nextXp: 5000 },
      { level: 7, minXp: 5000, reward: 90, actionXp: 20, nextXp: 6500 },
      { level: 8, minXp: 6500, reward: 130, actionXp: 30, nextXp: 7500 },
      { level: 9, minXp: 7500, reward: 180, actionXp: 40, nextXp: 10000 },
      { level: 10, minXp: 10000, reward: 250, actionXp: 50, nextXp: 10000 }
    ];

    let current = levels[0];

    for (const lvl of levels) {
      if (xp >= lvl.minXp) {
        current = lvl;
      }
    }

    const nextLevel = levels.find((lvl) => lvl.level === current.level + 1) || null;
    const maxXp = 10000;
    const currentFloor = current.minXp;
    const currentCeil = nextLevel ? nextLevel.minXp : maxXp;
    const currentRange = Math.max(currentCeil - currentFloor, 1);
    const progressInsideLevel = Math.min(Math.max(xp - currentFloor, 0), currentRange);

    const progressPercent = current.level >= 10
      ? 100
      : Math.min(Math.round((progressInsideLevel / currentRange) * 100), 100);

    return {
      code: "farmer",
      title: "Фермер",
      icon: "🌾",
      description: "Работа с урожаем, полями и сельским трудом.",
      level: current.level,
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
    level: 1,
    xp: xp || 0,
    maxXp: 10000,
    reward: 0,
    actionXp: 0,
    nextXp: 10000,
    progressPercent: 0
  };
}

window.getSkillConfig = getSkillConfig;
