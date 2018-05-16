import apis from './apis'
const namespace = 'sockets'
let initState = {
  items: [],
  item: {},
  loading: false,
  loaded: false,
  page:{
    total:0,
    size:10,
    current:0,
  },
  sort:{},
  filters:{},
}
export default {
  namespace,
  state: {
    'url':'//relay1.loopring.io',
    'socket':null,
    'transaction':{...initState,filters:{token:'LRC'}},
    'balance':{...initState,filters:{currency:'usd'}},
    'marketcap':{...initState},
    'depth':{...initState,filters:{market:'LRC-WETH'},item:{sell:[],buy:[]}},
    'trades':{...initState,filters:{market:'LRC-WETH'}},
    'tickers':{...initState,filters:{market:'LRC-WETH'}},
    'loopringTickers':{...initState},
    'pendingTx':{...initState},
  },
  effects: {
    *urlChange({payload},{call,select,put}){
      yield put({type:'urlChangeStart',payload})
      yield put({type:'connect',payload})
    },
    *connect({payload},{call,select,put}){
      const {url} = yield select(({ [namespace]:model }) => model )
      const socket = yield call(apis.connect, {url})
      yield put({type:'socketChange',payload:{socket}})
      yield put({type:'fetch',payload:{id:'marketcap'}})
      yield put({type:'fetch',payload:{id:'transaction'}})
      yield put({type:'fetch',payload:{id:'balance'}})
      yield put({type:'fetch',payload:{id:'depth'}})
      yield put({type:'fetch',payload:{id:'trades'}})
      yield put({type:'fetch',payload:{id:'tickers'}})
      yield put({type:'fetch',payload:{id:'loopringTickers'}})
      yield put({type:'fetch',payload:{id:'pendingTx'}})
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
      const {socket,[id]:{page,filters,sort}} = yield select(({ [namespace]:model }) => model )
      if(socket){
        let new_payload = {page,filters,sort,socket,id}
        yield put({type:'loadingChange',payload: {id,loading: true,loaded:false}})
        yield call(apis.emitEvent, new_payload)
      }else{
        console.log('socket is not connected!')
      }
    },
    *onEvent({ payload={} }, { call, select, put }) {
      let {id} = payload
      // todo idValidator
      const {socket,[id]:{page,filters,sort}} = yield select(({ [namespace]:model }) => model )
      if(socket){
        let new_payload = {page,filters,sort,socket,id}
        put({type:'loadingChange',payload: {id,loading: true,loaded:false}})
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
            // ...state[id].sort,
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
            // ...state[id].sort,
            ...payload.sort
          },

        }
      }
    },
  },

}


