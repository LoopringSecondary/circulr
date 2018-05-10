import io from 'socket.io-client'

const balanceHandler = (res)=>{
  return res
}
const balance_req = (payload)=>{
  const event = 'balance_req'
  const options = {
    delegateAddress: '',
    owner:'',
  }
  return new Promise((resolve)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      resolve(balanceHandler(res))
    })
  })
}
const balance_res = ()=>{
  const event = 'balance_res'
  return new Promise((resolve)=>{
    socket.on(event,(res)=>{
      resolve(balanceHandler(res))
    })
  })
}

const marketcapHandler = (res)=>{
  return res
}
const marketcap_req = (payload)=>{
  const event = 'marketcap_req'
  const options = {
    delegateAddress: '',
    owner:'',
  }
  return new Promise((resolve)=>{
    socket.emit(event,JSON.stringify(options),(res)=>{
      resolve(marketcapHandler(res))
    })
  })
}
const marketcap_res = ()=>{
  const event = 'marketcap_res'
  return new Promise((resolve)=>{
    socket.on(event,(res)=>{
      resolve(marketcapHandler(res))
    })
  })
}


const emitEvent = (payload)=>{
  let {id} = payload
  switch (id) {
    case 'assets':
      return balance_req(payload)
      break;
    case 'prices':
      return marketcap_req(payload)
      break;
    default:
      return marketcap_req(payload)
      break
  }
}
export emitEvent

const onEvent = (payload)=>{
  let {id} = payload
  switch (id) {
    case 'assets':
      return balance_res()
      break;
    case 'prices':
      return marketcap_res()
      break;
    default:
      return marketcap_res()
      break
  }
}
export onEvent

const connect = (url)=>{
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
export connect




