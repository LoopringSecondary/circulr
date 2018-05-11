import {isKeystorePassRequired} from "LoopringJS/ethereum/keystore";


export default {
  namespace: 'keystore',
  state: {
    keystore: '',
    isPasswordRequired: false,
    isValid: false,
    password: ''
  },
  reducers: {
    reset(state, {payload}) {
      return {
        keystore: '',
        isPasswordRequired: false,
        isValid: false,
        password: ''
      }
    },
    setKeystore(state, {payload}) {
      const {keystore} = payload;
      let isPasswordRequired = false;
      let isValid;
      try {
        isPasswordRequired = isKeystorePassRequired(keystore);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      return {
        ...state,
        keystore,
        isPasswordRequired,
        isValid,
        password: ''
      }
    },
    setPassword(state, {payload}) {
      const {password} = payload;
      return {
        ...state,
        password
      }
    }
  }
}
