import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig,toFixed} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";
import TokenFm from "../tokens/TokenFm";

export class RingFm{
  constructor(ring={}){
    this.ring = ring.ringInfo || {}
    this.fills = ring.fills || []
  }
  getRingIndex(){
    return this.ring.ringIndex
  }
  getRingHash(){
    return this.ring.ringHash
  }
  getTxHash(){
    return this.ring.txHash
  }
  getMiner(){
    return this.ring.miner
  }
  getBlockNumber(){
    return this.ring.blockNumber
  }
  getFeeRecipient(){
    return this.ring.feeRecipient
  }
  getTotalLrcFee(){
    if(this.ring.totalLrcFee){
      return commonFm.getFormatNum((toBig(this.ring.totalLrcFee).div(1e18)).toFixed(6)) + ' LRC'
    }else{
      return  ' LRC'
    }
  }
  getTotalSplitFee(){
    let totalSplitFee = '';
    if (this.ring.totalSplitFee) {
      for (let key in this.ring.totalSplitFee) {
        const token = new TokenFm({symbol:key});
        totalSplitFee = totalSplitFee !== '' ? totalSplitFee + " + " : totalSplitFee;
        totalSplitFee = totalSplitFee + commonFm.getFormatNum(toFixed(token.getUnitAmount(this.ring.totalSplitFee[key]),6)).concat(' ' + key)
      }
    }
    return totalSplitFee


  }
  getTradeAmount(){
      return this.ring.tradeAmount
  }
  getCreateTime(){
    if(this.ring.timestamp){
      return commonFm.getFormatTime(toNumber(this.ring.timestamp) * 1e3)
    }else{
      return  ''
    }
  }
}

export default {
  RingFm
}
