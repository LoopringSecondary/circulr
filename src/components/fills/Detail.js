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
    const fill = ringDetail.fill;
    const  _this = this;
    if(fill && fill.ringIndex){
      window.RELAY.ring.getRingMinedDetail({ringIndex:fill.ringIndex,protocolAddress:fill.protocol}).then(res => {
        if(!res.error){
          _this.setState({ring:res.result,loading:false})
        }else {
          _this.setState({loading:false})
        }
      })
    }
  }
  render() {
    const {ring,loading} = this.state;
    const ringFm = ring ? new RingFm(ring) : null;
    return (
      <div className="p15">
        <DetailHeader title="环路详情"/>
        <Spin spinning={loading}>
          {ring &&
            <MetaList>
              <MetaItem label={intl.get('ring.ringIndex')} value={ringFm.getRingIndex()}/>
              <MetaItem label={intl.get('ring.ringHash')} value={ringFm.getRingHash()}/>
              <MetaItem label={intl.get('ring.miner')} value={ringFm.getMiner()}/>
              <MetaItem label={intl.get('ring.txHash')} value={ringFm.getTxHash()}/>
              <MetaItem label={intl.get('ring.block')} value={ringFm.getBlockNumber()}/>
              <MetaItem label={intl.get('ring.recipient')} value={ringFm.getFeeRecipient()}/>
              <MetaItem label={intl.get('ring.total_lrc_fee')} value={ringFm.getTotalLrcFee()}/>
              <MetaItem label={intl.get('ring.total_margin_split')} value={ringFm.getTotalSplitFee()}/>
              <MetaItem label={intl.get('ring.time')} value={ringFm.getCreateTime()}/>
            </MetaList>
          }
        </Spin>
        {!loading &&  !ring &&
          <div>
            <h1>{intl.get('common.list.no_data')}</h1>
          </div>
        }
      </div>
    )
  }
}
export const renders = {}
