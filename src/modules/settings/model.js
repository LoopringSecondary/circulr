import storage from 'modules/storage'

const namespace = 'settings'

export default {
  namespace,
  state: {
    ...storage.settings.get()
  },
  effects:{
  },
  reducers: {
    preferenceChange(state, { payload }) {
      let newState =  {
        ...state,
        preference: {
          ...state.preference,
          ...payload
        }
      };
      storage.settings.set(newState)
      return newState
    },
  }
}
