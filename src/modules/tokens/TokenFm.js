import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import {formatLength,toUnitAmount,toDecimalsAmount} from "../formatter/common";

export class TokenFm {
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

