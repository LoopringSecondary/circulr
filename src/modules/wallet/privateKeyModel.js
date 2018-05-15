import validator from 'LoopringJS/ethereum/validator'


export default {
  namespace: "privateKey",
  state: {
    privateKey: '',
    isValid: false
  },

  reducers: {
    setPrivatekey(state, {payload}) {
      const {privateKey} = payload;
      let isValid = false;
      try {
        validator.validate({value: privateKey,type:'ETH_KEY'});
        isValid = true
      } catch (e) {

      }
      return {
        privateKey,
        isValid:true
      }
    },
    reset(state, {payload}) {
      return {
        privateKey: '',
        isValid: false
      }
    }
  }

}
