import React from 'react'
import { Form,Select,Badge } from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import ListHeader from './ListMyOrdersHeader'
import {OrderFm} from 'modules/orders/ListFm'
import {getShortAddress} from 'modules/formatter/common'
import intl from 'react-intl-universal'

export default function ListMyOrders(props) {
  const {orders={}}=props
  console.log('orders',orders)
  return (
    <div>
        <ListHeader orders={orders} />
        <table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2">
          <thead>
              <tr>
                  <th>Order</th>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>LRC Fee</th>
                  <th>Filled</th>
                  <th>Created</th>
                  <th>Expired</th>
                  <th>Status</th>
              </tr>
          </thead>
          <tbody>
              {
                orders.items.map((item,index)=>{
                  const orderFm = new OrderFm(item)
                  return (
                    <tr key={index}>
                      <td>
                        {
                          renders.hash(orderFm.getHash(),item,index)
                        }
                      </td>
                      <td>{orderFm.getMarket()}</td>
                      <td>
                        { orderFm.getSide()==='buy' &&
                          <span className="text-success">{orderFm.getSide()}</span>
                        }
                        { orderFm.getSide()==='sell' &&
                          <span className="text-error">{orderFm.getSide()}</span>
                        }
                      </td>
                      <td>{orderFm.getAmount()}</td>
                      <td>{orderFm.getPrice()}</td>
                      <td>{orderFm.getTotal()}</td>
                      <td>{orderFm.getLRCFee()}</td>
                      <td className="text-center">{orderFm.getFilledPercent()}%</td>
                      <td>{orderFm.getExpiredTime()}</td>
                      <td>{orderFm.getCreateTime()}</td>
                      <td>
                        {false &&
                          <i className="text-color-dark icon-success"></i>
                        }
                        {
                          renders.status(orderFm.getStatus(),item,index)
                        }
                      </td>
                   </tr>
                  )
                })
              }
          </tbody>
        </table>
        <ListPagination list={orders}/>
  </div>
  )
}

export const renders = {
  hash: (value, item, index) => (
    <a className="text-primary"
       onCopy={null}
       onClick={null}
    >
      {getShortAddress(value)}
    </a>
  ),
  status: (value, item, index) => {
    const cancleBtn = (
      <a className="ml5 fs12 color-black-2"
         onClick={null}>
        {intl.get('order.no')}
      </a>
    )
    let status
    if (item.status === 'ORDER_OPENED') {
      status = <Badge className="text-color-dark-1" status="processing" text={intl.get('orders.status_opened')}/>
    }
    if (item.status === 'ORDER_FINISHED') {
      status = <Badge className="text-color-dark-1" status="success" text={intl.get('orders.status_completed')}/>
    }
    if (item.status === 'ORDER_CANCELLED') {
      status = <Badge className="text-color-dark-1" status="default" text={intl.get('orders.status_canceled')}/>
    }
    if (item.status === 'ORDER_CUTOFF') {
      status = <Badge className="text-color-dark-1" status="default" text={intl.get('orders.status_canceled')}/>
    }
    if (item.status === 'ORDER_EXPIRE') {
      status = <Badge className="text-color-dark-1" status="default" text={intl.get('orders.status_expired')}/>
    }
    return (
      <div className="text-left">
        {item.status !== 'ORDER_OPENED' && status}
        {item.status === 'ORDER_OPENED' &&
          <span>
            {status}
            {cancleBtn}
          </span>
        }
      </div>
    )
  },
}
