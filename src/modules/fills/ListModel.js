import * as apis from './apis'
console.log('apis',apis)
const namespace = 'fills'
let initState = {
  items: [],
  loading: false,
  page:{
    total:0,
    size:10,
    current:0,
  },
  sort:{},
  filters:{},
  defaultState:{},
  originQuery:{},
}
export default {
  namespace,
  state: {
    'MyFills':{...initState},
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(location => {
    //     if (location.pathname === `/${namespace}/list`) {
    //       dispatch({type: 'fetch'});
    //     }
    //   });
    // },
  },
  effects: {
    *init({payload},{call, select,put}){
      yield put({type:'fetch',payload});
    },
    *fetch({payload},{call, select,put}){
      yield put({type:'queryChange',payload});
    },
    *pageChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'request',payload});
    },
    *filtersChange({payload},{call, select,put}){
      yield put({type:'filtersChangeStart',payload});
      yield put({type:'request',payload});
    },
    *columnsChange({payload},{call, select,put}){
      // yield put({type:'pageChangeStart',payload});
      // yield put({type:'request'});
    },
    *sortChange({payload},{call, select,put}){
      yield put({type:'sortChangeStart',payload});
      yield put({type:'request',payload});
    },
    *queryChange({payload},{call, select,put}){
      yield put({type:'queryChangeStart',payload});
      yield put({type:'request',payload});
    },
    *request({ payload={} }, { call, select, put }) {
      let {id} = payload
      const {page,filters,sort} = yield select(({ [namespace]:model }) => model[id] );
      let new_payload = {page,filters,sort};
      yield put({type:'loadingChange',payload: {id,loading: true}})
      const res = yield call(apis.fetchList, new_payload);
      if (res) {
        console.log('getFills res',res)
        yield put({type:'loadingChange',payload: {id,loading: false}})
        yield put({
          type: 'requestSuccess',
          payload: {
            id:payload.id,
            ...res
          },
        });
      }
    },
  },
  reducers: {
    pageChangeStart(state,action){
      let {payload} = action
      let {id} = payload
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
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
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
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
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
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
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
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
    requestSuccess(state, action) {
      let {payload} = action
      let {id} = payload
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
        },
      }
    },
    loadingChange(state,action){
      let {payload} = action
      let {id} = payload
      if(!state[id]){
        console.log(`model ${id} not exits`)
        return {...state}
      }
      return {
        ...state,
        [id]:{
          ...state[id],
          ...payload,
        },
      }
    },
  },

};


