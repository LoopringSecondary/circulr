import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";

export default class TokenFormatter {
  constructor(token){
      const {symbol,address} = token;
      let tokenConfig = {};
      if(symbol){
        tokenConfig = window.CONFIG.getTokenBySymbol(symbol) || {}
      }else{
        if(address){
          tokenConfig = window.CONFIG.getTokenByAddress(address) || {}
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
export const setTokens = ({balance=[],marketcap=[],tokens})=>{
  const newTokens = [...tokens]
  // newTokens.forEach(item => {
  //     const tokenBalance = balance.getTokenBySymbol(item.symbol, true)
  //     const tokenPrice = marketcap.getTokenBySymbol(item.symbol, true)
  //     item.balance = tokenBalance.balance
  //     item.allowance = tokenBalance.allowance
  //     item.price = tokenPrice.price
  // })
  return newTokens
}

