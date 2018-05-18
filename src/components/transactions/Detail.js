import React from 'react'
import {Card, Spin, Button,Tabs} from 'antd'
import intl from 'react-intl-universal'
import Notification from 'LoopringUI/components/Notification';
import Alert from 'LoopringUI/components/Alert'
import {copyToPasteboard} from 'modules/formatter/common'
import {TxFm} from 'modules/transactions/formatters'
const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <li>
      <span>
        {label}
      </span>
      <div className="text-lg-control break-word text-right">
        {render ? render(value) : value}
      </div>
    </li>
  )
}
export default function Detail(props) {
  const {modals} = props;
  const item = {} // TODO
  const fill = {} // TODO
  const {ethTx, loading} = props;
  const reSendTx = (txHash) => {
  }
  const txFm = new TxFm({...ethTx,fill})
  return (
    <div>
        <div className="modal-header text-dark"><h3>订单详情</h3></div>
        <Tabs defaultActiveKey="basic" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
          <Tabs.TabPane  tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('txs.tx_detail')}</div>} key="basic">
          <Spin spinning={loading}>
            <ul className="list list-label list-dark list-justify-space-between divided">
                <MetaItem label={intl.get('txs.tx_hash')} value={item.txHash} render={renders.txHash}/>
                <MetaItem label={intl.get('txs.to')} value={item.to} render={renders.address}/>
                <MetaItem label={intl.get('txs.block_num')} value={item.blockNumber} render={renders.blockNumber}/>
                <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + item.status)}/>
                <MetaItem label={intl.get('txs.confirm_time')} value={txFm.getConfirmTime()}/>
                <MetaItem label={intl.get('txs.type')} value={txFm.getType()}/>
                {ethTx &&
                  <MetaItem label={intl.get('token.gas')} value={
                    <div className="mr15">
                      <div className="row justify-content-end">{`${txFm.getGas()}  ETH`}</div>
                      <div className="row justify-content-end fs14 color-black-3">{`Gas(${txFm.getGasLimit()}) * Gas Price(${txFm.getGasPrice()} Gwei)`}</div>
                    </div>
                  }/>
                }
                <MetaItem label={intl.get('wallet.nonce')} value={txFm.getNonce()}/>
                <MetaItem label={intl.get('txs.value')} value={txFm.getValue() + ' ETH'}/>
            </ul>

          </Spin>
          </Tabs.TabPane>
          {
            fill &&
            <Tabs.TabPane  tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('orders.fill_detail')}</div>} key="fill">
              <ul className="list list-label list-dark list-justify-space-between divided">
                <MetaItem label={intl.get('txs.fill_buy')} value={txFm.getFilledAmountOfBuy()}/>
                <MetaItem label={intl.get('txs.fill_sell')} value={txFm.getFilledAmountOfSell()}/>
                <MetaItem label={intl.get('orders.LrcFee')} value={txFm.getLrcFee()}/>
                <MetaItem label={intl.get('orders.LrcReward')} value={txFm.getLrcReward()}/>
                <MetaItem label={intl.get('txs.margin_split')} value={txFm.getMarginSplit()} />
              </ul>
            </Tabs.TabPane>
          }
        </Tabs>
    </div>
  )
}
export const renders = {
  txHash: (value) => <a className="text-truncate d-block" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                          href={`https://etherscan.io/tx/${value}`}>{value}</a>,
  blockNumber: (value) => <a className="text-truncate d-block" target="_blank"
                               href={`https://etherscan.io/block/${value}`}>{value}</a>,
  address: (value) => <a className="text-truncate d-block" target="_blank" onCopy={copyToPasteboard.bind(this, value)}
                           href={`https://etherscan.io/address/${value}`}>{value}</a>,
}

