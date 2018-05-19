import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";
import TokenFm from "../tokens/TokenFm";

export class RingFm{
  constructor(ring={}){
    this.ring = ring
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
  getBlockNumber(){
    return this.ring.blockNumber
  }
  getFeeRecipient(){
    return this.ring.feeRecipient
  }
  getTotalLrcFee(){
    return commonFm.getFormatNum((toNumber(this.ring.totalLrcFee) / 1e18).toFixed(6)) + ' LRC'
  }
  getTotalSplitFee(){
    return 'TODO'
  }
  getTradeAmount(){
    return commonFm.getFormatNum(this.ring.tradeAmount)
  }
  getCreateTime(){
    return commonFm.getFormatTime(toNumber(this.ring.createTime) * 1e3)
  }
}

export default {
  RingFm
}
