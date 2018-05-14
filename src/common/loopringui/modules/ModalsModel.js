const namespace = 'modals'
export default {
  namespace,
  state: {
  },
  effects:{
    *changeModal({payload},{call, select,put}){
      yield put({
        type:'modalChange',
        payload:{
          ...payload,
        }
      })
    },
    *showModal({payload},{call, select,put}){
      // yield put({type:'currentChange',payload})
      yield put({
        type:'modalChange',
        payload:{
          ...payload,
          visible:true,
        }
      })
    },
    *hideModal({payload},{call, select,put}){
      yield put({
        type:'modalChange',
        payload:{
          ...payload,
          visible:false,
        }
      })
      yield put({type:'resetModal',payload})
    },
    *resetModal({payload},{call, select,put}){
      yield put({
        type:'modalChange',
        payload:{
          id:payload.id,
        }
      })
    }
  },
  reducers: {
    modalChange(state, { payload }) {
      const { id:modalId } = payload
      const thisModal = state[modalId]
      delete payload.id
      return {
       ...state,
       [modalId]:{
        ...thisModal,
        ...payload,
       }
      }
    },
  },
};
