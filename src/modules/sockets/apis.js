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
  let res
  switch (id) {
    case 'assets':
      res = balance_req(payload)
      break;
    case 'prices':
      res = marketcap_req(payload)
      break;
    default:
      res = marketcap_req(payload)
      break
  }
  return res
}

const onEvent = (payload)=>{
  let {id} = payload
  let res
  switch (id) {
    case 'assets':
      res = balance_res()
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
export default {
  onEvent,
  emitEvent,
  connect,
}




