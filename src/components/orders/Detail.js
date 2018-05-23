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
          <Fills order={order}/>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default OrderDetail
