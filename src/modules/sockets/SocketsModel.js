import apis from './apis'
import STORAGE from 'modules/storage';

const namespace = 'sockets'
let initState = {
  items: [],
  item: {},
  loading: true,
  loaded: false,
  page:{
    total:0,
    size:10,
    current:0,
  },
  sort:{},
  filters:{},
  extra:{},
}
export default {
  namespace,
  state: {
    'url':STORAGE.settings.get().relay.selected,
    'socket':null,
    'transaction':{...initState,filters:{token:'LRC'}},
    'latestTransaction':{...initState,filters:{token:'LRC'}},
    'balance':{...initState,filters:{currency:'usd'}},
    'marketcap':{...initState},
    'orderBook':{...initState,filters:{market:'LRC-WETH'},item:{sell:[],buy:[]}},
    'depth':{...initState,filters:{market:'LRC-WETH'},item:{sell:[],buy:[]}},
    'trades':{...initState,filters:{market:'LRC-WETH'}},
    'tickers':{...initState,filters:{market:'LRC-WETH'}},
    'trends':{...initState,filters:{market:'LRC-WETH'}},
    'orders':{...initState,filters:{market:'LRC-WETH'}},
    'estimatedGasPrice':{...initState,filters:{}},
    'loopringTickers':{...initState},
    'pendingTx':{...initState},
    'circulrNotify':{...initState},
    'addressUnlock':{...initState},
    'globalTrend':{...initState,filters:{token:'LRC'}}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname,search})=> {
        if (pathname.indexOf('/trade/')>-1) {
          const market = pathname.replace('/trade/','')
          dispatch({
            type:'orders/filtersChange',
            payload:{
              id:'MyOpenOrders',
              filters:{market,status:'ORDER_OPENED'}
            }
          })
          dispatch({
            type:'fills/filtersChange',
            payload:{
              id:'MyFills',
              filters:{market}
            }
          })
          dispatch({
            type:'placeOrder/pairChangeEffects',
            payload:{
              pair:market
            }
          })
          dispatch({
            type:'marketChange',
            payload:{market}
          })
        }
      })
    },
  },
  effects: {
    *marketChange({payload},{call,select,put}){
      const {market}=payload
      yield put({
        type:'filtersChange',
        payload:{
          id:'tickers',
          filters:{market:market}
        }
      })
      yield put({
        type:'filtersChange',
        payload:{
          id:'depth',
          filters:{market:market}
        }
      })
      yield put({
        type:'filtersChange',
        payload:{
          id:'orderBook',
          filters:{market:market}
        }
      })
      yield put({
        type:'filtersChange',
        payload:{
          id:'trends',
          filters:{market:market}
        }
      })
      yield put({
        type:'filtersChange',
        payload:{
          id:'trades',
          filters:{market:market}
        }
      })
    },
    *tokenChange({payload},{call,select,put}){
      const {token} = payload
      if(token) {
        if(token === 'ETH') {
          yield put({type:'filtersChange', payload:{id:'globalTrend', filters:{token:'WETH'}}})
        } else {
          yield put({type:'filtersChange', payload:{id:'globalTrend', filters:{token}}})
        }
      }
      yield put({type:'filtersChange', payload:{id:'latestTransaction', filters:{token}}})
      //TODO all other token change dispatch
    },
    *urlChange({payload},{call,select,put}){
      yield put({type:'urlChangeStart',payload})
      yield put({type:'connect',payload})
    },
    *connect({payload},{call,select,put}){
      const {url} = yield select(({ [namespace]:model }) => model )
      const socket = yield call(apis.connect, {url})
      yield put({type:'socketChange',payload:{socket}})
      yield put({type:'fetch',payload:{id:'marketcap'}})
      yield put({type:'fetch',payload:{id:'depth'}})
      yield put({type:'fetch',payload:{id:'trends'}})
      yield put({type:'fetch',payload:{id:'trades'}})
      yield put({type:'fetch',payload:{id:'tickers'}})
      yield put({type:'fetch',payload:{id:'loopringTickers'}})
      yield put({type:'fetch',payload:{id:'orderBook'}})
      yield put({type:'fetch',payload:{id:'estimatedGasPrice'}})
      yield put({type:'fetch',payload:{id:'globalTrend'}})
      if(STORAGE.wallet.getUnlockedAddress()){
        yield put({type:'unlocked'})
      }
    },
    *unlocked({payload},{call,select,put}){
      yield put({type:'fetch',payload:{id:'transaction'}})
      yield put({type:'fetch',payload:{id:'latestTransaction'}})
      yield put({type:'fetch',payload:{id:'balance'}})
      yield put({type:'fetch',payload:{id:'pendingTx'}})
      yield put({type:'fetch',payload:{id:'orders'}})
      yield put({type:'fetch',payload:{id:'circulrNotify'}})
    },
    *fetch({payload},{call,select,put}){
      yield put({type:'onEvent',payload})
      yield put({type:'emitEvent',payload})
    },
    *pageChange({payload},{call,select,put}){
      yield put({type:'pageChangeStart',payload})
      yield put({type:'emitEvent',payload})
    },
    *filtersChange({payload},{call,select,put}){
      console.log('filtersChange:',payload)
      yield put({type:'filtersChangeStart',payload})
      yield put({type:'emitEvent',payload})
    },

    *sortChange({payload},{call,select,put}){
      yield put({type:'sortChangeStart',payload})
      yield put({type:'emitEvent',payload})
    },
    *queryChange({payload},{call,select,put}){
      yield put({type:'queryChangeStart',payload})
      yield put({type:'emitEvent',payload})
    },
    *emitEvent({ payload={} },{call,select,put}) {
      let {id} = payload
      // todo idValidator
      const {socket,[id]:{page,filters,sort,extra}} = yield select(({ [namespace]:model }) => model )
      console.log('filtersChange emitEvent',id,filters,extra)
      if(socket){
        let new_payload = {page,filters,sort,socket,id,extra}
        yield call(apis.emitEvent, new_payload)
      }else{
        console.log('socket is not connected!')
      }
    },
    *onEvent({ payload={} }, { call, select, put }) {
      let {id} = payload
      // todo idValidator
      const {socket,[id]:{page,filters,sort,extra}} = yield select(({ [namespace]:model }) => model )
      if(socket){
        let new_payload = {page,filters,sort,socket,id,extra}
        yield call(apis.onEvent, new_payload)
      }else{
        console.log('socket is not connected!')
      }
    },
  },
  reducers: {
    urlChangeStart(state, action){
      let {payload} = action
      return {
        ...state,
        ...payload
      }
    },
    socketChange(state, action){
      let {payload} = action
      return {
        ...state,
        ...payload
      }
    },
    loadingChange(state, action) {
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
        },
      }
    },
    itemsChange(state, action) {
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
        },
      }
    },
    itemChange(state, action) {
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
          item:{
            ...state[id].item,
            ...payload.item
          }
        },
      }
    },

    pageChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          page:{
            ...state[id].page,
            ...payload.page
          }
        }
      }
    },
    filtersChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          filters:{
            ...state[id].filters,
            ...payload.filters,
          },
          page:{
            ...state[id].page,
            current:1,
          }
        }
      }
    },
    sortChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          sort:{
            ...payload.sort
          }
        }
      }
    },
    queryChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          filters:{
            ...state[id].filters,
            ...payload.filters,
          },
          page:{
            ...state[id].page,
            current:1,
          },
          sort:{
            ...payload.sort
          },

        }
      }
    },
    extraChange(state,action){
      let {payload} = action;
      let {id} = payload
      return {
        ...state,
        [id]:{
          ...state[id],
          extra:{
            ...state[id].extra,
            ...payload.extra
          }
        }
      }
    },
  },


}


