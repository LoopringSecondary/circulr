import * as apis from './apis'
const namespace = 'socket'
export default {
  namespace,
  state: {
    url:'',
    socket:null,
  },
  effects: {
    *urlChange({payload},{call, select,put}){
      const socket = yield call(apis.connect, payload)
      yield put({type:'socketChange',{
        socket,
        url:payload.url,
      }})
    }
  },
  reducers: {
    socketChange(state, action){
      let {payload} = action
      return {
        ...state,
        ...payload
      }
    }
  }
}


