
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
