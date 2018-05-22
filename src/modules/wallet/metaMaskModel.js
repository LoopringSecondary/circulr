
export default {
  namespace: 'metaMask',
  state: {
    loading: false,
    refreshModalVisible: false,
  },
  reducers: {
    reset(state, {payload}) {
      return {
        loading: false,
        toRefreshModalVisible: false,
      }
    },
    setLoading(state, {payload}) {
      const {loading} = payload;
      return {
        ...state,
        loading
      }
    },
    setRefreshModalVisible(state, {payload}) {
      const {refreshModalVisible} = payload;
      return {
        ...state,
        refreshModalVisible
      }
    },
  }
}
