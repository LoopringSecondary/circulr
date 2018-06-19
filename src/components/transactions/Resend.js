import React from 'react'
import {connect} from "dva";
import {Button, Slider, Form, Input} from 'antd'
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal'
import {toBig, toHex,toNumber} from "LoopringJS/common/formatter";
import storage from 'modules/storage/'

function Resend({resend}) {
  const {tx} = resend;
  const handleGasPrice = (value) => {
    tx.gasPrice = toHex(toBig(value).times(1e9))
  };
  const resendTx = async () => {
    const account = this.props.account || window.account;
    const signedTx = await account.signEthereumTx(tx);
    window.ETH.sendRawTransaction(signedTx).then((response) => {
      if (!response.error) {
        Notification.open({
          message: intl.get("notifications.title.resend_suc"),
          type: "success",
          description: (<Button className="alert-btn mr5"
                                onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('actions.view_result_etherscan')}</Button> )
        });
        window.RELAY.account.notifyTransactionSubmitted({
          txHash: response.result,
          rawTx: tx,
          from: storage.wallet.getUnlockedAddress()
        });
      } else {
        Notification.open({
          message: intl.get("notifications.title.resend_fail"),
          type: "error",
          description: response.error.message
        })
      }
    })
  }
  return (
    <div>
      <div>{intl.get('tx_resend.title')}</div>
      <Form.Item label={intl.get('tx.to')}>
        <Input disabled value={tx.to}/>
      </Form.Item>
      <Form.Item label={intl.get('tx.value')}>
        <Input disabled value={tx.value}/>
      </Form.Item>
      <Form.Item label={intl.get('tx.nonce')}>
        <Input disabled value={tx.nonce}/>
      </Form.Item>
      <Form.Item label={intl.get('tx.gas_limit')}>
        <Input disabled value={tx.gasLimit}/>
      </Form.Item>
      <Form.Item label={intl.get('tx.data')}>
        <Input disabled value={tx.data}/>
      </Form.Item>
      <Form.Item label={intl.get('tx.gas_price')}>
        <Slider defaultValue={toBig(tx.gasPrice).div(1e9).toNumber()}
                onChange={handleGasPrice}
                min={toBig(tx.gasPrice).div(1e9).toNumber()}
                max={99}
                step={1}/>
      </Form.Item>
      <Button onClick={resendTx} disabled={!tx}>{intl.get('tx_resend.action_resend')}</Button>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    wallet: state.wallet.account
  }
}

export default connect(mapStateToProps)(Resend)
