import React from 'react';
import {connect} from 'dva';
import intl from 'react-intl-universal';
import {Card} from 'antd'
import {keccakHash} from "LoopringJS/common/utils";
import {MetaMaskAccount} from "LoopringJS/ethereum/account";
import LoopringUI from 'LoopringUI/components'

function ConvertConfirm(props) {
  const {token, amount,tx,wallet,dispatch} = props;
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
            dispatch({type: 'signByLoopr/init', payload: {type: 'convert', hash}});
            dispatch({type: 'layers/hideLayer', payload: {id: 'convertConfirm'}});
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
        dispatch({type:'signByMetaMask/setJobs',payload:{jobs:[{raw:tx,type:'convert',token}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'convertConfirm'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByMetaMask'}});
        break;
      case 'ledger':
        dispatch({type:'signByLedger/setJobs',payload:{jobs:[{raw:tx,type:'convert',token}]}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'convertConfirm'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'signByLedger'}});
        break;
      default:
        Notification.open({type: 'warning', message: '不存在的钱包类型'})
    }
  };
  return (
    <Card
      title={token && token.toLowerCase() === 'eth' ? intl.get('convert.convert_eth_title') : intl.get('convert.convert_weth_title')}>
      <div className="zb-b ">
        <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">
          1. {token && token.toLowerCase() === 'eth' ? intl.get('tx_list.type.convert_eth', {value: amount}) : intl.get('tx_list.type.convert_eth', {value: amount})},{intl.get('actions.select_wallet')}</div>
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
    wallet : state.wallet,
    token:state.convertConfirm.token,
    amount:state.convertConfirm.amount,
    tx:state.convertConfirm.tx
  }
}

export default connect(mapStateToProps)(ConvertConfirm)
