const namespace = 'tabs'
export default {
  namespace,
  state: {
  },
  effects:{
  },
  reducers: {
    tabChange(state, { payload }) {
      const { id } = payload
      const data = state[id]
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
