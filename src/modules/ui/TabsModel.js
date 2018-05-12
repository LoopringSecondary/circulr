const namespace = 'tabs'
export default {
  namespace,
  state: {
  },
  effects:{
    *initStateChange({payload},{call,select,put}){
      console.log('tabs initStateChange')
      yield put({type:'tabChange',payload})
    }
  },
  reducers: {
    activeKeyChange(state, { payload }) {
      const { id } = payload
      const data = state[id] || {}
      delete payload.id
      return {
       ...state,
       [id]:{
        ...data,
        ...payload,
       }
      }
    },
    tabChange(state, { payload }) {
      const { id } = payload
      const data = state[id] || {}
      delete payload.id
      return {
       ...state,
       [id]:{
        ...data,
        ...payload,
       }
      }
    },
  },
};
