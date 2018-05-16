import {toBig} from "LoopringJS/common/formatter";
import TokenFormatter from '../tokens/TokenFm';

export function getAssetByToken(tokenItems, symbol, toUnit) {
  let tokenAssets = tokenItems.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {
    balance: 0,
    allowance: 0
  };
  if (toUnit) {
    const tokenFormatter = new TokenFormatter({symbol: symbol});
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

export function getAssetsByToken(state, symbol, toUnit) {
  return getAssetByToken(state.sockets.balance.items, symbol, toUnit)
}

export function getPriceBySymbol(marketcapItems, symbol, ifFormat){
  let priceToken = marketcapItems.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
  if (ifFormat) {
    if (priceToken) {
      const price = Number(priceToken.price)
      // fix bug: price == string
      if (price && typeof price === 'number') {
        priceToken.price = price
      } else {
        priceToken.price = 0
      }
      return {...priceToken}
    } else {
      return {
        price: 0,
      }
    }
  } else {
    return {...priceToken}
  }
}
