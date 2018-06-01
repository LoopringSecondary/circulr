import React from 'react'
import {Tabs, Spin} from 'antd'
import {Link} from 'dva/router'
import {DetailHeader, MetaList, MetaItem} from 'LoopringUI/components/DetailPage'
import intl from 'react-intl-universal';
import {renders} from './ListMyOrders';
import {OrderFm} from 'modules/orders/OrderFm';
import Fills from './Fills';

function OrderDetail(props) {
  const {orderDetail} = props;
  const {order} = orderDetail;
  if(!order){
    return null
  }
  const orderFm = new OrderFm(order);
  return (
    <div className="pd-lg">
      <div className="sidebar-header">
          <h3>{intl.get('order_detail.title')}</h3>
      </div>
      <Tabs defaultActiveKey="1" className="tabs-dark">
        <Tabs.TabPane tab={intl.get('order_detail.tabs_basic')} key="1" className="text-color-dark">
          <Spin spinning={false}>
            <MetaList>
              <MetaItem label={intl.get('order.hash')} value={orderFm.getOrderHash()}/>
              <MetaItem label={intl.get('order.status')} value={renders.status(orderFm)}/>
              <MetaItem label={intl.get('order.price')} value={orderFm.getPrice()}/>
              <MetaItem label={intl.get('order.amount')} value={orderFm.getAmount()}/>
              <MetaItem label={intl.get('order.total')} value={orderFm.getTotal()}/>
              <MetaItem label={intl.get('order.LRCFee')} value={orderFm.getLRCFee()}/>
              <MetaItem label={intl.get('order.marginSplit')} value={orderFm.getMarginSplit()}/>
              <MetaItem label={intl.get('order.filled')} value={orderFm.getFilledPercent()}/>
              <MetaItem label={intl.get('order.validSince')} value={orderFm.getCreateTime()}/>
              <MetaItem label={intl.get('order.validUntil')} value={orderFm.getExpiredTime()}/>
            </MetaList>
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane tab={intl.get('order_detail.tabs_fills')} key="2" className="text-color-dark">
          <Fills order={order}/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OrderDetail
