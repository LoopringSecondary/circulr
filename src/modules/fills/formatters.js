import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";
import TokenFm from "../tokens/TokenFm";
import {toFixed} from "../../common/loopringjs/src/common/formatter";

export class FillFm{
  constructor(fill={}){
    this.fill = fill
  }
  getRingIndex(){
    return this.fill.ringIndex
  }
  getRingHash(){
    return this.fill.ringHash
  }
  getTxHash(){
    return this.fill.txHash
  }
  getMiner(){
    return this.fill.miner
  }
  getBlockNumber(){
    return this.fill.blockNumber
  }
  getFeeRecipient(){
    return this.fill.feeRecipient
  }
  getTotalLrcFee(){
    return commonFm.getFormatNum(toFixed(toBig(this.fill.lrcFee).div(1e18)),6) + ' LRC'
  }
  getTotalSplitFee(){
    const token =  this.fill.splitS ? this.fill.tokenS : this.fill.tokenB;
    const tokenFm = new TokenFm({symbol:token});
    const split =  this.fill.splitS ? this.fill.splitS : this.fill.splitB;
    return commonFm.getFormatNum(tokenFm.toPricisionFixed(tokenFm.getUnitAmount(split))) + ' '
  }

  getAmount(){
    const fmS = this.fill.side.toLowerCase() === 'buy' ? new TokenFm({symbol: this.fill.tokenB}) : new TokenFm({symbol: this.fill.tokenS});
    const amount = this.fill.side.toLowerCase() === 'buy' ? fmS.getUnitAmount(this.fill.amountB) : fmS.getUnitAmount(this.fill.amountS);
    const symbol = this.fill.side === 'buy' ? this.fill.tokenB : this.fill.tokenS
    return commonFm.getFormatNum(fmS.toPricisionFixed(amount)) + '' + symbol
  }
  getTotal(){
    const fmS = this.fill.side.toLowerCase() === 'buy' ? new TokenFm({symbol: this.fill.tokenS}) : new TokenFm({symbol: this.fill.tokenB});
    const amount = this.fill.side.toLowerCase() === 'buy' ? fmS.getUnitAmount(this.fill.amountS) : fmS.getUnitAmount(this.fill.amountB);
    const symbol = this.fill.side === 'buy' ? this.fill.tokenS : this.fill.tokenB
    return commonFm.getFormatNum(fmS.toPricisionFixed(amount)) + '' + symbol
  }
  getPrice(){
    const tokenB = new TokenFm({symbol:this.fill.tokenB});
    const tokenS = new TokenFm({symbol:this.fill.tokenS});
    const market = config.getMarketByPair(this.fill.market);
    const price = this.fill.side.toLowerCase() === 'buy' ? tokenS.getUnitAmount(this.fill.amountS).div(tokenB.getUnitAmount(this.fill.amountB)) :
      tokenB.getUnitAmount(this.fill.amountB).div(tokenS.getUnitAmount(this.fill.amountS));
    return commonFm.getFormatNum(toFixed(price,market.pricePrecision,true))
  }
  getLRCFee(){
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.toPricisionFixed(fmLrc.getUnitAmount(this.fill.lrcFee))) + ' LRC'
  }
  getLRCReward(){
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.toPricisionFixed(fmLrc.getUnitAmount(this.fill.lrcReward))) + ' LRC'
  }
  getCreateTime(){
    return commonFm.getFormatTime(toNumber(this.fill.createTime) * 1e3)
  }
}

export default {
  FillFm
}
