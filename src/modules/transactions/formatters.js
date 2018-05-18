import {toBig, toNumber,toFixed} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal'

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
