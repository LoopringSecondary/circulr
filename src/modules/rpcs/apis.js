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
      if (!res.error && res.data && isArray(res.data.data)) {
        items =[ ...res.data.data ]
      }
      updateItems(items,id)
    },
  },
  balance:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
         delegateAddress: config.getDelegateAddress(),
         owner:window.config.address,
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  marketcap:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "currency": filters.currency,
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
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
         "market":filters.market,// TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let item ={}
      if(!res.error && res.data && res.data.depth){
        item ={ ...res.data.depth }
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
      res = JSON.parse(res)
      console.log(id,'res',res)
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
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
      }
      updateItems(items,id)
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
      res = JSON.parse(res)
      console.log(id,'res',res)
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
         owner:window.config.address // TODO
      })
    },
    resTransformer:(id,res)=>{
      res = JSON.parse(res)
      console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
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





