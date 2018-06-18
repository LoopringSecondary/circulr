export default {
  namespace: 'convertConfirm',
  state: {
    tx: '',
    token: '',
    amount: ''
  },
  reducers: {
    reset(state,{payload}) {
      return{
        tx: '',
        token: '',
        amount: ''
      }
    },
    init(state,{payload}){
      const {tx,token,amount} = payload;
      return {
        tx,
        token,
        amount
      }
    }
  }
}
