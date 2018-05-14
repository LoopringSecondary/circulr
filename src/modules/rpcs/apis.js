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
