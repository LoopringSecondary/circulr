import React from 'react';
import {connect} from 'dva';
import {Card} from 'antd';
import intl from 'react-intl-universal';
import {keccakHash} from 'LoopringJS/common/utils'
import {toHex, toNumber} from "LoopringJS/common/formatter";
import moment from 'moment';
import LoopringUI from 'LoopringUI/components'
import Notification from '../../common/loopringui/components/Notification'
import {MetaMaskAccount} from '../../common/loopringjs/src/ethereum/account'
import storage from 'modules/storage/'

const computeHash = ({type, timestamp, orderHash, tokenS, tokenB}) => {
  switch (type) {
    case 1:
      return keccakHash(JSON.stringify({type, timestamp, orderHash, owner: storage.wallet.getUnlockedAddress()}));
    case 2:
      return keccakHash(JSON.stringify({type, timestamp, owner: storage.wallet.getUnlockedAddress()}));
    case 4:
      return keccakHash(JSON.stringify({
        type,
        tokenS,
        tokenB,
        timestamp,
        owner: storage.wallet.getUnlockedAddress()
      }));
  }
};


function FlexCancelOrder(props) {
  const {type, tokenS, tokenB, orderHash, wallet, market, dispatch} = props;
  const action_title = type === 1 ? intl.get('order_cancel.cancel_title') : intl.get('order_cancel.cancel_all_title', {pair: market || ''});

  const chooseWallet = async (walletType) => {
    const timestamp = Math.floor(moment().valueOf() / 1e3).toString();
    const hash = computeHash({type, timestamp, tokenS, tokenB, orderHash});
    switch (walletType) {
      case 'loopr':
        window.RELAY.order.setTempStore(hash, JSON.stringify({
          type,
          hash,
          timestamp,
          tokenS,
          tokenB,
          orderHash,
          owner: wallet.address
        })).then(res => {
          if (!res.error) {
            dispatch({type: 'signByLoopr/init', payload: {type: 'cancelOrder', hash}});
            dispatch({type: 'layers/hideLayer', payload: {id: 'flexCancelOrder'}});
            dispatch({type: 'layers/showLayer', payload: {id: 'signByLoopr'}});
          } else {
            Notification.open({
              type: 'error',
              message: intl.get('notifications.title.cancel_order_failed'),
              description: res.error.message
            })
          }
        });
        break;
      case 'metamask':
        dispatch({type:'signByMetaMask/setJobs',payload:{jobs:[{raw:{type, tokenS, tokenB, orderHash, market,timestamp,hash},type:'cancelOrder'}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'flexCancelOrder'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByMetaMask'}});
        break;
      case 'ledger':
        dispatch({type:'signByLedger/setJobs',payload:{jobs:[{raw:{type, tokenS, tokenB, orderHash, market,timestamp,hash},type:'cancelOrder'}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'flexCancelOrder'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByLedger'}});
        break;
      default:
        Notification.open({type: 'warning', message: '不存在的钱包类型'})
    }
  };
  return (
    <Card title={intl.get('order_cancel.title')}>
      <div className="zb-b ">
        <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">
          1. {action_title},{intl.get('actions.select_wallet')}</div>
        <div className="row ml0 mr0">
          <div className="col-4 zb-b-r cursor-pointer" onClick={() => chooseWallet('loopr')}>
            <LoopringUI.WalletItem icon="json" title="Loopr Wallet" loading={false}/>
          </div>
          <div className="col-4 zb-b-r cursor-pointer" onClick={() => chooseWallet('metamask')}>
            <LoopringUI.WalletItem icon="metamaskwallet" title="MetaMask"/>
          </div>
          <div className="col-4 cursor-pointer" onClick={() => chooseWallet('ledger')}>
            <LoopringUI.WalletItem icon="ledgerwallet" title="Ledger"/>
          </div>
        </div>
      </div>
    </Card>
  )
}

function mapStateToProps(state) {

  return {
    type: state.flexCancelOrder.type,
    tokenS: state.flexCancelOrder.tokenS,
    tokenB: state.flexCancelOrder.tokenB,
    orderHash: state.flexCancelOrder.orderHash,
    hash: state.flexCancelOrder.hash,
    market: state.flexCancelOrder.market,
    wallet: state.wallet
  }
}

export default connect(mapStateToProps)(FlexCancelOrder)

