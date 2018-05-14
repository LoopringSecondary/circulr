import io from 'socket.io-client'

const balanceHandler = (res)=>{
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
    delegateAddress: '',
    owner:'',
  }
  return new Promise((resolve,reject)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      res = JSON.parse(res)
      console.log(event,res)
      resolve(balanceHandler(res))
    })
  })
}
const balance_res = (payload)=>{
  const {socket} = payload
  const event = 'balance_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      res = JSON.parse(res)
      console.log(event,res)
      resolve(balanceHandler(res))
    })
  })
}
const marketcapHandler = (res)=>{
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
      res = JSON.parse(res)
      console.log(event,res)
      resolve(marketcapHandler(res))
    })
  })
}
const marketcap_res = (payload)=>{
  const {socket} = payload
  const event = 'marketcap_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      res = JSON.parse(res)
      console.log(event,res)
      resolve(marketcapHandler(res))
    })
  })
}

const transactionHandler = (res,id)=>{
  if (!res.error && res.data && res.data.data) {
    return {
      id,
      items: [...res.data.data],
      page:{
        total:res.data.total,
        current:res.data.pageIndex,
        size:res.data.pageSize,
      }
    }
  }else{
    return {
      id,
      items:[],
      page:{}
    }
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
      res = JSON.parse(res)
      console.log(event,res)
      resolve(transactionHandler(res,id))
    })
  })
}
const transaction_res = (payload)=>{
  const {socket,id} = payload
  const event = 'transaction_res'
  return new Promise((resolve,reject)=>{
    socket.on(event,(res)=>{
      res = JSON.parse(res)
      console.log(event,res)
      resolve(transactionHandler(res,id))
    })
  })
}


const emitEvent = (payload)=>{
  let {id} = payload
  let promise = null
  switch (id) {
    case 'assets':
      promise =  balance_req(payload)
      break
    case 'prices':
      promise =  marketcap_req(payload)
      break
    case 'transactions':
      promise =  transaction_req(payload)
      break
    default:
      break
  }
  return promise
}

const onEvent = (payload)=>{
  let {id} = payload
  let promise = null
  switch (id) {
    case 'assets':
      promise =  balance_res(payload)
      break;
    case 'prices':
      promise =  marketcap_res(payload)
      break;
    case 'transactions':
      promise =  transaction_res(payload)
      break;
    default:
      break
  }
  return promise
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




