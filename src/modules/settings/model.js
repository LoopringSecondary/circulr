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
  }
}
