import storage from 'modules/storage'
import Eth from 'LoopringJS/ethereum/eth';
import Relay from 'LoopringJS/relay/relay';

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
    tradingChange(state, { payload }) {
      let newState =  {
        ...state,
        trading: {
          ...state.trading,
          ...payload
        }
      };
      storage.settings.set(newState)
      return newState
    },
    relayChange(state,{payload}){
      const {selected} = payload;
      window.ETH = new Eth(`${selected}/eth`);
      window.RELAY = new Relay(`${selected}/rpc/v2`);
      let newState =  {
        ...state,
        relay: {
          ...state.relay,
          selected
        }
      };
      storage.settings.set(newState)
      return newState
    },
  }
}
