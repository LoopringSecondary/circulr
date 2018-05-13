import React from 'react';
import {Icon} from 'antd';
import {toNumber,toBig} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
const getFormatTime = ()=>{}

const status = {
  ORDER_NEW: {},
  ORDER_PARTIAL: {},
  ORDER_FINISHED: {},
  ORDER_CANCEL: {},
  ORDER_CUTOFF: {}
}
export default const formatters = {
  getOrderHash:(item)=>item.originalOrder.hash,
  getMarket: (item) =>`${item.originalOrder.tokenB}/${item.originalOrder.tokenS}`,
  getSide: (item) =>item.side,
  getAmount: (item) => {
    const side = item.originalOrder.side.toLowerCase();
    let token =  side === 'buy' ? window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB) : window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
    token = token || {digits: 18, precision: 6};
    const amount = side === 'buy' ? item.originalOrder.amountB : item.originalOrder.amountS;
    const symbol = side === 'buy' ? item.originalOrder.tokenB : item.originalOrder.tokenS;
    return window.uiFormatter.getFormatNum(toNumber((toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision))) + ' ' + symbol
  },
  getPrice: (item) => {
    const tokenB = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenB);
    const tokenS = window.CONFIG.getTokenBySymbol(item.originalOrder.tokenS);
    const market = window.CONFIG.getMarketBySymbol(item.originalOrder.tokenB,item.originalOrder.tokenS);
    const price =  item.originalOrder.side.toLowerCase() === 'buy' ?
      toBig(item.originalOrder.amountS).div('1e'+tokenS.digits).div(toBig(item.originalOrder.amountB).div('1e'+tokenB.digits)).toFixed(market.pricePrecision) :
      toBig(item.originalOrder.amountB).div('1e'+tokenB.digits).div(toBig(item.originalOrder.amountS).div('1e'+tokenS.digits)).toFixed(market.pricePrecision);
    return window.uiFormatter.getFormatNum(price)
  },
  getTotal: (item) => {
      const side = item.originalOrder.side.toLowerCase();
      const tokenS = item.originalOrder.tokenS;
      const tokenB = item.originalOrder.tokenB;
      const amountS = item.originalOrder.amountS;
      const amountB = item.originalOrder.amountB;
      let token = side === 'buy' ? window.CONFIG.getTokenBySymbol(tokenS): window.CONFIG.getTokenBySymbol(tokenB);
      token = token || {digits: 18, precision: 6};
      const amount = side === 'buy' ? amountS : amountB;
      const symbol = side === 'buy' ? tokenS : tokenB;
      const total = (toNumber(amount) / Number('1e' + token.digits)).toFixed(token.precision)
      return  window.uiFormatter.getFormatNum(toNumber(total)) + ' ' +symbol
  },
  getLrcFee: (item) => {
      let token = window.CONFIG.getTokenBySymbol('LRC');
      token = token || {digits: 18, precision: 6};
      const total = (toNumber(item.originalOrder.lrcFee) / Number('1e' + token.digits)).toFixed(token.precision);
      return window.uiFormatter.getFormatNum(toNumber(total))  + ' LRC'
  },
  getTimestamp: (item) => getFormatTime(toNumber(item.originalOrder.validSince) * 1e3),
  getFilled:()=>{},
  getStatus:()=>item.status,
}
