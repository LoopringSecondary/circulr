import {toBig} from "LoopringJS/common/formatter";
import TokenFormatter from '../tokens/formatters';
import {store} from '../../index'

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

export function getPriceBySymbol(symbol, ifFormat){
  //TODO mock
  if(symbol === 'ETH') {
    return 678
  } else {
    return 31
  }

  // let priceToken = store.getState().prices.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
  // if (ifFormat) {
  //   if (priceToken) {
  //     const price = Number(priceToken.price)
  //     // fix bug: price == string
  //     if (price && typeof price === 'number') {
  //       priceToken.price = price
  //     } else {
  //       priceToken.price = 0
  //     }
  //     return {...priceToken}
  //   } else {
  //     return {
  //       price: 0,
  //     }
  //   }
  // } else {
  //   return {...priceToken}
  // }
}
