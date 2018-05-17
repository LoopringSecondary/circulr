import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import config from "common/config";
import commonFm from "../formatter/common";
import TokenFm from "../tokens/TokenFm";

const formatters = {
  amount: (item) => {
    const fmS = item.side.toLowerCase() === 'buy' ? new TokenFm({symbol: item.tokenB}) : new TokenFm({symbol: item.tokenS});
    const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountB) : fmS.getAmount(item.amountS);
    const symbol = item.side === 'buy' ? item.tokenB : item.tokenS
    return commonFm.getFormatNum(amount) + '' + symbol
  },
  total: (item) => {
    const fmS = item.side.toLowerCase() === 'buy' ? new TokenFm({symbol: item.tokenS}) : new TokenFm({symbol: item.tokenB});
    const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountS) : fmS.getAmount(item.amountB);
    const symbol = item.side === 'buy' ? item.tokenS : item.tokenB
    return commonFm.getFormatNum(amount) + '' + symbol
  },
  price: (item) => {
    const tokenB = config.getTokenBySymbol(item.tokenB);
    const tokenS = config.getTokenBySymbol(item.tokenS);
    const market = config.getMarketByPair(item.market);
    const price = item.side.toLowerCase() === 'buy' ? (toBig(item.amountS).div('1e' + tokenS.digits).div(toBig(item.amountB).div('1e' + tokenB.digits))).toFixed(market.pricePrecision) :
      (toBig(item.amountB).div('1e' + tokenB.digits).div(toBig(item.amountS).div('1e' + tokenS.digits))).toFixed(market.pricePrecision);
    return commonFm.getFormatNum(price)
  },
  lrcFee: (item) => {
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.getAmount(item.lrcFee)) + ' LRC'
  },
  lrcReward: (item) => {
    const fmLrc = new TokenFm({symbol: 'LRC'});
    return commonFm.getFormatNum(fmLrc.getAmount(item.lrcReward)) + ' LRC'
  },
  time: (item) => {
    return commonFm.getFormatTime(toNumber(item.createTime) * 1e3)
  },
}

export default formatters
