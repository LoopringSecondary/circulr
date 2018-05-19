import React from 'react'
import {Tabs} from 'antd'
import {Link} from 'dva/router'
import CoinIcon from 'LoopringUI/components/CoinIcon'
import {toNumber,toBig} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
import {renders} from './ListMyOrders';
import {OrderFm} from 'modules/orders/OrderFm';

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
  const order = {}
  const orderFm = new OrderFm(order)
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
