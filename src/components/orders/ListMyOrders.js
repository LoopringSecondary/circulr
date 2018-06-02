import React from 'react'
import {Form, Select, Badge,Spin} from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import SelectContainer from 'LoopringUI/components/SelectContainer'
import {getSupportedMarket} from 'LoopringJS/relay/rpc/market'
import {OrderFm} from 'modules/orders/OrderFm'
import {getShortAddress} from 'modules/formatter/common'
import config from 'common/config'
import intl from 'react-intl-universal'

const ListHeader = (props) => {

  const {orders,dispatch} = props;
  const sideChange = (side) => {
    orders.filtersChange({filters: {side}})
  };
  const marketChange = (market) => {
    orders.filtersChange({filters: {market}})
  };
  const statusChange = (status) => {
    orders.filtersChange({filters: {status}})
  };

  const cancelAll = () => {
    const {market} = orders.filters;
    const type = market ? "cancelOrderByTokenPair" : "cancelAllOrder";
    dispatch({type:'layers/showLayer',payload:{id:'cancelOrderConfirm',type,market}})
  };
  return (
    <div className="form-inline form-dark">
      <div className="block-dark-filter">
        <div>
          <span>
            <SelectContainer
              loadOptions={getSupportedMarket.bind(this, window.config.rpc_host)}
              transform={(res) => {
                if (res && !res.error) {
                  let pairs = config.getMarkets().map(item => `${item.tokenx}-${item.tokeny}`)
                  let options = res.result.filter(item => pairs.includes(item)).map(item => ({
                    label: item,
                    value: item
                  }))
                  return [
                    {label: `${intl.get('common.all')} ${intl.get('common.markets')}`, value: ""},
                    ...options,
                  ]
                } else {
                  return []
                }
              }}
              onChange={marketChange}
              placeholder={intl.get('order.market')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              dropdownMatchSelectWidth={false}
              value={orders.filters.market || ""}
              size="small"
            >
            </SelectContainer>
          </span>
          <span>
            <Select
              placeholder={intl.get('order.status')}
              onChange={statusChange}
              dropdownMatchSelectWidth={false}
              value={orders.filters.status || ""}
              size="small"
            >
              <Select.Option value="">{intl.get('common.all')}&nbsp;{intl.get('common.statuses')} </Select.Option>
              <Select.Option value="ORDER_OPENED">{intl.get('order_status.opened')}</Select.Option>
              <Select.Option value="ORDER_FINISHED">{intl.get('order_status.completed')}</Select.Option>
              <Select.Option value="ORDER_CANCELLED">{intl.get('order_status.canceled')}</Select.Option>
              <Select.Option value="ORDER_EXPIRE">{intl.get('order_status.expired')}</Select.Option>
            </Select>
          </span>
          <span>
             <Select
               placeholder={intl.get('order.side')}
               onChange={sideChange}
               dropdownMatchSelectWidth={false}
               value={orders.filters.side || ""}
               size="small"
             >
               <Select.Option value="">{intl.get('common.all')}&nbsp;{intl.get('common.sides')}</Select.Option>
               <Select.Option value="sell">{intl.get('order_side.sell')}</Select.Option>
               <Select.Option value="buy">{intl.get('order_side.buy')}</Select.Option>
             </Select>
          </span>
        </div>
        <div>
          <span><button className="btn btn-primary" onClick={cancelAll}>{intl.get('order_list.actions_cancel_all')}</button></span>
        </div>
      </div>
    </div>
  )
}

export default function ListMyOrders(props) {
  const {orders = {},dispatch} = props;
  const cancelOrder = (order) => {
    dispatch({type:'layers/showLayer',payload:{id:'cancelOrderConfirm',type:'cancelOrder',order}})
  };
  return (
    <div className="">
      <ListHeader orders={orders} dispatch={props.dispatch}/>
      <div style={{height: "160px", overflow: "auto"}}>
        <Spin spinning={orders.loading}>
          <table style={{overflow: 'auto'}}
                 className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2">
            <thead>
            <tr>
              <th>{intl.get('order.hash')}</th>
              <th>{intl.get('order.market')}</th>
              <th>{intl.get('order.side')}</th>
              <th>{intl.get('order.amount')}</th>
              <th>{intl.get('order.price')}</th>
              <th>{intl.get('order.total')}</th>
              <th>{intl.get('order.LRCFee')}</th>
              <th>{intl.get('order.filled')}</th>
              <th>{intl.get('order.validSince')}</th>
              <th>{intl.get('order.validUntil')}</th>
              <th>{intl.get('order.status')}</th>
            </tr>
            </thead>
            <tbody>
            {
              orders.items.map((item, index) => {
                const orderFm = new OrderFm(item)
                const actions = {
                  gotoDetail: () => props.dispatch({type: 'layers/showLayer', payload: {id: 'orderDetail', order: item}})
                };
                return (
                  <tr key={index}>
                    <td>{renders.hash(orderFm, actions)}</td>
                    <td>{orderFm.getMarket()}</td>
                    <td>{renders.side(orderFm)}</td>
                    <td>{orderFm.getAmount()}</td>
                    <td>{orderFm.getPrice()}</td>
                    <td>{orderFm.getTotal()}</td>
                    <td>{orderFm.getLRCFee()}</td>
                    <td>{orderFm.getFilledPercent()}%</td>
                    <td>{orderFm.getCreateTime()}</td>
                    <td>{orderFm.getExpiredTime()}</td>
                    <td>{renders.status(orderFm,item.originalOrder,cancelOrder)}</td>
                  </tr>
                )
              })
            }
            {
              orders.items.length == 0 &&
              <tr><td colSpan='100'><div className="text-center">{intl.get('common.list.no_data')}</div></td></tr>
            }
            </tbody>
          </table>
        </Spin>
      </div>
      <ListPagination list={orders}/>
    </div>
  )
}

export const renders = {
  hash: (fm, actions) => (
    <a className="text-primary"
       onCopy={null}
       onClick={actions && actions.gotoDetail}
    >
      {getShortAddress(fm.getOrderHash())}
    </a>
  ),
  side: (fm) => (
    <div>
      {fm.getSide() === 'buy' &&
      <span className="text-success">{intl.get(`common.${fm.getSide()}`)}</span>
      }
      {fm.getSide() === 'sell' &&
      <span className="text-error">{intl.get(`common.${fm.getSide()}`)}</span>
      }
    </div>
  ),
  status: (fm,order,cancelOrder) => {
    const status = fm.getStatus()
    const cancleBtn = (
      <a className="ml5 fs12 color-black-2"
         onClick={()=> cancelOrder(order)}>
        {intl.get('order.no')}
      </a>
    )
    let statusNode
    if (status === 'ORDER_OPENED') {
      statusNode = <Badge className="text-color-dark-1" status="processing" text={<span className="color-white-1">{intl.get('order_status.opened')}</span>}/>
    }
    if (status === 'ORDER_FINISHED') {
      statusNode = <Badge className="text-color-dark-1" status="success" text={<span className="color-white-1">{intl.get('order_status.completed')}</span>}/>
    }
    if (status === 'ORDER_CANCELLED') {
      statusNode = <Badge className="text-color-dark-1" status="default" text={<span className="color-white-1">{intl.get('order_status.canceled')}</span>}/>
    }
    if (status === 'ORDER_CUTOFF') {
      statusNode = <Badge className="text-color-dark-1" status="default" text={<span className="color-white-1">{intl.get('order_status.canceled')}</span>}/>
    }
    if (status === 'ORDER_EXPIRE') {
      statusNode = <Badge className="text-color-dark-1" status="default" text={<span className="color-white-1">{intl.get('order_status.expired')}</span>}/>
    }
    return (
      <div className="d-flex text-nowrap">
        {statusNode} {status === 'ORDER_OPENED' && cancleBtn}
      </div>
    )
  },
}
