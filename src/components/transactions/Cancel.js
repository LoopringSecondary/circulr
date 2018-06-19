import React from 'react'
import {connect} from "dva";
import {Button, Slider, Form} from 'antd'
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal'
import {toBig, toHex,toNumber} from "LoopringJS/common/formatter";
import storage from 'modules/storage/'

function Cancel({cancel}) {
  const {tx} = cancel;
  const handleGasPrice = (value) => {
    tx.gasPrice = toHex(toBig(value).times(1e9))
    console.log(tx.gasPrice);
  };
  const cancelTx = async () => {
    const account = this.props.account || window.account;
    const signedTx = await account.signEthereumTx(tx);
    window.ETH.sendRawTransaction(signedTx).then((response) => {
      if (!response.error) {
        Notification.open({
          message: intl.get("notifications.title.cancel_suc"),
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
          message: intl.get("notifications.title.cancel_fail"),
          type: "error",
          description: response.error.message
        })
      }
    })
  }


  return (
    <div>
    <Form.Item label={intl.get('tx.gas_price')}>
      <Slider defaultValue={toBig(tx.gasPrice).div(1e9).toNumber()}
              onChange={handleGasPrice}
              min={toBig(tx.gasPrice).div(1e9).toNumber()}
              max={99}/>
    </Form.Item>
      <Button onClick={cancelTx} disabled={!tx}>{intl.get('actions.cancel_tx')}</Button>
    </div>
  )
}
function mapStateToProps(state) {
  return {
    wallet: state.wallet.account
  }
}

export default connect(mapStateToProps)(Cancel)


