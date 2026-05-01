export function ensurePlayer(state) {
  state.player = state.player || {};

  if (typeof state.player.money !== 'number') state.player.money = 0;
  if (typeof state.player.energy !== 'number') state.player.energy = 100;
  if (typeof state.player.xp !== 'number') state.player.xp = 0;

  state.player.skills = state.player.skills || {};
  if (typeof state.player.skills.strength !== 'number') state.player.skills.strength = 1;
  if (typeof state.player.skills.endurance !== 'number') state.player.skills.endurance = 1;
  if (typeof state.player.skills.intellect !== 'number') state.player.skills.intellect = 1;
  if (typeof state.player.skills.charisma !== 'number') state.player.skills.charisma = 1;

  return state.player;
}

export function canWork(player, job) {
  return player.energy >= job.energy;
}

export function applyJobReward(player, job) {
  player.money += job.pay;
  player.energy = Math.max(0, player.energy - job.energy);
  player.xp += job.xp;

  if (job.skill && player.skills[job.skill]) {
    player.skills[job.skill] += 0.05;
  }

  return player;
}
