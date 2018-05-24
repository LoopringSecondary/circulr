import {configs} from 'common/config/data'
import UserAgent from 'common/utils/useragent'

const set = (settings)=>{
  localStorage.settings = JSON.stringify(settings)
}
const latestContract = configs.contracts[configs.contracts.length-1]
const relays = configs.relays
let sortedRelays = relays.map((item, i) => {
  item.id = i;
  return item
})
const get = ()=>{
  if(localStorage.settings){
     return JSON.parse(localStorage.settings)
  }else{
    const userAgent = new UserAgent();
    return {
      preference: {
        language: userAgent.getLanguage() || 'en-US',
        currency: userAgent.getLanguage() === 'zh-CN' ? 'CNY':"USD",
        timezone: "UTC+00:00"
      },
      trading: {
        contract: {
          version: latestContract.version,
          address: latestContract.address
        },
        timeToLive: configs.defaultExpireTime,
        timeToLiveUnit: configs.defaultExpireTimeUnit,
        lrcFee: configs.defaultLrcFeePermillage,
        marginSplit: configs.defaultMarginSplitPercentage,
        gasPrice: configs.defaultGasPrice
      },
      relay: {
        selected: sortedRelays[0].value,
        nodes: sortedRelays
      }
    }
  }
}
const getRelay = ()=>{
  const defaultHost = sortedRelays[0].value
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.relay.selected || defaultHost
  }else{
    return defaultHost
  }
}
const getContractVersion = ()=>{
  const defaultVersion = latestContract.version
  if(localStorage.settings){
     const settings = JSON.parse(localStorage.settings)
     return settings.trading.contract.version || defaultVersion
  }else{
    return defaultVersion
  }
}

const setGas = (gas)=>{
  localStorage.gas = JSON.stringify(gas)
}

const getGas = ()=>{
  if(localStorage.gas){
    return JSON.parse(localStorage.gas)
  }else{
    return {
      gasPrice:{
        last:0,
        estimate:configs.defaultGasPrice,
        selected:configs.defaultGasPrice,
      },
      gasLimit:configs.defaultGasLimit
    }
  }
}

export default {
  set,
  get,
  setGas,
  getGas,
  getRelay,
  getContractVersion,
}

