import React from 'react'
import { Form,Select,Badge } from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import SelectContainer from 'LoopringUI/components/SelectContainer'
import {getSupportedMarket} from 'LoopringJS/relay/rpc/market'
import {OrderFm} from 'modules/orders/ListFm'
import {getShortAddress} from 'modules/formatter/common'
import config from 'common/config'
import intl from 'react-intl-universal'

const ListHeader = ({orders})=>{
  const sideChange = (side)=>{
    orders.filtersChange({filters:{side}})
  }
  const marketChange = (market)=>{
    orders.filtersChange({filters:{market}})
  }
  const statusChange = (status)=>{
    orders.filtersChange({filters:{status}})
  }

  return (
    <div className="form-inline form-dark">
        <div className="block-dark-filter">
            <div>
                <span>
                  <SelectContainer
                    loadOptions={getSupportedMarket.bind(this,window.config.rpc_host)}
                    transform={(res)=>{
                      if(res && !res.error){
                        let pairs = config.getMarkets().map(item=>`${item.tokenx}-${item.tokeny}`)
                        let options = res.result.filter(item=>pairs.includes(item)).map(item=>({label:item,value:item}))
                        return [
                          {label:`${intl.get('global.all')} ${intl.get('orders.market')}`,value:""},
                          ...options,
                        ]
                      }else{
                        return []
                      }
                    }}
                    onChange={marketChange}
                    placeholder={intl.get('orders.market')}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    dropdownMatchSelectWidth={false}
                    defaultValue=""
                    size="small"
                  >
                  </SelectContainer>
                </span>
                <span>
                  <Select
                    placeholder={intl.get('orders.status')}
                    onChange={statusChange}
                    dropdownMatchSelectWidth={false}
                    defaultValue=""
                    size="small"
                  >
                    <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('orders.status')} </Select.Option>
                    <Select.Option value="ORDER_OPENED">{intl.get('orders.status_opened')}</Select.Option>
                    <Select.Option value="ORDER_FINISHED">{intl.get('orders.status_completed')}</Select.Option>
                    <Select.Option value="ORDER_CANCELLED">{intl.get('orders.status_canceled')}</Select.Option>
                    <Select.Option value="ORDER_EXPIRE">{intl.get('orders.status_expired')}</Select.Option>
                  </Select>
                </span>
                <span>
                   <Select
                     placeholder={intl.get('orders.side')}
                     onChange={sideChange}
                     dropdownMatchSelectWidth={false}
                     defaultValue=""
                     size="small"
                   >
                     <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('orders.side')}</Select.Option>
                     <Select.Option value="sell">{intl.get('orders.side_sell')}</Select.Option>
                     <Select.Option value="buy">{intl.get('orders.side_buy')}</Select.Option>
                   </Select>
                </span>
            </div>
            <div>
                <span><button class="btn btn-primary">Cancel All</button></span>
                <span class="offset-md"><button class="btn btn-primary">Cancel All markets</button></span>
            </div>
        </div>
    </div>
  )
}

export default function ListMyOrders(props) {
  const {orders={}}=props
  return (
    <div className="">
        <ListHeader orders={orders} />
        <div style={{height:"160px",overflow:"auto"}}>
          <table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2" >
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
                        <td>{renders.hash(orderFm.getHash(),item,index)}</td>
                        <td>{orderFm.getMarket()}</td>
                        <td>{renders.side(orderFm.getSide(),item,index)}</td>
                        <td>{orderFm.getAmount()}</td>
                        <td>{orderFm.getPrice()}</td>
                        <td>{orderFm.getTotal()}</td>
                        <td>{orderFm.getLRCFee()}</td>
                        <td>{orderFm.getFilledPercent()}%</td>
                        <td>{orderFm.getCreateTime()}</td>
                        <td>{orderFm.getExpiredTime()}</td>
                        <td>{renders.status(orderFm.getStatus(),item,index)}</td>
                     </tr>
                    )
                  })
                }
            </tbody>
          </table>
        </div>
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
  side: (value, item, index) => (
    <div>
      { value ==='buy' &&
        <span className="text-success">{value}</span>
      }
      { value ==='sell' &&
        <span className="text-error">{value}</span>
      }
    </div>
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