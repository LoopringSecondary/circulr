import React from 'react'
import {Tabs} from 'antd'
import {Link} from 'dva/router'
import CoinIcon from 'LoopringUI/components/CoinIcon'
import {toNumber,toBig} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
import {FillFm} from 'modules/fills/formatters'
import {RingFm} from 'modules/rings/formatters'

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
export default function RingDetail(props) {
  const ring = {
    fills:[],
    ringinfo:[],
  }
  const ringFm = new RingFm(ring)
   return (
    <div>
        <div className="modal-header text-dark"><h3>环路详情</h3></div>
          <ul className="list list-label list-dark list-justify-space-between divided">
              <MetaItem label="环路" value={ringFm.getRingIndex()} />
              <MetaItem label="环路哈希" value={ringFm.getRingHash()} />
              <MetaItem label="矿工" value={ringFm.getMiner()} />
              <MetaItem label="交易Hash" value={ringFm.getTxHash()} />
              <MetaItem label="块高度" value={ringFm.getBlockNumber()} />
              <MetaItem label="费用接收地址" value={ringFm.getFeeRecipient()} />
              <li><span>交易Hash</span><div className="text-lg-control break-word text-right">0x46b9ab33d6904718fc2d16ad1a133a35ae23045</div></li>
              <li>
                  <span>环路哈希</span>
                  <div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
              </li>
              <li>
                    <span>矿工</span>
                  <div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div>
              </li>
              <li><span>费用接收地址</span><div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div></li>
              <li><span>总共的LRC费用</span><span>0.165617 LRC</span></li>
              <li><span>总分的分润费用</span><span>0.36 LRC</span></li>
              <li><span>时间</span><span>2018年5月4日 00:17</span></li>
              <li><span>环路中订单个数</span><span>2</span></li>
          </ul>
    </div>
  )
}

export const renders = {

}
