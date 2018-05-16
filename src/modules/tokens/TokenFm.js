import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";
import config from 'common/config'

export default class TokenFm {
  constructor(token){
      const {symbol,address} = token;
      let tokenConfig = {};
      if(symbol){
        tokenConfig = config.getTokenBySymbol(symbol) || {}
      }else{
        if(address){
          tokenConfig = config.getTokenByAddress(address) || {}
        }else{
          throw new Error('token.symbol or token.symbol must not be empty')
        }
      }
      let newToken = {...tokenConfig,...token};
      let keys = Object.keys(newToken);
      keys.forEach(key=>{
        this[key] = newToken[key]
      })
  }
  getToken(){
    let keys = Object.keys(this);
    let token = {};
    keys.forEach(key=>{
      token[key] = this[key]
    });
    return token
  }

  getUnitAmount(amount){
    amount = amount || 0;
    return toUnitAmount(amount,this.digits)
  }
  getDecimalsAmount(amount){
    toDecimalsAmount(amount,this.digits)
  }
  getUnitAmountValue(amount,price){
    const unitAmount = this.getUnitAmount(amount);
    return unitAmount.times(toBig(price))
  }

  toPricisionFixed(amount,ceil){
    toFixed(amount,this.precision,ceil)
  }
  toFormatLength(amount,ceil){
    formatLength(amount,ceil)
  }
}

export function getBalanceBySymbol({balances, symbol, toUnit}) {
  let tokenAssets = balances.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {
    balance: 0,
    allowance: 0
  };
  // if (toUnit) {
  //   const tokenFormatter = new TokenFm({symbol: symbol});
  //   const balance = tokenFormatter.getUnitAmount(tokenAssets.balance);
  //   const allowance = tokenFormatter.getUnitAmount(tokenAssets.allowance);
  //   tokenAssets = {...tokenAssets, balance, allowance}
  // } else {
  //   const balance = toBig(tokenAssets.balance);
  //   const allowance = toBig(tokenAssets.allowance);
  //   tokenAssets = {...tokenAssets, balance, allowance}
  // }
  return {...tokenAssets}
}

export function getPriceBySymbol({prices,symbol, ifFormat}){
  //TODO mock
  if(symbol === 'ETH') {
    return 678
  } else {
    return 31
  }
  // let priceToken = prices.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
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
export function getPriceByToken(tokenx, tokeny) {
  const market = config.getMarketBySymbol(tokenx, tokeny);
  const pricex = this.getTokenBySymbol(tokenx,true);
  const pricey = this.getTokenBySymbol(tokeny,true);
  if (market) {
    if (market.tokenx.toLowerCase() === tokenx.toLowerCase()) {
    return  pricex && pricey ? (pricex / pricey).toFixed(market.pricePrecision):0
    }else{
     return pricex && pricey ? (pricey / pricex).toFixed(market.pricePrecision):0
    }
  }
  return  0
}
export function getPriceByMarket(market){
  const tokenArray = market.split('-');
  const tokenx = tokenArray[0];
  const tokeny = tokenArray[0];
  return this.getPriceByToken(tokenx,tokeny)
}



