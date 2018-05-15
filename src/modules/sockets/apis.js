import io from 'socket.io-client'
const balanceHandler = (res)=>{
  res = JSON.parse(res)
  if(!res.error && res.data && res.data.tokens){
    return {
      // items:res.data.tokens.filter(token=>configSymbols.includes(token.symbol)) // get intersection of server config & client config
      items:res.data.tokens
    }
  }else{
    return {
      items:[]
    }
  }
}
const balance_req = (payload)=>{
  const {socket} = payload
  const event = 'balance_req'
  const options = {
    delegateAddress: '0x17233e07c67d086464fD408148c3ABB56245FA64',
    owner:window.config.address,
  }
  return new Promise((resolve,reject)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      console.log('api layer -- emit',event)
      resolve(balanceHandler(res))
    })
  })
}
const balance_res = (payload)=>{
  const {socket} = payload
  const event = 'balance_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      console.log('api layer -- on ',event)
      resolve(balanceHandler(res))
    })
  })
}
const marketcapHandler = (res)=>{
  res = JSON.parse(res)
  if (!res.error && res.data && res.data.tokens) {
    return {
      items: res.data.tokens,
    }
  }else{
    return {
      items:[]
    }
  }
}
const marketcap_req = (payload)=>{
  const {socket} = payload
  const event = 'marketcap_req'
  const options = {
    "currency": 'usd',
  }
  return new Promise((resolve,reject)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      console.log('api layer -- emit ',event)
      resolve(marketcapHandler(res))
    })
  })
}
const marketcap_res = (payload)=>{
  const {socket} = payload
  const event = 'marketcap_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      console.log('api layer -- on ',event)
      resolve(marketcapHandler(res))
    })
  })
}

const transactionHandler = (res)=>{
  res = JSON.parse(res)
  const app = require('../../index.js').default
  if (!res.error && res.data && res.data.data) {
     const newRes = {
      id:'transaction',
      items: [...res.data.data],
      page:{
        total:res.data.total,
        current:res.data.pageIndex,
        size:res.data.pageSize,
      }
    }
    app._store.dispatch({
      type:'sockets/itemsChange',
      payload:{...newRes}
    })
  }else{
    const newRes = {
      id:'transaction',
      items:[],
      page:{}
    }
    app._store.dispatch({
      type:'sockets/itemsChange',
      payload:{...newRes}
    })
  }
}

const transaction_req = (payload)=>{
  const {socket,filters,page,id} = payload
  const event = 'transaction_req'
  const options = {
    owner:window.config.address,
    symbol:filters.token,
    status:filters.status,
    txType:filters.txType,
    pageIndex:page.current,
    pageSize:page.size || 10,
  }
  return new Promise((resolve,reject)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      console.log('api layer -- emit ',event)
      resolve(transactionHandler(res))
    })
  })
}
const transaction_res = (payload)=>{
  const {socket,id} = payload
  const event = 'transaction_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      console.log('api layer -- on ',event)
      resolve(transactionHandler(res,id))
    })
  })
}

const emitEvent = (payload)=>{
  let {id} = payload
  switch (id) {
    case 'balance':
      return balance_req(payload)
      break
    case 'marketcap':
      return marketcap_req(payload)
      break
    case 'transaction':
      return transaction_req(payload)
      break
    default:
      break
  }
}

const onEvent = (payload)=>{
  let {id} = payload
  switch (id) {
    case 'balance':
      return balance_res(payload)
      break;
    case 'marketcap':
      return marketcap_res(payload)
      break;
    case 'transaction':
      return transaction_res(payload)
      break;
    default:
      break
  }
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
const responseHandler = (res,id)=>{
  switch (id) {
    case 'balance':
      return balanceHandler(res)
      break;
    case 'marketcap':
      return marketcapHandler(res)
      break;
    case 'transaction':
      return transactionHandler(res)
      break;
    default:
      break
  }
}
export default {
  responseHandler,
  onEvent,
  emitEvent,
  connect,
}




