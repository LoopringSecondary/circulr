
export default {
  namespace: 'scanAddress',
  state: {
    address: '',
    UUID: ''
  },
  effects: {
    * reset({payload}, {call, select, put}) {
      yield put({type: 'addressChanged', payload: {address:''}})
      yield put({type: 'uuidChanged', payload: {UUID:''}})
    }
  },
  reducers: {
    addressChanged(state, {payload}) {
      const {address} = payload;
      return {
        ...state,
        address
      }
    },
    uuidChanged(state, {payload}) {
      const {UUID} = payload;
      return {
        ...state,
        UUID
      }
    },
  }
}
