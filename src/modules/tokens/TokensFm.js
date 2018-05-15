import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";

export default class TokensFm{
  constructor({marketcap,balances,tokens}){
    this.marketcap = marketcap
    this.balances = balances
    this.tokens = tokens
  }
  getList(){
    const filteredTokens = filterTokens(this.tokens)
    const sortedTokens = sortTokens(filteredTokens)
    return setBalancesAndPrices({balances:this.balances,marketcap:this.marketcap,tokens:sortedTokens})
  }

}

export const sortTokens = (tokens)=>{
  // let customs = window.STORAGE.tokens.getCustomTokens()
  let customs = []
  let _tokens = [...tokens, ...customs]
  tokens = tokens.filter(token => token.symbol !== 'WETH_OLD')
  // eth weth lrc
  const ethToken = _tokens.find(token => token.symbol === 'ETH')
  const wethToken = _tokens.find(token => token.symbol === 'WETH')
  const lrcToken = _tokens.find(token => token.symbol === 'LRC')
  // other tokens
  let otherTokens = _tokens.filter(token => (token.symbol !== 'ETH' && token.symbol !== 'WETH' && token.symbol !== 'LRC'))
  otherTokens = otherTokens.map((token, index) => {
    // let balance = 0
    // if(token.balance){
    //   balance = toBig(token.balance).div('1e' + token.digits).toNumber()
    // }
    token.sortByBalance = token.balance
    return token
  })
  const sorter = (tokenA, tokenB) => {
    const pa = Number(tokenA.sortByBalance);
    const pb = Number(tokenB.sortByBalance);
    if (pa === pb) {
      return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
    } else {
      return pb - pa;
    }
  };
  otherTokens.sort(sorter);
  let sortedTokens = []
  if (lrcToken) {
    sortedTokens.push(lrcToken)
  }
  if (ethToken) {
    sortedTokens.push(ethToken)
  }
  if (wethToken) {
    sortedTokens.push(wethToken)
  }
  sortedTokens = sortedTokens.concat(otherTokens)
  return sortedTokens
}
export const filterTokens = (list)=>{
  const {items,filters,favored} = list
  let keys = Object.keys(filters)
  let tokens = [...items]
  keys.map(key => {
    const value = filters[key]
    if (key === 'ifOnlyShowMyFavorite') {
      if (value) {
        tokens = tokens.filter(token => !!favored[token.symbol] === !!value)
      }
    }
    if (key === 'ifHideSmallBalance') {
      if (value) {
        // tokens = tokens.filter(token => toNumber(token['balance']) > 0)// TODO
        tokens = tokens.filter(token => token['balance'] > 0)// TODO
      }
    }
    if (key === 'keywords') {
      tokens = tokens.filter(token => {
        let text = (token.symbol + token.title).toLowerCase()
        return text.indexOf(value.toLowerCase()) > -1
      })
    }
  })
  return [...tokens]
}


export const setBalancesAndPrices = ({balances=[],marketcap=[],tokens})=>{
  const newTokens = [...tokens]
  // newTokens.forEach(item => {
  //     const tokenBalance = getBalanceBySymbol(item.symbol, true)
  //     const tokenPrice = getPriceBySymbol(item.symbol, true)
  //     item.balance = tokenBalance.balance
  //     item.allowance = tokenBalance.allowance
  //     item.price = tokenPrice.price
  // })
  return newTokens
}


// socket balance
export function getBalanceBySymbol({symbol,balances,ifFormat}){
  let assetToken = balances.find(item => item.symbol.toLowerCase() === symbol.toLowerCase() ) || {balance:0, allowance:0}
  if(ifFormat){
    if(assetToken){
      const balance =  Number(assetToken.balance)
      const allowance =  Number(assetToken.allowance)
      // fix bug: balance == string
      if(balance && typeof balance === 'number'){
        assetToken.balance = balance
      }else{
         assetToken.balance = 0
      }
      if(allowance && typeof allowance === 'number'){
        assetToken.allowance = allowance
      }else{
         assetToken.allowance = 0
      }
      return {...assetToken}
    }else{
      return {
        balance:0,
        allowance:0,
      }
    }
  }else{
    return {...assetToken}
  }
}

// socket price
export function getPriceBySymbol({symbol, prices,ifFormat}) {
  let priceToken = prices.find(item => item.symbol.toLowerCase() === symbol.toLowerCase()) || {price: 0}
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

export function getPriceByToken(tokenx, tokeny) {
  const market = window.CONFIG.getMarketBySymbol(tokenx, tokeny);
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

