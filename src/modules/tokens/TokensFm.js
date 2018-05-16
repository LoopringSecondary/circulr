import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";
import {getBalanceBySymbol,getPriceBySymbol} from "./TokenFm";

export default class TokensFm{
  constructor({marketcap,balance,tokens}){
    this.marketcap = marketcap
    this.balance = balance
    this.tokens = tokens
  }
  getList(){
    const filteredTokens = filterTokens(this.tokens)
    const sortedTokens = sortTokens(filteredTokens)
    return setBalancesAndPrices({balances:this.balance.items,prices:this.marketcap.items,tokens:sortedTokens})
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

export const setBalancesAndPrices = ({balances=[],prices=[],tokens})=>{
  const newTokens = [...tokens]
  newTokens.forEach(item => {
      const tokenBalance = getBalanceBySymbol({balances,symbol:item.symbol})
      const tokenPrice = getPriceBySymbol({prices,symbol:item.symbol})
      item.balance = tokenBalance.balance
      item.allowance = tokenBalance.allowance
      item.price = tokenPrice.price
  })
  return newTokens
}


