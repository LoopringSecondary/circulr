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

export function Detail(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>订单详情</h3></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <MetaItem label="交易Hash" value="0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b" />
            <MetaItem label="接收地址" value={""} />
            <MetaItem label="块高度" value={""} />
            <MetaItem label="确认时间" value={""} />
            <MetaItem label="类型" value={""} />
            <MetaItem label="油费" value={""} />
            <MetaItem label="随机数" value={""} />
            <MetaItem label="金额" value={""} />
        </ul>
        {false &&
          <div>
            <li>
                <span>接收地址</span>
                <div className="text-lg-control break-word text-right">0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00</div>
            </li>
            <li><span>块高度</span><span>5550001</span></li>
            <li><span>状态</span><span>成功</span></li>
            <li><span>确认时间</span><span>2018年5月4日 00:17</span></li>
            <li><span>类型</span><span>接收 LRC</span></li>
            <li><span>油费</span><span className="text-right">0.005 ETH<br /><small className="text-color-dark-2">Gas(500000) * Gas Price(10 Gwei)</small></span></li>
            <li><span>随机数</span><span>866</span></li>
            <li><span>金额</span><span>0 ETH</span></li>
          </div>
        }
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


class DetailBlock extends React.Component {

  state = {
    ethTx: null,
    loading: true
  }
  componentDidMount() {
    // const {modals} = this.props;
    // const modal = modals['transaction/detail'];
    // const item = modal.item;
    // const _this = this;
    // getTransactionByhash(item.txHash).then(res => {
    //   if (!res.error) {
    //     const ethTx = res.result;
    //     _this.setState({loading: false, ethTx})
    //   } else {
    //     _this.setState({loading: false})
    //   }
    // })
  }
  render() {
    const {modals} = this.props;
    const item = {} // TODO
    const fill = {} // TODO
    const {ethTx, loading} = this.state;
    const reSendTx = (txHash) => {
    }
    const txFm = new TxFm({...ethTx,fill})
    return (
      <Card >
        <Tabs defaultActiveKey="basic" tabPosition="" animated={true} style={{marginTop:'-10px'}}>
          <Tabs.TabPane  tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('txs.tx_detail')}</div>} key="basic">
          <Spin spinning={loading}>
            <MetaItem label={intl.get('txs.tx_hash')} value={item.txHash} render={renders.txHash}/>
            <MetaItem label={intl.get('txs.to')} value={item.to} render={renders.address}/>
            <MetaItem label={intl.get('txs.block_num')} value={item.blockNumber} render={renders.blockNumber}/>
            <MetaItem label={intl.get('txs.status')} value={intl.get('txs.' + item.status)}/>
            <MetaItem label={intl.get('txs.confirm_time')} value={txFm.getConfirmTime()}/>
            <MetaItem label={intl.get('txs.type')} value={txFm.getType()}/>
            {ethTx && <MetaItem label={intl.get('token.gas')} value={
              <div className="mr15">
                <div className="row justify-content-end">{`${txFm.getGas()}  ETH`}</div>
                <div className="row justify-content-end fs14 color-black-3">{`Gas(${txFm.getGasLimit()}) * Gas Price(${txFm.getGasPrice()} Gwei)`}</div>
              </div>
            }/>}
            <MetaItem label={intl.get('wallet.nonce')} value={txFm.getNonce()}/>
            <MetaItem label={intl.get('txs.value')} value={txFm.getValue() + ' ETH'}/>
          </Spin>
          </Tabs.TabPane>
          {
            fill &&
            <Tabs.TabPane  tab={<div style={{marginLeft:'0px'}} className="fs16 text-center mb5">{intl.get('orders.fill_detail')}</div>} key="fill">
              <MetaItem label={intl.get('txs.fill_buy')} value={txFm.getFilledAmountOfBuy()}/>
              <MetaItem label={intl.get('txs.fill_sell')} value={txFm.getFilledAmountOfSell()}/>
              <MetaItem label={intl.get('orders.LrcFee')} value={txFm.getLrcFee()}/>
              <MetaItem label={intl.get('orders.LrcReward')} value={txFm.getLrcReward()}/>
              <MetaItem label={intl.get('txs.margin_split')} value={txFm.getMarginSplit()} />
            </Tabs.TabPane>
          }
        </Tabs>


      </Card>
    );
  }

}

export default DetailBlock;
