import {register} from "LoopringJS/relay/rpc/account";
import {
  fromKeystore,
  fromPrivateKey,
  fromMnemonic,
  createMnemonic,
  path,
  MetaMaskAccount,
  TrezorAccount,
  LedgerAccount
} from "LoopringJS/ethereum/account";

export default {
  namespace: 'wallet',
  state: {
    address: "",
    unlockType: "locked",
    password: "",
    account: null
  },
  reducers: {
    unlock(state, {payload}) {
      const {address, unlockType, account} = payload;
      return {
        ...state,
        address,
        unlockType,
        account
      }
    },
    lock(state, {payload}) {
      return {
        ...state,
        address: "",
        unlockType: "locked",
        password: "",
        account: null
      }
    }
  },
  effects: {
    * unlockWallet({payload}, {put, call}) {
      yield call(register, payload.address);
      yield put({type: 'unlock', payload});
    },
    * unlockAddressWallet({payload}, {put}) {
      const unlockType = 'address';
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockKeyStoreWallet({payload}, {put}) {
      const {keystore, password} = payload;
      const account = fromKeystore(keystore, password);
      const address = account.getAddress();
      const unlockType = 'keystore';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}})
    },
    * unlockMnemonicWallet({payload}, {put}) {
      const {mnemonic, dpath, password} = payload;
      const account = fromMnemonic(mnemonic, dpath, password);
      const address = account.getAddress();
      const unlockType = 'mnemonic';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockPrivateKeyWallet({payload}, {put}) {
      const {privateKey} = payload;
      const account = fromPrivateKey(privateKey);
      const address = account.getAddress();
      const unlockType = 'privateKey';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockMetaMaskWallet({payload}, {put}) {
      const {web3} = payload;
      const account = new MetaMaskAccount({web3});
      const address = account.getAddress();
      const unlockType = 'metaMask';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockTrezorWallet({payload}, {put}) {
      const {dpath} = payload;
      const account = new TrezorAccount({dpath});
      const address = account.getAddress();
      const unlockType = 'trezor';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockLedgerWallet({payload}, {put}) {
      const {ledger, dpath} = payload;
      const account = new LedgerAccount({ledger, dpath});
      const address = account.getAddress();
      const unlockType = 'ledger';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * createWallet({payload}, {put}) {
      const mnemonic = createMnemonic();
      put({type: "unlockMnemonicWallet", payload: {mnemonic, dpath: path}})
    },
    * signMessage({payload}, {select}) {
      const {account, unlockType} = yield select((state) => state.wallet);
      const {message, cb} = payload;
      if (account) {
        try{
          const sig = yield account.signMessage(message);
          cb({...sig})
        }catch (e){
          cb({error:e})
        }
      } else {
        cb({error: {message: `${unlockType} doesn't support sign message`}})
      }
    },
    * signEthereumTx({payload},{select}){
      const {account, unlockType} = yield select((state) => state.wallet);
      const {tx, cb} = payload;
      if (account) {
        try{
          const signedTx = yield account.signEthereumTx(tx);
          cb({signedTx})
        }catch (e){
          cb({error:e})
        }
      } else {
        cb({error: {message: `${unlockType} doesn't support sign message`}})
      }
    },
    * signOrder({payload},{select}){
      const {account, unlockType} = yield select((state) => state.wallet);
      const {order, cb} = payload;
      if (account) {
        try{
          const order = yield account.signOrder(order);
          cb(order)
        }catch (e){
          cb({error:e})
        }
      } else {
        cb({error: {message: `${unlockType} doesn't support sign message`}})
      }
    }
  }
}
