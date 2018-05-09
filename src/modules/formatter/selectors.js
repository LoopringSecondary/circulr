import {toBig} from "LoopringJS/common/formatter";
import TokenFormatter from '../tokens/formatters';

export function getAssetsByToken(state, token, toUnit) {
  let tokenAssets = state.assets.find(item => item.symbol.toLowerCase() === token.toLowerCase()) || {
    balance: 0,
    allowance: 0
  };
  if (toUnit) {
    const tokenFormatter = new TokenFormatter({symbol: token});
    const balance = tokenFormatter.getUnitAmount(tokenAssets.balance);
    const allowance = tokenFormatter.getUnitAmount(tokenAssets.allowance);
    tokenAssets = {...tokenAssets, balance, allowance}
  } else {
    const balance = toBig(tokenAssets.balance);
    const allowance = toBig(tokenAssets.allowance);
    tokenAssets = {...tokenAssets, balance, allowance}
  }
  return {...tokenAssets}
}
