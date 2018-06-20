import io from 'socket.io-client'
import {store} from '../../index.js'
import config from 'common/config'
import {toBig, toFixed} from 'LoopringJS/common/formatter'
import routeActions from 'common/utils/routeActions'
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal';
import storage from '../storage/'

const updateItems = (items,id)=>{
  const dispatch = require('../../index.js').default._store.dispatch
  dispatch({
    type:'sockets/itemsChange',
    payload:{id,items,loading:false}
  })
}
const updateItem = (item,id)=>{
  const dispatch = require('../../index.js').default._store.dispatch
  dispatch({
    type:'sockets/itemChange',
    payload:{id,item,loading:false}
  })
}
const updateEstimateGasPrice = (item,id)=>{
  const dispatch = require('../../index.js').default._store.dispatch
  if(item.value) {
    const gasPrice = toFixed(toBig(item.value).div(1e9))
    dispatch({
      type:'gas/estimateGasChange',
      payload:{gasPrice}
    })
  }
}
const updateStepInPlaceOrderByLoopr = (item,id)=>{
  const dispatch = require('../../index.js').default._store.dispatch
  if(item) {
    switch(item.status) { //init received accept reject
      case 'received':
        dispatch({type:'placeOrderByLoopr/scanned', payload:{hash:item.hash}})
        break;
      case 'accept':
        dispatch({type:'placeOrderByLoopr/submitSuccessfully', payload:{hash:item.hash}})
        break;
      case 'reject':
        dispatch({type:'placeOrderByLoopr/submitFailed', payload:{hash:item.hash}})
        break;
      case 'txFailed':
        dispatch({type:'placeOrderByLoopr/submitFailed', payload:{hash:item.hash}})
        break;
    }
    dispatch({type:'placeOrderByLoopr/generateTimeChange', payload:{generateTime:item.timestamp}})
  }
}
const updateScannedAddress = (item,id)=>{
  if(item && item.owner) {
    const dispatch = require('../../index.js').default._store.dispatch
    dispatch({type:'scanAddress/addressChanged', payload:{address:item.owner}})
    dispatch({type:"wallet/unlockAddressWallet",payload:{address:item.owner}});
    Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
    dispatch({type: 'sockets/unlocked'});
    routeActions.gotoPath('/wallet');
    dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
    dispatch({type:'scanAddress/reset', payload:{}})
  }
}

const isArray = (obj)=>{
  return Object.prototype.toString.call(obj) === '[object Array]'
}

const transfromers = {
  transaction:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload;
      return JSON.stringify({
        owner:storage.wallet.getUnlockedAddress(),
        symbol:filters.token,
        status:filters.status,
        txType:filters.type,
        pageIndex:page.current,
        pageSize:page.size || 10,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.data)) {
        items =[ ...res.data.data ]
      }
      updateItems(items,id)
    },
  },
  latestTransaction:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload;
      return JSON.stringify({
        owner:storage.wallet.getUnlockedAddress(),
        symbol:filters.token,
        status:filters.status,
        txType:filters.type,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data)) {
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  balance:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
         delegateAddress: config.getDelegateAddress(),
         owner:storage.wallet.getUnlockedAddress()
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
     // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  orders:{
    queryTransformer:(payload)=>{
      const {filters} = payload;
      return JSON.stringify({
         delegateAddress: config.getDelegateAddress(),
         owner:storage.wallet.getUnlockedAddress(),
         market:filters.market,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
     // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  estimatedGasPrice:{
    queryTransformer:(payload)=>{
      return ""
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //  console.log(id,'res',res)
      let item = {}
      if (!res.error && res.data ) {
        item.value = res.data
      }
      updateEstimateGasPrice(item,id)
      updateItem(item,id)
    },
  },
  marketcap:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "currency": filters.currency || storage.settings.get().preference.currency,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
    //  console.log(id,'res',res)
      let items =[]
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  depth:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
   // console.log(id,'res',res)
      let item ={}
      if(!res.error && res.data && res.data.depth){
        item ={ ...res.data.depth }
      }
      updateItem(item,id)
    },
  },
  trends:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market,
         "interval":'1Hr',
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
   // console.log(id,'res',res)
      let items = []
      if(!res.error && res.data && isArray(res.data)){
        items = [ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  orderBook:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      let item ={}
      if(!res.error && res.data){
        if(!res.data.sell){ item.sell = [] }else{ item.sell = res.data.sell }
        if(!res.data.buy){ item.buy = [] }else{ item.buy = res.data.buy }
      }
      updateItem(item,id)
    },
  },
  trades:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  tickers:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let item = {}
      if(!res.error && res.data){
        item ={...res.data}
      }
      updateItem(item,id)
    },
  },
  loopringTickers:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        const supportMarket = res.data.filter(item=>config.isSupportedMarket(item.market)) // filter support market
        items =[ ...supportMarket ]
      }
      updateItems(items,id)
    },
  },
  pendingTx:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
         owner:storage.wallet.getUnlockedAddress()
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  circulrNotify:{
    queryTransformer:(payload)=>{
      const {extra} = payload;
      return JSON.stringify({
        owner:storage.wallet.getUnlockedAddress(),
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let item = {}
      if(!res.error && res.data && res.data.body){
        item = {...res.data.body}
      }
      updateItem(item,id)
      // updateStepInPlaceOrderByLoopr(item,id)
    },
  },
  addressUnlock:{
    queryTransformer:(payload)=>{
      const {extra} = payload
      return JSON.stringify({
        "uuid": extra.UUID,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let item = {}
      if(!res.error && res.data){
        item = {...res.data}
      }
      // updateItem(item,id)
      updateScannedAddress(item,id)
    },
  },
  globalTrend:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
        "token":filters.token,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let items = []
      if(!res.error && res.data && isArray(res.data)){
        items = [ ...res.data ]
      }
      updateItems(items,id)
    },
  },
}
const getQueryTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].queryTransformer){
    return transfromers[id].queryTransformer
  }else{
    return ()=>{console.log(id,'no queryTransformer')}
  }
}
const getResTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].resTransformer){
    return transfromers[id].resTransformer
  }else{
    return ()=>{console.log(id,'no resTransformer')}
  }
}

const emitEvent = (payload)=>{
  let {id,socket} = payload
  const transfromer = getQueryTransformer(id)
  socket.emit(`${id}_req`,transfromer(payload))
}
const onEvent = (payload)=>{
  let {id,socket} = payload
  const transfromer = getResTransformer(id)
  socket.on(`${id}_res`,transfromer.bind(this,id))
}

const connect = (payload)=>{
  const {url}= payload
  let options = {
    transports: ['websocket']
  }
  const socket = io(url,options)
  socket.on('disconnect', (data) => {
    console.log('socket disconnect')
  })
  socket.on('error', (err) => {
    console.log('socket error',err)
  })
  return new Promise((resolve,reject)=>{
    socket.on('connect',()=>{
      console.log('socket connect success!')
      resolve(socket)
    })
  })
}
export default {
  onEvent,
  emitEvent,
  connect,
}




