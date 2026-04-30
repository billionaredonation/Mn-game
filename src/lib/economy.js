/* Простейшие формулы, чтобы получить %-значения
   из «сырых» чисел. При желании поменяете логику —
   всё в одном месте. */

export const getInflation = ({ moneySupply, gdp }) =>
  limit(100 * (moneySupply.delta / gdp.value));

export const getDevaluation = ({ reserves, tradeBalance }) =>
  limit(100 * (-tradeBalance / reserves));

export const getStateAssetsShare = ({ stateAssets, totalAssets }) =>
  limit(100 * stateAssets / totalAssets);

function limit(num) {
  return +(Math.max(0, Math.min(num || 0, 50)).toFixed(1));
}
