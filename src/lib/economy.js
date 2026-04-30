// Простейшие формулы – дальше сможете усложнить.
export const getInflation = ({ moneySupply, gdp }) =>
  limit(100 * (moneySupply?.delta / (gdp?.value || 1)));

export const getDevaluation = ({ reserves, tradeBalance }) =>
  limit(100 * (-tradeBalance / (reserves || 1)));

export const getStateAssetsShare = ({ stateAssets, totalAssets }) =>
  limit(100 * (stateAssets / (totalAssets || 1)));

function limit(v) { return +(Math.max(0, Math.min(v || 0, 50)).toFixed(1)); }
