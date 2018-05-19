import React from 'react'
import {Card, Spin, Button,Tabs} from 'antd'
import intl from 'react-intl-universal'
import Notification from 'LoopringUI/components/Notification';
import Alert from 'LoopringUI/components/Alert'
import {DetailHeader,MetaList,MetaItem} from 'LoopringUI/components/DetailPage'
import {copyToPasteboard} from 'modules/formatter/common'
import {TxFm} from 'modules/transactions/formatters'
import {getTransactionByhash} from 'LoopringJS/ethereum/eth'

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      tx:{},
      loading:false,
    }
  }
  componentDidMount() {
    // TODO

    const host = window.config.host + '/eth'
    const txHash = "0x46b9ab33d6904718fc2d16ad1a133a35ae23045bb65893eb2c41b0984b78eca7"
    const _this = this
    getTransactionByhash(host,txHash).then(res => {
      console.log('getTransactionByhash tx res',res)
      res = {"jsonrpc":"2.0","id":"0a2aa4e1b3f83ae9","result":{"blockHash":"0x84e5bec550540096ac978a86a9697ee0a4b916b6db192656d4af1f6240964c87","blockNumber":"0x54afb1","from":"0x3acdf3e3d8ec52a768083f718e763727b0210650","gas":"0x7a120","gasPrice":"0x2540be400","hash":"0x46b9ab33d6904718fc2d16ad1a133a35ae23045bb65893eb2c41b0984b78eca7","input":"0xe78aadb20000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000005e00000000000000000000000003acdf3e3d8ec52a768083f718e763727b0210650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000002234c96681e9533fdfd122bacbbc634efbafa0f0000000000000000000000000ef68e7c694f40c8202821edf525de3782458639f000000000000000000000000b94065482ad64d4c2b9252358d746b39e820a582000000000000000000000000e17733cbe1e026fbacb792b80bfbc942940db213000000000000000000000000eba7136a36da0f5e16c6bdbc739c716bb5b65a00000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000b94065482ad64d4c2b9252358d746b39e820a5820000000000000000000000004611089033a549317fb362f5d3cd0ce934bab1d900000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000001e1d1c72d5b97e00000000000000000000000000000000000000000000000000000a6844d0712f50000000000000000000000000000000000000000000000000000000000005aeae076000000000000000000000000000000000000000000000000000000005aec31f6000000000000000000000000000000000000000000000000ff59ee833b3000000000000000000000000000000000000000000000000001e1d1c72d5b97e00000000000000000000000000000000000000000000000000000017fb16d83be0000000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000000000000005aeb28bb000000000000000000000000000000000000000000000000000000005aec7a3b00000000000000000000000000000000000000000000000004fefa17b7240000000000000000000000000000000000000000000000000000017fb16d83be00000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000004bcf1459537778cccc808972a5cf5f5aa6aa817408739d2d04e4d3827ebf1c2fed2e15e19aec4b7426b14d961dbbd87566f3e8cb5932bf20ae0747f36bbbe19ab69e42e052c2db99235ac19808796e4f3142025f6d4d14ffd1e50cafc51077791f801cdbd998bc0da5587e98c24eaec15e268459fafa9efd7bfdb52e2dd4df64900000000000000000000000000000000000000000000000000000000000000047d8698af1e2e5f037ee9aff2e23404a9ea51c4ea9573bb4f40988cf166987b5147f335b449268477159eb3018d211d9a01a61c251811c142063ddd9448bc388d62924c0f0f559098c51214d871ca3196e2ee0834e9fec2cdc6bdf1ff16ea97cc7546b450b383fb04daf01e1bbbf7b4577165c026cdd8ce9b99b5a81f92e20277","nonce":"0x362","to":"0x8d8812b72d1e4ffcec158d25f56748b7d67c1e78","transactionIndex":"0x4b","value":"0x0","v":"0x1b","r":"0xadde5d74ade33d8ed5b388aa082225cce1c3c03b4b24509cc4c2bfce2c38b3ff","s":"0x4c9ca7452d13a0ee91a557d1a0ce468e32df02c1e1b4f34efc951188c2ca3d13"}}
      if (!res.error) {
        const tx = res.result;
        _this.setState({loading: false, tx})
      } else {
        _this.setState({loading: false})
      }
    })
  }
  render() {
    const {modals} = this.props;
    const fill = {} // TODO
    const {loading,tx} = this.state
    const txFm = new TxFm({...tx,fill}) // TODO
    const reSendTx = (txHash) => {
    }
    return (
      <div>
          <DetailHeader title="交易详情" />
          <Tabs defaultActiveKey="basic" tabPosition="" animated={true}  className="tabs-dark">
            <Tabs.TabPane className="text-color-dark"  tab={intl.get('txs.tx_detail')} key="basic">
              <Spin spinning={loading}>
                <MetaList>
                    <MetaItem label={intl.get('txs.tx_hash')} value={tx.txHash} render={renders.txHash}/>
                    <MetaItem label={intl.get('txs.to')} value={tx.to} render={renders.address}/>
                    <MetaItem label={intl.get('txs.block_num')} value={tx.blockNumber} render={renders.blockNumber}/>
                    <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + tx.status)}/>
                    <MetaItem label={intl.get('txs.confirm_time')} value={txFm.getConfirmTime()}/>
                    <MetaItem label={intl.get('txs.type')} value={txFm.getType()}/>
                    <MetaItem label={"Gas"} value={renders.gas(txFm)}/>
                    <MetaItem label={intl.get('wallet.nonce')} value={txFm.getNonce()}/>
                    <MetaItem label={intl.get('txs.value')} value={txFm.getValue() + ' ETH'}/>
                </MetaList>
              </Spin>
            </Tabs.TabPane>
            {
              fill &&
              <Tabs.TabPane  tab={intl.get('orders.fill_detail')} key="fill">
                <MetaList>
                  <MetaItem label={intl.get('txs.fill_buy')} value={txFm.getFilledAmountOfBuy()}/>
                  <MetaItem label={intl.get('txs.fill_sell')} value={txFm.getFilledAmountOfSell()}/>
                  <MetaItem label={intl.get('orders.LrcFee')} value={txFm.getLrcFee()}/>
                  <MetaItem label={intl.get('orders.LrcReward')} value={txFm.getLrcReward()}/>
                  <MetaItem label={intl.get('txs.margin_split')} value={txFm.getMarginSplit()} />
                </MetaList>
              </Tabs.TabPane>
            }
          </Tabs>
      </div>
    )
  }
}

export const renders = {
  txHash: (value) => <a className="text-truncate d-block" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                          href={`https://etherscan.io/tx/${value}`}>{value}</a>,
  blockNumber: (value) => <a className="text-truncate d-block" target="_blank"
                               href={`https://etherscan.io/block/${value}`}>{value}</a>,
  address: (value) => <a className="text-truncate d-block" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                           href={`https://etherscan.io/address/${value}`}>{value}</a>,
  gas:(fm)=>{
    return (
      <div className="mr15">
        <div className="row justify-content-end">{`${fm.getGas()}  ETH`}</div>
        <div className="row justify-content-end fs14 color-black-3">{`Gas(${fm.getGasLimit()}) * Gas Price(${fm.getGasPrice()} Gwei)`}</div>
      </div>
    )
  }
}

