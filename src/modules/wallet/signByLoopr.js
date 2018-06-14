import moment from 'moment';


export default {
  namespace: 'signByLoopr',
  state: {
    from:'',
    hash: '',
    type: '',
    validity: 600000,
    expired: false,
  },

  reducers:{
    reset(state,{payload}){
      return {
        from:'',
        hash: '',
        type: '',
        validity: 600,
        expired: false,
      }
    },
    init(state,{payload}){
     const from = moment().valueOf();
      return {
        ...state,
        ...payload,
        from
      }
    },
    setExpired(state,{payload}){
      const {expired} = payload;
      return {
        ...state,
        expired
      }

    }
  }
}
