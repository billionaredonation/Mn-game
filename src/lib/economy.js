/* простейшие формулы расчёта — потом усложнишь по балансу */
export const getInflation = ({ moneySupply, gdp }) =>
  clamp(100 * (moneySupply?.delta / (gdp?.value || 1)));

export const getDevaluation = ({ reserves, tradeBalance }) =>
  clamp(100 * (-tradeBalance / (reserves || 1)));

export const getStateAssetsShare = ({ stateAssets, totalAssets }) =>
  clamp(100 * (stateAssets / (totalAssets || 1)));

const clamp = (v) => +(Math.max(0, Math.min(v || 0, 50)).toFixed(1));
