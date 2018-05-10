const namespace = 'modals'
export default {
  namespace,
  state: {
    current:[],
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
    *resetModal({payload},{call, select,put}){
      // TODO
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
      // yield put({type:'currentChange',payload})
      yield put({
        type:'modalChange',
        payload:{
          ...payload,
          visible:false,
        }
      })
    },
    *hideCurrentModal({payload},{call, select,put}){
      const { current } = yield select(({ [namespace]:data }) => data )
      yield put({
        type:'modalChange',
        payload:{
          id:current,
          visible:true,
        }
      })
    },
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
    currentChange(state, { payload }) {
      const { id:current } = payload
      return {
       ...state,
       current:[current,...state.current],
      }
    },
  },
};
