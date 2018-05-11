import apis from './apis'
const namespace = 'rpcs'
let initState = {
  items: [],
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
    'orders':{...initState},
    'prices':{...initState},
  },
  effects: {
    *init({payload},{call,select,put}){
      yield put({type:'queryChange',payload})
    },
    *pageChange({payload},{call,select,put}){
      yield put({type:'pageChangeStart',payload})
      yield put({type:'fetch',payload})
    },
    *filtersChange({payload},{call,select,put}){
      yield put({type:'filtersChangeStart',payload})
      yield put({type:'fetch',payload})
    },
    *sortChange({payload},{call,select,put}){
      yield put({type:'sortChangeStart',payload})
      yield put({type:'fetch',payload})
    },
    *queryChange({payload},{call,select,put}){
      yield put({type:'queryChangeStart',payload})
      yield put({type:'fetch',payload})
    },
    *fetch({ payload={} },{call,select,put}) {
      let {id} = payload
      const {socket,[id]:{page,filters,sort}} = yield select(({ [namespace]:model }) => model )
      if(socket){
        let new_payload = {page,filters,sort,socket,id}
        yield put({type:'loadingChange',payload: {loading: true,loaded:false}})
        const res = yield call(apis.emitEvent, new_payload)
        if (res && res.items) {
          yield put({type:'loadingChange',payload: {loading: false,loaded:true}})
          yield put({type:'itemsChange',payload: {items:res.items}})
        }
      }else{
        console.log('socket is not connected!')
      }
    },
  },
  reducers: {
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


