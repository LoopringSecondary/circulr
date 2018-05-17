import {getOrders} from 'LoopringJS/relay/rpc/order'
import config from 'common/config'

export async function fetchList(payload){
    let {page,filters,sort} = payload
    let filter = {}
    if(filters){
      filter = {...filters}
    }
    if(page){
      filter.pageIndex = page.current
      filter.pageSize = page.size
    }
    filter.delegateAddress = config.getDelegateAddress()
    filter.owner = ""
    // filter.owner = window.WALLET && window.WALLET.getAddress()
    return getOrders(filter).then(res=>{
      if(!res.error && res.result.data){
        const orders = res.result.data.filter(order => config.getTokenBySymbol(order.originalOrder.tokenB) && config.getTokenBySymbol(order.originalOrder.tokenB).digits &&
          config.getTokenBySymbol(order.originalOrder.tokenS)&&  config.getTokenBySymbol(order.originalOrder.tokenS).digits &&
          config.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS) && config.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS).pricePrecision);
        return {
          items:orders,
          page:{
            current:res.result.pageIndex,
            size:res.result.pageSize,
            total:res.result.total,
          }
        }
      }else{
        // tmp code because server has no error-code
        return {
          items:[],
          page:{
          }
        }
      }
    })
}

export default {
  fetchList
}

import config from 'common/config'

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

const isArray = (obj)=>{
  return Object.prototype.toString.call(obj) === '[object Array]'
}


    console.log('getOrders req',filter)
    return getOrders(host,filter).then(res=>{
      console.log('getOrders res',res)
      if(!res.error && res.result.data){
        const orders = res.result.data.filter(order => config.getTokenBySymbol(order.originalOrder.tokenB) && config.getTokenBySymbol(order.originalOrder.tokenB).digits &&
          config.getTokenBySymbol(order.originalOrder.tokenS)&&  config.getTokenBySymbol(order.originalOrder.tokenS).digits &&
          config.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS) && config.getMarketBySymbol(order.originalOrder.tokenB,order.originalOrder.tokenS).pricePrecision);
        return {
          items:orders,
          page:{
            current:res.result.pageIndex,
            size:res.result.pageSize,
            total:res.result.total,
          }
        }
      }else{
        // tmp code because server has no error-code
        return {
          items:[],
          page:{
          }
        }
      }
    })

const transfromers = {
  loopring_getFills:{
    res:(payload)=>{
      let {page,filters,sort} = payload
      let filter = {}
      if(filters){
        filter = {...filters}
      }
      if(page){
        filter.pageIndex = page.current
        filter.pageSize = page.size
      }
      filter.delegateAddress = config.getDelegateAddress();
      filter.owner = window.config.address
      const host = window.config.rpc_host
    },
    res:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.data)) {
        items =[ ...res.data.data ]
      }
      updateItems(items,id)
    },
  },
}
const getReqTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].reqTransformer){
    return transfromers[id].req
  }else{
    return ()=>{console.log(id,'no queryTransformer')}
  }
}
const getResTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].resTransformer){
    return transfromers[id].res
  }else{
    return ()=>{console.log(id,'no resTransformer')}
  }
}

const RPCRequest = (payload)=>{
  const reqTransfromer = getReqTransformer(id)
  const resTransfromer = getResTransformer(id)
  return request(reqTransfromer(payload)).then(reqTransfromer)
}
export default {
  RPCRequest
}





