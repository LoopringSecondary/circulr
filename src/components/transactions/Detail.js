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
  render() {
    const {txDetail} = this.props;
    const item = txDetail.tx;
    const fill = item && item.content && item.content.fill ? JSON.parse(item.content.fill): null;
    const txFm = new TxFm({...item,fill});

    const reSendTx = (txHash) => {
    }
    return (
      <div className="pd-lg">
          <div className="sidebar-header">
              <h3>Transaction Details</h3>
          </div>
          {
            item && fill &&
            <Tabs defaultActiveKey="basic" tabPosition="" animated={true}  className="tabs-dark">
              <Tabs.TabPane className="text-color-dark"  tab={intl.get('txs.tx_detail')} key="basic">
                  <MetaList>
                      <MetaItem label={intl.get('txs.tx_hash')} value={item.txHash} render={renders.txHash}/>
                      <MetaItem label={intl.get('txs.to')} value={txFm.getTo()} render={renders.address}/>
                      <MetaItem label={intl.get('txs.block_num')} value={txFm.getBlockNum()} render={renders.blockNumber}/>
                      <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + item.status)}/>
                      <MetaItem label={intl.get('txs.confirm_time')} value={txFm.getConfirmTime()}/>
                      <MetaItem label={intl.get('txs.type')} value={txFm.getType()}/>
                      <MetaItem label={"Gas"} value={renders.gas(txFm)}/>
                      <MetaItem label={intl.get('wallet.nonce')} value={txFm.getNonce()}/>
                      <MetaItem label={intl.get('txs.value')} value={txFm.getValue() + ' ETH'}/>
                  </MetaList>
              </Tabs.TabPane>
              <Tabs.TabPane  tab={intl.get('orders.fill_detail')} key="fill">
                <MetaList>
                  <MetaItem label={intl.get('txs.fill_buy')} value={txFm.getFilledAmountOfBuy()}/>
                  <MetaItem label={intl.get('txs.fill_sell')} value={txFm.getFilledAmountOfSell()}/>
                  <MetaItem label={intl.get('orders.LrcFee')} value={txFm.getLrcFee()}/>
                  <MetaItem label={intl.get('orders.LrcReward')} value={txFm.getLrcReward()}/>
                  <MetaItem label={intl.get('txs.margin_split')} value={txFm.getMarginSplit()} />
                </MetaList>
              </Tabs.TabPane>
            </Tabs>
          }
          {
            item && !fill &&
              <MetaList>
                  <MetaItem label={intl.get('txs.tx_hash')} value={item.txHash} render={renders.txHash}/>
                  <MetaItem label={intl.get('txs.to')} value={txFm.getTo()} render={renders.address}/>
                  <MetaItem label={intl.get('txs.block_num')} value={txFm.getBlockNum()} render={renders.blockNumber}/>
                  <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + item.status)}/>
                  <MetaItem label={intl.get('txs.confirm_time')} value={txFm.getConfirmTime()}/>
                  <MetaItem label={intl.get('txs.type')} value={txFm.getType()}/>
                  <MetaItem label={"Gas"} value={renders.gas(txFm)}/>
                  <MetaItem label={intl.get('wallet.nonce')} value={txFm.getNonce()}/>
                  <MetaItem label={intl.get('txs.value')} value={txFm.getValue() + ' ETH'}/>
              </MetaList>
          }
      </div>
    )
  }
}

export const renders = {
  txHash: (value) => <a className="text-truncate d-block text-dark" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                          href={`https://etherscan.io/tx/${value}`}>{value}</a>,
  blockNumber: (value) => <a className="text-truncate d-block text-dark" target="_blank"
                               href={`https://etherscan.io/block/${value}`}>{value}</a>,
  address: (value) => <a className="text-truncate d-block text-dark" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                           href={`https://etherscan.io/address/${value}`}>{value}</a>,
  gas:(fm)=>{
    return (
      <div>
        <div className="row justify-content-end">{`${fm.getGas()}  ETH`}</div>
        <div className="row justify-content-end text-mute">{`Gas(${fm.getGasLimit()}) * Gas Price(${fm.getGasPrice()} Gwei)`}</div>
      </div>
    )
  }
}

