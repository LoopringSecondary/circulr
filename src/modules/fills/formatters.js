import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";
import TokenFm from "../tokens/TokenFm";

export class FillFm{
  constructor(fill={}){
    this.fill = fill
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
  getAmount(){
    const fmS = this.fill.side.toLowerCase() === 'buy' ? new TokenFm({symbol: this.fill.tokenB}) : new TokenFm({symbol: this.fill.tokenS});
    const amount = this.fill.side.toLowerCase() === 'buy' ? fmS.getUnitAmount(this.fill.amountB) : fmS.getUnitAmount(this.fill.amountS);
    const symbol = this.fill.side === 'buy' ? this.fill.tokenB : this.fill.tokenS
    return commonFm.getFormatNum(amount) + '' + symbol
  }
  getTotal(){
    const fmS = this.fill.side.toLowerCase() === 'buy' ? new TokenFm({symbol: this.fill.tokenS}) : new TokenFm({symbol: this.fill.tokenB});
    const amount = this.fill.side.toLowerCase() === 'buy' ? fmS.getUnitAmount(this.fill.amountS) : fmS.getUnitAmount(this.fill.amountB);
    const symbol = this.fill.side === 'buy' ? this.fill.tokenS : this.fill.tokenB
    return commonFm.getFormatNum(amount) + '' + symbol
  }
  getPrice(){
    const tokenB = config.getTokenBySymbol(this.fill.tokenB);
    const tokenS = config.getTokenBySymbol(this.fill.tokenS);
    const market = config.getMarketByPair(this.fill.market);
    const price = this.fill.side.toLowerCase() === 'buy' ? (toBig(this.fill.amountS).div('1e' + tokenS.digits).div(toBig(this.fill.amountB).div('1e' + tokenB.digits))).toFixed(market.pricePrecision) :
      (toBig(this.fill.amountB).div('1e' + tokenB.digits).div(toBig(this.fill.amountS).div('1e' + tokenS.digits))).toFixed(market.pricePrecision);
    return commonFm.getFormatNum(price)
  }
  getLRCFee(){
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.getUnitAmount(this.fill.lrcFee)) + ' LRC'
  }
  getLRCReward(){
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.getUnitAmount(this.fill.lrcReward)) + ' LRC'
  }
  getCreateTime(){
    return commonFm.getFormatTime(toNumber(this.fill.createTime) * 1e3)
  }
}

export default {
  FillFm
}
