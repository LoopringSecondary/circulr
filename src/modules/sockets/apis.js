import io from 'socket.io-client'
import {store} from '../../index.js'
const config = {
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
      const dispatch = require('../../index.js').default._store.dispatch
      let items = []
      if (!res.error && res.data && res.data.data) {
        items =[ ...res.data.data ]
      }
      dispatch({
        type:'sockets/itemsChange',
        payload:{id,items,loading:false}
      })
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
      const dispatch = require('../../index.js').default._store.dispatch
      let items = []
      if (!res.error && res.data && res.data.tokens) {
        items =[ ...res.data.tokens ]
      }
      dispatch({
        type:'sockets/itemsChange',
        payload:{id,items,loading:false}
      })
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
      const dispatch = require('../../index.js').default._store.dispatch
      let items =[]
      if (!res.error && res.data && res.data.tokens) {
        items =[ ...res.data.tokens ]
      }
      dispatch({
        type:'sockets/itemsChange',
        payload:{id,items,loading:false}
      })
    },
  },
}
const getQueryTransformer = (id)=>{
  if(config[id] && config[id].queryTransformer){
    return config[id].queryTransformer
  }else{
    return ()=>{console.log(id,'no queryTransformer')}
  }
}
const getResTransformer = (id)=>{
  if(config[id] && config[id].resTransformer){
    return config[id].resTransformer
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




