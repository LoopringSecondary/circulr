import intl from 'react-intl-universal'
import commonFm from 'modules/formatter/common'
import {toNumber,toBig,toHex,toFixed} from "LoopringJS/common/formatter";
import TokenFm from "modules/tokens/TokenFm";
export const getTypes = (token)=>{
  let types = [
    {label:intl.get('tx_type.all'),value:''},
    {label:intl.get(`tx_type.transfer`),value:'send'},
    {label:intl.get(`tx_type.receive`),value:'receive'}
  ]
  let approveTypes = [
    {label:intl.get(`tx_type.approve`),value:'approve'}
  ]

  const tradeTypes = [
    {label:intl.get(`tx_type.sell`),value:'sell'},
    {label:intl.get(`tx_type.buy`),value:'buy'},
  ];
  let convertTypes = [{label:intl.get(`tx_type.convert`),value:'convert'}]
  let lrcTypes = [
     {label:intl.get(`tx_type.lrc_fee`),value:'lrc_fee'},
     {label:intl.get(`tx_type.lrc_reward`),value:'lrc_reward'},
  ]
  let othersTypes = [
      {label:intl.get(`tx_type.others`),value:'others'},
  ]

  let cancelTypes = [
    {label:intl.get(`tx_type.cancel_order`),value:'cancel_order'},
    {label:intl.get(`tx_type.cancel_all`),value:'cutoff'},
    {label:intl.get(`tx_type.cancel_pair_order`),value:'cutoff_trading_pair'},
  ]

  if(token.toUpperCase() === 'WETH' || token.toUpperCase() === 'ETH'){
    types = [...types,...convertTypes]
  }

  if(token.toUpperCase() === 'ETH'){
    types = [...types, ...cancelTypes,...othersTypes]
  }

  if(token.toUpperCase() !== 'ETH'){
    types = [...types,...approveTypes,...tradeTypes]
  }

  if(token.toUpperCase() === 'LRC'){
    types = [...types,...lrcTypes]
  }
  return [...types]
}

export class TxFm{
  constructor(tx){
    this.tx = tx
    this.fill = tx.fill
  }
  getType(value){
    switch (this.tx.type) {
      case 'approve':
        return intl.get('tx_list.type.approve', {symbol: this.tx.symbol});
      case 'send':
        return intl.get('tx_list.type.transfer', {symbol: this.tx.symbol,value});
      case 'receive':
        return intl.get('tx_list.type.receive', {symbol: this.tx.symbol,value});
      case 'sell':
        return intl.get('tx_list.type.sell', {symbol: this.tx.symbol,value});
      case 'buy':
        return intl.get('tx_list.type.buy', {symbol: this.tx.symbol,value});
      case 'lrc_fee':
        return  intl.get('tx_list.type.lrc_fee',{value});
      case 'lrc_reward':
        return intl.get('tx_list.type.lrc_reward',{value});
      case 'convert_outcome':
        return this.tx.symbol === 'ETH' ? intl.get('tx_list.type.convert_eth',{value}) : intl.get('tx_list.type.convert_weth',{value});
      case 'convert_income':
        return this.tx.symbol === 'WETH' ? intl.get('tx_list.type.convert_eth',{value}) : intl.get('tx_list.type.convert_weth',{value});
      case 'cancel_order':
        return intl.get('tx_list.type.cancel_order');
      case 'cutoff':
        return intl.get('tx_list.type.cancel_all');
      case 'cutoff_trading_pair':
        return intl.get('tx_list.type.cancel_pair_order', {pair: this.tx.content.market});
      default:
        return intl.get('tx_list.type.others')
    }
  }
  getSide(){
    if(this.tx.type==='lrc_reward' ||this.tx.type==='receive' || this.tx.type==='buy' || this.tx.type.indexOf('income')  !== -1){
      return 'in'
    }
    if(this.tx.type==='lrc_fee' || this.tx.type==='send' || this.tx.type === 'sell' || this.tx.type.indexOf('outcome')  !== -1){
      return 'out'
    }
  }

  getBlockNum(){
    return this.tx.blockNumber
  }

  getTo(){
    return this.tx.to
  }

  getConfirmTime(){
    return this.tx.updateTime && commonFm.getFormatTime(toNumber(this.tx.updateTime) * 1e3)
  }
  getCreateTime(){
    return this.tx.createTime && commonFm.getFormattedTime(this.tx.createTime,'YY-MM-DD HH:SS')
  }
  fromNow(){
    console.log('fromNow')
    return this.tx.createTime && commonFm.fromNow(this.tx.createTime)
  }
  getGas(){
   if(this.tx.status && this.tx.gas_price && this.tx.gas_limit ){
      if(this.tx.status.toLowerCase() === 'pending'){
        return toFixed(toBig(this.tx.gas_price).times(this.tx.gas_limit).div('1e18'),8,true)
      }else{
        return toFixed(toBig(this.tx.gas_price).times(this.tx.gas_used).div('1e18'),8,true)
      }
   }
  }
  getGasPrice(){
    return this.tx.gas_price && toFixed(toNumber(this.tx.gas_price)/(1e9),4,true).toString(10)
  }
  getGasLimit(){
    console.log('formatter:',this.tx);
    return this.tx.gas_limit && toNumber(this.tx.gas_limit).toString(10)
  }
  getNonce(){
   return this.tx.nonce && toNumber(this.tx.nonce)
  }
  getValue(){
   return this.tx.value && toFixed(toBig(this.tx.value).div(1e18).toNumber(),8)
  }
  getFilledAmountOfSell(){
   return this.fill && this.fill.symbol_b && getValues(this.fill.symbol_b,this.fill.amount_b) + '' + this.fill.symbol_b
  }
  getFilledAmountOfBuy(){
   return this.fill && this.fill.symbol_s && getValues(this.fill.symbol_s,this.fill.amount_s) + '' + this.fill.symbol_s
  }
  getLrcFee(){
   return this.fill && this.fill.lrc_fee && getValues('LRC',this.fill.lrc_fee) + '' + 'LRC'
  }
  getLrcReward(){
   return this.fill && this.fill.lrc_fee && getValues('LRC',this.fill.lrc_reward) + '' + 'LRC'
  }
  getMarginSplit(){
   return this.fill && this.fill.symbol_s && getValues(this.fill.symbol_s,this.fill.amount_s) + '' + this.fill.symbol_s
  }
}
export const getValues = (symbol, value)=>{
  const tokenFm = new TokenFm({symbol});
  return  commonFm.getFormatNum(tokenFm.getUnitAmount(value));
}
export function isApproving(pendingTxs, symbol) {
  if (symbol && pendingTxs) {
    const approveTxs = pendingTxs.filter(tx => tx.type === 'approve' && tx.symbol.toLowerCase() === symbol.toLowerCase());
    console.log('Approve TXs:',approveTxs);
    approveTxs.sort((a, b) => b.nonce - a.nonce);
    if (approveTxs.length > 0) {
      console.log('Approve Value:',approveTxs[0].value);
      return toBig(approveTxs[0].value);
    }
  }
}
