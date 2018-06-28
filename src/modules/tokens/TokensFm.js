import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";
import {getBalanceBySymbol,getPriceBySymbol} from "./TokenFm";
import {calculateWorthInLegalCurrency} from '../orders/formatters'

export default class TokensFm{
  constructor({marketcap,balance,tokens}){
    this.marketcap = marketcap
    this.balance = balance
    this.tokens = tokens
  }
  getList(){
    const filteredTokens = filterTokens(this.tokens)
    const balanceTokens = setBalancesAndPrices({balances:this.balance.items,prices:this.marketcap.items,tokens:filteredTokens})
    return sortTokens(balanceTokens)
  }
  getTotalWorth() {
    const filteredTokens = filterTokens(this.tokens)
    const balanceTokens = setBalancesAndPrices({balances:this.balance.items,prices:this.marketcap.items,tokens:filteredTokens})
    let totalWorth = toBig(0)
    balanceTokens.forEach(item => {
      const worth = calculateWorthInLegalCurrency(this.marketcap.items, item.symbol, item.balance)
      totalWorth = totalWorth.plus(worth)
    })
    return totalWorth
  }
}

export const sorterByBalance = (tokenA, tokenB) => {
  const pa = toBig(tokenA.balance);
  const pb = toBig(tokenB.balance);
  if (pa.eq(pb)) {
    return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
  } else {
    return pb.gt(pa);
  }
};

export const sorterBySymbol = (tokenA, tokenB) => {
  if(tokenA.symbol > tokenB.symbol){
    return 1;
  } else if (tokenA.symbol < tokenB.symbol){
    return -1;
  } else {
    return 0;
  }
};

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
  const sorter = (tokenA, tokenB) => {
    if(tokenA !== undefined && tokenB !== undefined && tokenA.balance !== undefined && tokenB.balance !== undefined) {
      const pa = tokenA.balance;
      const pb = tokenB.balance;
      if (pa.eq(pb)) {
        return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
      } else {
        return pb.minus(pa);
      }
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
  let tokens = [...items.filter(token => token.symbol !== 'WETH_OLD')]
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

export const setBalancesAndPrices = ({balances=[],prices=[],tokens})=>{
  const newTokens = [...tokens]
  newTokens.forEach(item => {
      const tokenBalance = getBalanceBySymbol({balances,symbol:item.symbol,toUnit:true})
      const tokenPrice = getPriceBySymbol({prices,symbol:item.symbol,toUnit:true})
      item.balance = tokenBalance.balance
      item.allowance = tokenBalance.allowance
      item.price = tokenPrice.price
  })
  return newTokens
}


