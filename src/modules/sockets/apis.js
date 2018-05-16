import io from 'socket.io-client'
import {store} from '../../index.js'
import config from 'common/config'

const updateItems = (items,id)=>{
  const dispatch = require('../../index.js').default._store.dispatch
  let items = []
  dispatch({
    type:'sockets/itemsChange',
    payload:{id,items,loading:false}
  })
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

const transfromers = {
  transaction:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
        owner:window.config.address,
        symbol:filters.token,
        status:filters.status,
        txType:filters.txType,
        pageIndex:page.current,
        pageSize:page.size || 10,
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && res.data.data) {
        items =[ ...res.data.data ]
      }
      updateItems(items,id)
    },
  },
  balance:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         delegateAddress: '0x17233e07c67d086464fD408148c3ABB56245FA64',
         owner:window.config.address,
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && res.data.tokens) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  marketcap:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "currency": 'usd',
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if (!res.error && res.data && res.data.tokens) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  depth:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market,// TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && res.data && res.data.depth){
        items =[ ...res.data.depth ]
      }
      updateItems(items,id)
    },
  },
  trades:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && res.data){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  tickers:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && res.data){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  loopringTickers:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && res.data){
        // filter support market
        const supportMarket = res.data.filter(item=>{
          return config.isSupportedMarket(item.market)
        })
        items =[ ...supportMarket ]
      }
      updateItems(items,id)
    },
  },
  pengdingTx:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && res.data){
        items =[ ...res.data ]
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




