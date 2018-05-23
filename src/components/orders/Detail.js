import React from 'react'
import {Tabs,Spin} from 'antd'
import {Link} from 'dva/router'
import {DetailHeader,MetaList,MetaItem} from 'LoopringUI/components/DetailPage'
import intl from 'react-intl-universal';
import {renders} from './ListMyOrders';
import {OrderFm} from 'modules/orders/OrderFm';

function OrderDetail(props) {
   const {orderDetail} =  props;
  const {order} = orderDetail;
  console.log('props',order)
  const orderFm = new OrderFm(order);
   return (
    <div>
        <DetailHeader title="订单详情"/>
        <Tabs defaultActiveKey="1" className="tabs-dark">
	        <Tabs.TabPane tab="基础详情" key="1" className="text-color-dark">
              <Spin spinning={false}>
  	            <MetaList>
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
  	            </MetaList>
              </Spin>
	        </Tabs.TabPane>
	        <Tabs.TabPane tab="撮合详情" key="2" className="text-color-dark">
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
