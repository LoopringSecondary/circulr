import intl from 'react-intl-universal'
import commonFm from 'modules/formatter/common'
import {toNumber,toBig,toHex,toFixed} from "LoopringJS/common/formatter";
import TokenFm from "modules/tokens/TokenFm";
export const getTypes = (token)=>{
  let types = [
    {label:intl.get(`global.all`)+ ' ' +intl.get('txs.type'),value:''},
    {label:intl.get(`txs.type_sell`),value:'sell'},
    {label:intl.get(`txs.type_buy`),value:'buy'},
    {label:intl.get(`txs.type_transfer`),value:'send'},
    {label:intl.get(`txs.type_receive`),value:'receive'},
    {label:intl.get(`txs.type_enable`),value:'approve'},
  ]
  let convertTypes = [{label:intl.get(`txs.type_convert`),value:'convert'}]
  let lrcTypes = [
     {label:intl.get(`txs.type_lrc_fee`),value:'lrc_fee'},
     {label:intl.get(`txs.type_lrc_reward`),value:'lrc_reward'},
  ]
  let othersTypes = [
     // {label:intl.get(`txs.type_others`),value:'others'},
  ]
  if(token.toUpperCase() === 'WETH' || token.toUpperCase() === 'ETH'){
    types = [...types,...convertTypes]
  }
  if(token.toUpperCase() === 'LRC'){
    types = [...types,...lrcTypes]
  }
  return [...types,...othersTypes]
}

export class TxFm{
  constructor(tx){
    this.tx = tx
    this.fill = tx.fill
  }
  getType(){
    switch (this.tx.type) {
      case 'approve':
        return intl.get('txs.type_enable_title', {symbol: this.tx.symbol});
      case 'send':
        return intl.get('txs.type_transfer_title', {symbol: this.tx.symbol});
      case 'receive':
        return intl.get('txs.type_receive_title', {symbol: this.tx.symbol});
      case 'sell':
        return intl.get('txs.type_sell_title', {symbol: this.tx.symbol});
      case 'buy':
        return intl.get('txs.type_buy_title', {symbol: this.tx.symbol});
      case 'lrc_fee':
        return  intl.get('orders.LrcFee');
      case 'lrc_reward':
        return intl.get('orders.LrcReward');
      case 'convert_outcome':
        return this.tx.symbol === 'ETH' ? intl.get('txs.type_convert_title_eth') : intl.get('txs.type_convert_title_weth');
      case 'convert_income':
        return this.tx.symbol === 'WETH' ? intl.get('txs.type_convert_title_eth') : intl.get('txs.type_convert_title_weth');
      case 'cancel_order':
        return intl.get('txs.cancel_order')
      case 'cutoff':
        return intl.get('txs.cancel_all');
      case 'cutoff_trading_pair':
        return intl.get('txs.cancel_pair_order', {pair: this.tx.content.market});
      default:
        return intl.get('txs.others')
    }
  }
  getSide(){
    if(this.tx.type==='receive'){
      return 'income'
    }
    if(this.tx.type==='send'){
      return 'outcome'
    }
  }
  getConfirmTime(){
    return this.tx.updateTime && commonFm.getFormatTime(toNumber(this.tx.updateTime) * 1e3)
  }
  getCreateTime(){
    return this.tx.createTime && commonFm.getFormattedTime(this.tx.createTime,'YY-MM-DD HH:SS')
  }
  getGas(){
    if(this.tx.status.toLowerCase() === 'pending' && this.tx.gas_price && this.tx.gas_limit){
      return toBig(this.tx.gas_price).times(this.tx.gas_limit).div('1e18').toFixed(8)
    }else{
      return toBig(this.tx.gas_price).times(this.tx.gas_used).div('1e18').toFixed(8)
    }
  }
  getGasPrice(){
    return this.tx.gasPrice && toNumber(this.tx.gasPrice)/(1e9).toString(10)
  }
  getLimit(){
    return this.tx.gas && toNumber(this.tx.gas).toString(10)
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
  return  commonFm.getFormatNum(tokenFm.getAmount(value));
}

