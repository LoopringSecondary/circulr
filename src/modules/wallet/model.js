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
import {mnemonictoPrivatekey} from "LoopringJS/ethereum/mnemonic";
import {formatKey} from "LoopringJS/common/formatter";
import storage from '../storage/'
import intl from 'react-intl-universal';
import Notification from 'LoopringUI/components/Notification'

const unlockWithMetaMask = () => {
  if (window.web3 && window.web3.eth.accounts[0]) {
    window.web3.version.getNetwork((err, netId) => {
      if (netId !== '1') {
        Notification.open({
          message:intl.get('wallet.failed_connect_metamask_title'),
          description:intl.get('wallet.content_metamask_mainnet'),
          type:'error'
        })
        return
      }
      window.WALLET = {address:window.web3.eth.accounts[0], unlockType:'metaMask'};
      window.account = new MetaMaskAccount(window.web3);
      Notification.open({type:'success',message:'解锁成功',description:'unlock'});
    })
  } else {
    let content = intl.get('wallet.content_metamask_install')
    if(window.web3 && !window.web3.eth.accounts[0]) { // locked
      content = intl.get('wallet.content_metamask_locked')
    }
    Notification.open({
      message:intl.get('wallet.failed_connect_metamask_title'),
      description:content,
      type:'error'
    })
  }
}

let unlockedType = storage.wallet.getUnlockedType()
let unlockedAddress = storage.wallet.getUnlockedAddress()
if(unlockedType && unlockedType === 'metaMask' && window.web3 && window.web3.eth.accounts[0] && window.web3.eth.accounts[0] === unlockedAddress) {
  unlockWithMetaMask()
} else {
  if(unlockedAddress) {
    unlockedType = 'address'
    window.WALLET = {address:unlockedAddress, unlockType:unlockedType};
    Notification.open({
      type:'info',
      message:intl.get('wallet.in_watch_only_mode_title'),
      description:intl.get('wallet.unlock_by_cookie_address_notification')
    });
  } else {
    unlockedType = ''
  }
}

export default {
  namespace: 'wallet',
  state: {
    address: unlockedAddress || "",
    unlockType: unlockedType || "locked",
    password: "",
    account: null
  },
  reducers: {
    unlock(state, {payload}) {
      const {address, unlockType, account, password} = payload;
      return {
        ...state,
        address,
        unlockType,
        account,
        password: password || state.password
      }
    },
    lock(state, {payload}) {
      window.WALLET = null;
      return {
        ...state,
        address: "",
        unlockType: "locked",
        password: "",
        account: null
      }
    },
    setPassword(state, {payload}) {
      const {password} = payload;
      return {
        ...state,
        password
      }
    }
  },
  effects: {
    * unlockWallet({payload}, {put, call}) {
      const {address, unlockType} = payload;
      storage.wallet.storeUnlockedAddress(unlockType,address);
      window.WALLET = {address, unlockType};
      //yield call(register, {owner:payload.address});
      yield put({type: 'unlock', payload});
    },
    * unlockAddressWallet({payload}, {put}) {
      const unlockType = 'address';
      yield put({type: 'unlockWallet', payload: {...payload, unlockType}})
    },
    * unlockKeyStoreWallet({payload}, {put}) {
      const {keystore, password, cb} = payload;
      try {
        const account = fromKeystore(keystore, password);
        const address = account.getAddress();
        const unlockType = 'keystore';
        yield put({type: 'unlockWallet', payload: {address, unlockType, account, password}});
        cb()
      } catch (e) {
        cb(e)
      }
    },
    * unlockMnemonicWallet({payload}, {put}) {
      const {mnemonic, dpath, password} = payload;
      const account = fromMnemonic(mnemonic, dpath, password);
      const address = account.getAddress();
      const unlockType = 'mnemonic';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account, password}});
    },
    * unlockPrivateKeyWallet({payload}, {put}) {
      const {privateKey} = payload;
      const account = fromPrivateKey(privateKey);
      const address = account.getAddress();
      const unlockType = 'privateKey';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockMetaMaskWallet({payload}, {put}) {
      const {address} = payload;
      const unlockType = 'metaMask';
      window.account = new MetaMaskAccount(window.web3);
      yield put({type: 'unlockWallet', payload: {address, unlockType}});
    },
    * unlockTrezorWallet({payload}, {put}) {
      const {dpath,address} = payload;
      const account = new TrezorAccount(dpath);
      const unlockType = 'trezor';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * unlockLedgerWallet({payload}, {put}) {
      const {ledger, dpath} = payload;
      const account = new LedgerAccount(ledger, dpath);
      const address = yield account.getAddress();
      const unlockType = 'ledger';
      yield put({type: 'unlockWallet', payload: {address, unlockType, account}});
    },
    * createWallet({payload}, {put}) {
      const {password, cb} = payload;
      const mnemonic = createMnemonic();
      const privateKey = formatKey(mnemonictoPrivatekey(mnemonic, `${path}/0`));
      const account = fromPrivateKey(privateKey);
      const address = account.getAddress();
      const unlockType = 'privateKey';
      yield put({type: "unlockWallet", payload: {address, unlockType, account,password}});
      cb({mnemonic, privateKey, keystore: account.toV3Keystore(password),address});
    }
  }
}
