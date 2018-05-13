import redux from 'common/redux'
const namespace = 'tabs'
export default {
  namespace,
  state: {
  },
  effects:{
    *init({payload},{call,select,put}){
      yield put({type:'tabChange',payload})
    }
  },
  reducers: {
    activeKeyChange:redux.getReducer,
    tabChange:redux.getReducer,
  }
};
