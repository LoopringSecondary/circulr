import * as apis from './apis'
const namespace = 'socket'
export default {
  namespace,
  state: {
    socket:null,
  },
  effects: {
    *urlChange({payload},{call, select,put}){
      yield put({type:'pageChangeStart',payload});
      yield put({type:'fetch',payload});
    }
  },
  reducers: {
    socketChange(){
      // TODO
    }
  }
}


