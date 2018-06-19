import STORAGE from './modules/storage';
import request, {id} from 'LoopringJS/common/request';
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal'

const host = STORAGE.settings.get().relay.selected;
if(host) {
  let body = {};
  body.method = 'loopring_getLooprSupportedTokens';
  body.params = [{}];
  body.id = id();
  body.jsonrpc = '2.0';
  request(host, {
    method: 'post',
    body
  }).then(res=>{
    const tokens = new Array()
    res.result.forEach(item=>{
      if(!item.deny) {
        const digit = Math.log10(item.decimals)
        tokens.push({
          "symbol": item.symbol,
          "digits": digit,
          "address": item.protocol,
          "precision": Math.min(digit, 6),
        })
      }
    })
    STORAGE.settings.setTokensConfig(tokens)
  }).catch(error=> {
    console.log(error)
    Notification.open({
      message:intl.get('notifications.title.init_failed'),
      description:intl.get('notifications.message.failed_fetch_data_from_server'),
      type:'error'
    })
  })
}

