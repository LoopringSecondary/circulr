import React from 'react'
import {Slider, Form,Card} from 'antd'
import Notification from '../../common/loopringui/components/Notification'
import {toBig, toHex,toNumber} from "LoopringJS/common/formatter";
import LoopringUI from 'LoopringUI/components'
import {keccakHash} from "LoopringJS/common/utils";
import {connect} from 'dva';
import intl from 'react-intl-universal'

function Cancel({cancel,wallet,dispatch}) {
  const {tx} = cancel;
  const handleGasPrice = (value) => {
    tx.gasPrice = toHex(toBig(value).times(1e9));
  };

  const chooseWallet = async (walletType) => {
    const hash = keccakHash(JSON.stringify(tx));
    switch (walletType) {
      case 'loopr':
        window.RELAY.order.setTempStore(hash, JSON.stringify({
          tx,
          hash,
          owner: wallet.address
        })).then(res => {
          if (!res.error) {
            dispatch({type: 'signByLoopr/init', payload: {type: 'cancelTx', hash}});
            dispatch({type: 'layers/hideLayer', payload: {id: 'cancel'}});
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
        dispatch({type:'signByMetaMask/setJobs',payload:{jobs:[{raw:tx,type:'cancelTx'}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'cancel'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByMetaMask'}});
        break;
      case 'ledger':
        dispatch({type:'signByLedger/setJobs',payload:{jobs:[{raw:tx,type:'cancelTx'}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'cancel'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByLedger'}});
        break;
      default:
        Notification.open({type: 'warning', message: intl.get('notifications.title.invalid_wallet_type')})
    }
  };

  return (
    <Card title={intl.get('tx_actions.cancel_title')}>
      <div className="zb-b ">
        <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">
        1. {intl.get('actions.change_gas_price')}</div>
        <Form.Item label={intl.get('tx.gas_price')}>
          <Slider defaultValue={toBig(tx.gasPrice).div(1e9).toNumber()}
                  onChange={handleGasPrice}
                  min={toBig(tx.gasPrice).div(1e9).toNumber()}
                  max={99}/>
        </Form.Item>
        <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">
          2. {intl.get('actions.select_wallet')}</div>
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
    wallet: state.wallet
  }
}

export default connect(mapStateToProps)(Cancel)


