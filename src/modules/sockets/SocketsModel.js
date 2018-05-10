import * as apis from './apis'
const namespace = 'sockets'
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
    'assets':{...initState},
    'prices':{...initState},
  },
  effects: {
    *pageChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *columnsChange({payload},{call, select,put}){
      // yield put({type:'pageChangeStart',payload});
      // yield put({type:'fetch'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      yield put({type:'fetch',payload});
    },
    *emitEvent({ payload={} }, { call, select, put }) {
      let {id} = payload
      const {page,filters,sort} = yield select(({ [namespace]:model }) => model[id] )
      let new_payload = {page,filters,sort}
      const res = yield call(apis.emitEvent, new_payload);
      if (res.items) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            id:payload.id,
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
            loaded:true
          },
        });
      }
    },
    *onEvent({ payload={} }, { call, select, put }) {
      let {id} = payload
      const {page,filters,sort} = yield select(({ [namespace]:model }) => model[id] )
      let new_payload = {page,filters,sort}
      const res = yield call(apis.onEvent, new_payload);
      if (res.items) {
        yield put({
          type: 'fetchSuccess',
          payload: {
            id:payload.id,
            page:{
              ...page,
              ...res.page,
            },
            items:res.items,
            loading: false,
            loaded:true
          },
        });
      }
    },
  },

  reducers: {
    fetchStart(state, action) {
      let {payload} = action
      let {id} = payload
      return {
        ...state,
        [id]:{
          loading: true, loaded:false,
          ...state[id],
        }
      }

    },
    fetchSuccess(state, action) {
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

};


