import React from 'react'
import {Tabs, Spin} from 'antd'
import {Link} from 'dva/router'
import {DetailHeader, MetaList, MetaItem} from 'LoopringUI/components/DetailPage'
import intl from 'react-intl-universal';
import {RingFm} from 'modules/rings/formatters'

export default class RingDetail extends React.Component{
  state={
    ring:null,
    loading:true
  };
  componentDidMount() {
    const {ringDetail} = this.props;
    const fill = ringDetail.ring;
    const  _this = this;
    window.RELAY.ring.getRingMinedDetail({ringIndex:fill.ringIndex,protocolAddress:fill.protocol}).then(res => {
      if(!res.error){
        _this.setState({ring:res.result,loading:false})
      }else {
        _this.setState({loading:false})
      }
    })
  }

  render() {
    const {ring,loading} = this.state;
    const ringFm = ring ? new RingFm(ring) : null;
    return (
      <div>
        <DetailHeader title="环路详情"/>
        {ring && <Spin spinning={loading}>
          <MetaList>
            <MetaItem label="环路" value={ringFm.getRingIndex()}/>
            <MetaItem label="环路哈希" value={ringFm.getRingHash()}/>
            <MetaItem label="矿工" value={ringFm.getMiner()}/>
            <MetaItem label="交易Hash" value={ringFm.getTxHash()}/>
            <MetaItem label="块高度" value={ringFm.getBlockNumber()}/>
            <MetaItem label="费用接收地址" value={ringFm.getFeeRecipient()}/>
            <MetaItem label="总共的LRC费用" value={ringFm.getTotalLrcFee()}/>
            <MetaItem label="总共的分润费用" value={ringFm.getTotalSplitFee()}/>
            <MetaItem label="时间" value={ringFm.getCreateTime()}/>
            <MetaItem label="环路中订单个数" value={ringFm.getTradeAmount()}/>
          </MetaList>
        </Spin>}
        {!loading &&  !ring &&
          <div>
            <h1>No data</h1>
          </div>
          }
      </div>
    )
  }
}
export const renders = {}
