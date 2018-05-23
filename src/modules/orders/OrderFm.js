import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";

const status = {
  ORDER_NEW: {},
  ORDER_PARTIAL: {},
  ORDER_FINISHED: {},
  ORDER_CANCEL: {},
  ORDER_CUTOFF: {}
}
export class OrderFm {
  constructor(order){
    this.order = order
  }
  getOrderHash(){
    return this.order.originalOrder && this.order.originalOrder.hash
  }
  getMarket(){
    return this.order.originalOrder && `${this.order.originalOrder.tokenB}/${this.order.originalOrder.tokenS}`
  }
  getSide(){
    return this.order.originalOrder && this.order.originalOrder.side
  }
  getAmount(){
    if(this.order.originalOrder){
      const side = this.order.originalOrder.side.toLowerCase();
      let token =  side === 'buy' ? config.getTokenBySymbol(this.order.originalOrder.tokenB) : config.getTokenBySymbol(this.order.originalOrder.tokenS);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? this.order.originalOrder.amountB : this.order.originalOrder.amountS;
      const symbol = side === 'buy' ? this.order.originalOrder.tokenB : this.order.originalOrder.tokenS;
      return commonFm.getFormatNum(toNumber((toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision))) + ' ' + symbol
    }else{
      return null
    }
  }
  getPrice(){
    if(this.order.originalOrder){
      const tokenB = config.getTokenBySymbol(this.order.originalOrder.tokenB);
      const tokenS = config.getTokenBySymbol(this.order.originalOrder.tokenS);
      const market = config.getMarketBySymbol(this.order.originalOrder.tokenB,this.order.originalOrder.tokenS);
      const price =  this.order.originalOrder.side.toLowerCase() === 'buy' ?
        toBig(this.order.originalOrder.amountS).div('1e'+tokenS.digits).div(toBig(this.order.originalOrder.amountB).div('1e'+tokenB.digits)).toFixed(market.pricePrecision) :
        toBig(this.order.originalOrder.amountB).div('1e'+tokenB.digits).div(toBig(this.order.originalOrder.amountS).div('1e'+tokenS.digits)).toFixed(market.pricePrecision);
      return commonFm.getFormatNum(price)
    }else{
      return null
    }
  }
  getTotal(){
    if(this.order.originalOrder){
      const side = this.order.originalOrder.side.toLowerCase();
      const tokenS = this.order.originalOrder.tokenS;
      const tokenB = this.order.originalOrder.tokenB;
      const amountS = this.order.originalOrder.amountS;
      const amountB = this.order.originalOrder.amountB;
      let token = side === 'buy' ? config.getTokenBySymbol(tokenS): config.getTokenBySymbol(tokenB);
      token = token || {digits: 18, precision: 6}
      const amount = side === 'buy' ? amountS : amountB;
      const symbol = side === 'buy' ? tokenS : tokenB;
      const total = (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision)
      return  commonFm.getFormatNum(toNumber(total)) + ' ' +symbol
    }else{
      return null
    }
  }
  getLRCFee(){
    if(this.order.originalOrder){
      let token = config.getTokenBySymbol('LRC');
      token = token || {digits: 18, precision: 6};
      const total = (toNumber(this.order.originalOrder.lrcFee) / Number('1e' + token.digits)).toFixed(token.precision);
      return commonFm.getFormatNum(toNumber(total))  + ' LRC'
    }else{
      return null
    }
  }
  getCreateTime(){
    if(this.order.originalOrder){
      return commonFm.getFormattedTime(toNumber(this.order.originalOrder.validSince),'MM-DD HH:MM')
    }else{
      return null
    }
  }
  getExpiredTime(){
    if(this.order.originalOrder){
      return commonFm.getFormattedTime(toNumber(this.order.originalOrder.validUntil),'MM-DD HH:MM')
    }else{
      return null
    }
  }
  getFilledPercent(){
    if(this.order.originalOrder){
      let percent = 0;
      if (!this.order.originalOrder.buyNoMoreThanAmountB) {
        percent = (this.order.dealtAmountS / this.order.originalOrder.amountS * 100).toFixed(1)
      } else {
        percent = (this.order.dealtAmountB / this.order.originalOrder.amountB * 100).toFixed(1)
      }
      return percent
    }else{
      return null
    }

  }
  getStatus(){return this.order.status}

  getMarginSplit(){
    return  toNumber(this.order.originalOrder.marginSplitPercentage)
  }
}

