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
  return new Promise((resolve)=>{
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
  return new Promise((resolve)=>{
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
  console.log(event)
  return new Promise((resolve)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      console.log(event,res)
      res = JSON.parse(res)
      resolve(marketcapHandler(res))
    })
  })
}
const marketcap_res = (payload)=>{
  const {socket} = payload
  const event = 'marketcap_res'
  return new Promise((resolve)=>{
    socket.on(event,(res)=>{
      res = JSON.parse(res)
      console.log(event,res)
      resolve(marketcapHandler(res))
    })
  })
}


const emitEvent = (payload)=>{
  let {id} = payload
  console.log('emitEvent',id)
  switch (id) {
    case 'assets':
      return balance_req(payload).then(res=>res)
      break;
    case 'prices':
      // return marketcap_req(payload).then(res=>res)
      return new Promise((resolve)=>{
        marketcap_req(payload).then(res=>resolve(res))
      })
      break
    // default:
    //   res = marketcap_req(payload)
    //   break
  }


}

const onEvent = (payload)=>{
  let {id} = payload
  let res
  switch (id) {
    case 'assets':
      return balance_res()
      break;
    case 'prices':
      res = marketcap_res()
      break;
    default:
      res = marketcap_res()
      break
  }
  return res
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
  // balance_req()
  // balance_res()
  return new Promise((resolve)=>{
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




