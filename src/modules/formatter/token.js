import {toBig,toFixed} from "Loopring/common/formatter";
import {formatLength} from "./common";

export function getPrice(){
  // TODO
}


export default class TokenFormatter {
  constructor(token){
      const {symbol,address} = token
      let tokenConfig = {}
      if(symbol){
        tokenConfig = window.CONFIG.getTokenBySymbol(symbol) || {}
      }else{
        if(address){
          tokenConfig = window.CONFIG.getTokenByAddress(address) || {}
        }else{
          console.error('token.symbol or token.symbol must not be empty')
        }
      }
      let newToken = {...tokenConfig,...token}
      let keys = Object.keys(newToken)
      keys.forEach(key=>{
        this[key] = newToken[key]
      })
  }
  getToken(){
    let keys = Object.keys(this)
    let token = {}
    keys.forEach(key=>{
      token[key] = this[key]
    })
    return token
  }

  getAmount(amount){
    let number
    if(amount){
      number = (toNumber(amount) / Number('1e' + this.digits)).toFixed(this.precision)
    }else{
      number = 0
    }
    return formatLength(number)

  }
  getAmountValue(amount,price){
    const formattedAmount = this.getAmount(amount)
    return formatLength(formattedAmount * price)
  }
  getBalance(){
    return this.getAmount(this.balance)
  }
  getBalanceValue(price){
    return this.getAmountValue(this.balance,price)
  }
}
