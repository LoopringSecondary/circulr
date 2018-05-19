import React from 'react'
import {Tabs} from 'antd'
import {Link} from 'dva/router'
import CoinIcon from 'LoopringUI/components/CoinIcon'
import {toNumber,toBig} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
import {renders} from './ListMyOrders';
import {FillFm} from 'modules/orders/formatters';

function Detail(props) {
  return (
    <div>
      <div className="modal-header text-dark"><h3>撮合环路信息</h3></div>
    	<ul className="list list-label list-dark list-justify-space-between divided">
    	    <li><span>环路</span><span>253</span></li>
    	    <li>
                <span>环路哈希</span>
    	        <div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
    	    </li>
    	    <li>
                <span>矿工</span>
    	        <div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div>
    	    </li>
    	    <li><span>交易Hash</span><div className="text-lg-control break-word text-right">0x46b9ab33d6904718fc2d16ad1a133a35ae23045</div></li>
    	    <li><span>块高度</span><span>5,550,001</span></li>
    	    <li><span>费用接收地址</span><div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div></li>
    	    <li><span>总共的LRC费用</span><span>0.165617 LRC</span></li>
    	    <li><span>总分的分润费用</span><span>0.36 LRC</span></li>
    	    <li><span>时间</span><span>2018年5月4日 00:17</span></li>
    	    <li><span>环路中订单个数</span><span>2</span></li>
    	</ul>
    </div>
  )
}
export default Detail



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
function OrderDetail(props) {
  const fill = {}
  const orderFm = new FillFm(fill)
   return (
    <div>
        <div className="modal-header text-dark"><h3>订单详情</h3></div>
        <Tabs defaultActiveKey="1" className="tabs-dark">
          <Tabs.TabPane tab="基础详情" key="1" className="text-color-dark">
              {
                false &&
                <div className="pd-md text-center">
                  <span><i className="icon-ETH icon-token-md"></i><b>WEH</b></span>
                  <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"></i></span>
                  <span className="offset-lg"><b>WETH </b><i className="icon-WETH icon-token-md"></i></span>
                </div>
              }
              <div className="divider-dark solid"></div>
              <ul className="list list-label list-dark list-justify-space-between divided">
                  <MetaItem label={intl.get('orders.hash')} value={orderFm.getOrderHash()}/>
                  <MetaItem label={intl.get('orders.status')} value={renders.status(orderFm)}/>
                  <MetaItem label={intl.get('orders.price')} value={orderFm.getPrice()}/>
                  <MetaItem label={intl.get('orders.amount')} value={orderFm.getAmount()}/>
                  <MetaItem label={intl.get('orders.total')} value={orderFm.getTotal()}/>
                  <MetaItem label={intl.get('orders.LRCFee')} value={orderFm.getLRCFee()}/>
                  <MetaItem label={intl.get('orders.marginSplit')} value={orderFm.getMarginSplit()}/>
                  <MetaItem label={intl.get('orders.filled')} value={orderFm.getFilledPercent()}/>
                  <MetaItem label={intl.get('orders.validSince')} value={orderFm.getCreateTime()}/>
                  <MetaItem label={intl.get('orders.validUntil')} value={orderFm.getExpiredTime()}/>
              </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="撮合详情" key="2">
              <table style={{overflow:'auto'}} className="table table-dark table-striped text-left">
                <thead>
                    <tr>
                        <th>环路</th>
                        <th>数量</th>
                        <th>价格</th>
                        <th>金额</th>
                        <th>LRC撮合费</th>
                        <th>LRC撮合奖励</th>
                        <th>时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>253</td>
                        <td>80 LRC</td>
                        <td>0.00135</td>
                        <td>0.108 WETH</td>
                        <td>0 LRC</td>
                        <td>0 LRC</td>
                        <td>2018年5月4日 00:17</td>
                    </tr>
                </tbody>
              </table>
          </Tabs.TabPane>
        </Tabs>
    </div>
  )
}
export default OrderDetail
