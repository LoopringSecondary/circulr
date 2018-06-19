import {getOrders} from 'LoopringJS/relay/rpc/order'
import config from 'common/config'
import eachLimit from 'async/eachLimit';
import storage from 'modules/storage/'

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
    filter.delegateAddress = config.getDelegateAddress();
    filter.owner = storage.wallet.getUnlockedAddress()
    const host = window.config && window.config.rpc_host
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
}

export async function signAll(payload) {
  const {signed,unsigned,account,address} = payload
  return await unsigned.map((item, index)=>{
    if(item.address !== address) return null
    const signedItem = signed[index]
    if(signedItem) return signedItem
    if(item.type === 'order') {
      const signedOrder =  account.signOrder(item.data)
      signedOrder.powNonce = 100;
      return {type: 'order', data:signedOrder};
    } else {
      return {type: 'tx', data: account.signEthereumTx(item.data)};
    }
  })
}
