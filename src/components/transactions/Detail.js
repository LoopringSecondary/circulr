import React from 'react'
import {Tabs} from 'antd'
import intl from 'react-intl-universal'
import {DetailHeader, MetaItem, MetaList} from 'LoopringUI/components/DetailPage'
import {copyToPasteboard} from 'modules/formatter/common'
import {TxFm} from 'modules/transactions/formatters'
import {getTransactionByhash} from 'LoopringJS/ethereum/eth'

export default class Detail extends React.Component {
  render() {
    const {txDetail} = this.props;
    const item = txDetail.tx;
    const fill = item && item.content && item.content.fill ? JSON.parse(item.content.fill): null;
    const txFm = new TxFm({...item,fill});
    return (
      <div className="pd-lg">
          <div className="sidebar-header">
              <h3>{intl.get('tx_detail.detail_title')}</h3>
          </div>
          {
            item && fill &&
            <Tabs defaultActiveKey="basic" tabPosition="" animated={true}  className="tabs-dark">
              <Tabs.TabPane className="text-color-dark"  tab={intl.get('tx_detail.tabs_basic')} key="basic">
                  <MetaList>
                      <MetaItem label={intl.get('tx.txHash')} value={item.txHash} render={renders.txHash}/>
                      <MetaItem label={intl.get('tx.to')} value={txFm.getTo()} render={renders.address}/>
                      <MetaItem label={intl.get('tx.block')} value={txFm.getBlockNum()} render={renders.blockNumber}/>
                      <MetaItem label={intl.get('tx.status')} value={intl.get('tx_status.' + item.status)}/>
                      <MetaItem label={intl.get('tx.confirm_time')} value={txFm.getConfirmTime()}/>
                      <MetaItem label={intl.get('tx.type')} value={txFm.getType()}/>
                      <MetaItem label={intl.get('tx.gas')} value={renders.gas(txFm)}/>
                      <MetaItem label={intl.get('tx.nonce')} value={txFm.getNonce()}/>
                      <MetaItem label={intl.get('tx.value')} value={txFm.getValue() + ' ETH'}/>
                  </MetaList>
              </Tabs.TabPane>
              <Tabs.TabPane  tab={intl.get('tx_detail.tabs_fill')} key="fill">
                <MetaList>
                  <MetaItem label={intl.get('common.buy')} value={txFm.getFilledAmountOfBuy()}/>
                  <MetaItem label={intl.get('common.sell')} value={txFm.getFilledAmountOfSell()}/>
                  <MetaItem label={intl.get('fill.lrc_fee')} value={txFm.getLrcFee()}/>
                  <MetaItem label={intl.get('fill.lrc_reward')} value={txFm.getLrcReward()}/>
                  <MetaItem label={intl.get('fill.margin_split')} value={txFm.getMarginSplit()} />
                </MetaList>
              </Tabs.TabPane>
            </Tabs>
          }
          {
            item && !fill &&
              <MetaList>
                  <MetaItem label={intl.get('tx.txHash')} value={item.txHash} render={renders.txHash}/>
                  <MetaItem label={intl.get('tx.to')} value={txFm.getTo()} render={renders.address}/>
                  <MetaItem label={intl.get('tx.block')} value={txFm.getBlockNum()} render={renders.blockNumber}/>
                  <MetaItem label={intl.get('tx.status')} value={intl.get('tx_status.' + item.status)}/>
                  <MetaItem label={intl.get('tx.confirm_time')} value={txFm.getConfirmTime()}/>
                  <MetaItem label={intl.get('tx.type')} value={txFm.getType()}/>
                  <MetaItem label={intl.get('tx.gas')} value={renders.gas(txFm)}/>
                  <MetaItem label={intl.get('tx.nonce')} value={txFm.getNonce()}/>
                  <MetaItem label={intl.get('tx.value')} value={txFm.getValue() + ' ETH'}/>
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
        <div className="justify-content-end">{`${fm.getGas()}  ETH`}</div>
        <div className="justify-content-end text-mute">{`Gas(${fm.getGasLimit()}) * Gas Price(${fm.getGasPrice()} Gwei)`}</div>
      </div>
    )
  }
}

