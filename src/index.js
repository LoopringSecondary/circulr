import '@babel/polyfill'
import dva from 'dva'
import { message } from 'antd'
import './assets/css/index.less'
import {setLocale} from "./common/utils/localeSetting";
import STORAGE from './modules/storage';
import Eth from 'LoopringJS/ethereum/eth';
import Relay from 'LoopringJS/relay/relay';
import {getSupportedToken, getSupportedMarkets} from './init'
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal'
import {configs} from './common/config/data'

const latestVersion = Number(configs.localStorageVersion)
const oldVersion = Number(STORAGE.getLocalStorageVersion())
if(latestVersion > oldVersion) {
  STORAGE.clearLocalStorage()
  STORAGE.setLocalStorageVersion(latestVersion)
}


window.updateData = (data) => {

};

window.STORAGE = STORAGE;
const host = STORAGE.settings.get().relay.selected;

window.ETH = new Eth(`${host}/eth`);
window.RELAY = new Relay(`${host}/rpc/v2`);
setLocale(window.STORAGE.settings.get().preference.language);


// 1. Initialize
const app = dva({
  onError:(err, dispatch) => {message.error(err.message,3)}
})
window.onError= (msg,url,line)=>{message.error(`window.onError ${msg} ${url} ${line}`,null)}
window.config = {}
window.config.address = "0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00";
window.config.host = host
window.config.rpc_host = `${host}/rpc/v2`
// 2. Plugins
// app.use({})

// 3. Model
const models = require('./modules/models').default
models.map(model=>{
  app.model(model)
})

// 4. Router
app.router(require('./router').default)


// 5. Start
app.start('#root')

// STORE is available when current route has rendered
// Becarefull to use STORE in render funtion
// window.STORE = app._store

export const store = app._store

getSupportedToken().then(res=>{
  if(res.result) {
    const tokens = new Array()
    tokens.push({
      "symbol": "ETH",
      "digits": 18,
      "address": "",
      "precision": 6,
    })
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
    store.dispatch({type:'tokens/itemsChange', payload:{items:tokens}})
  }
}).catch(error=> {
  console.log(error)
  Notification.open({
    message:intl.get('notifications.title.init_failed'),
    description:intl.get('notifications.message.failed_fetch_data_from_server'),
    type:'error'
  })
})

getSupportedMarkets().then(res=>{
  if(res.result) {
    const markets = res.result.map(item=>{
      const pair = item.split('-')
      return {
        "tokenx": pair[0],
        "tokeny": pair[1],
        "pricePrecision":8
      }
    })
    STORAGE.settings.setMarketsConfig(markets)
  }
}).catch(error=> {
  console.log(error)
  Notification.open({
    message:intl.get('notifications.title.init_failed'),
    description:intl.get('notifications.message.failed_fetch_data_from_server'),
    type:'error'
  })
})

export default app
