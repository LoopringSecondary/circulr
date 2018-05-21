import React from 'react'
import {Tabs,Spin} from 'antd'
import {Link} from 'dva/router'
import {DetailHeader,MetaList,MetaItem} from 'LoopringUI/components/DetailPage'
import intl from 'react-intl-universal';
import {RingFm} from 'modules/rings/formatters'

export default function RingDetail(props) {
  const ring = {
    fills:[],
    ringinfo:[],
  }
  const ringFm = new RingFm(ring)
   return (
    <div>
        <DetailHeader title="环路详情"/>
        <Spin spinning={false}>
          <MetaList>
            <MetaItem label="环路" value={ringFm.getRingIndex()} />
            <MetaItem label="环路哈希" value={ringFm.getRingHash()} />
            <MetaItem label="矿工" value={ringFm.getMiner()} />
            <MetaItem label="交易Hash" value={ringFm.getTxHash()} />
            <MetaItem label="块高度" value={ringFm.getBlockNumber()} />
            <MetaItem label="费用接收地址" value={ringFm.getFeeRecipient()} />
            <MetaItem label="总共的LRC费用" value="TODO" />
            <MetaItem label="总共的分润费用" value="TODO" />
            <MetaItem label="时间" value="TODO" />
            <MetaItem label="环路中订单个数" value="TODO" />
          </MetaList>
        </Spin>
    </div>
  )
}
export const renders = {

}
