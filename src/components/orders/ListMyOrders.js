import React from 'react'
import { Form,Select } from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import ListHeader from './ListMyOrdersHeader'
import {OrderFm} from 'modules/orders/ListFm'

const Option = Select.Option;
function ListHeaderForm({className=''}){
  return (
    <div className={className}>
    	ListHeaderForm
    </div>
  )
}
function ListHeader2({orders}){
  return (
    <div className="order-filter d-flex justify-content-between">
        <div className="form-inline form-dark d-flex justify-content-between">
            <span>
              <Select defaultValue="LRC-WETH" dropdownMatchSelectWidth={false}>
                  <Option value="LRC-WETH">LRC-WETH</Option>
                  <Option value="RND-WETH">RND-WETH</Option>
                  <Option value="KNC-WETH">KNC-WETH</Option>
                  <Option value="AE-WETH">AE-WETH</Option>
                  <Option value="IND-WETH">IND-WETH</Option>
              </Select>
            </span>
            <span className="offset-md">
              <Select defaultValue="All types" dropdownMatchSelectWidth={false}>
                  <Option value="all">All types</Option>
                  <Option value="Pending">Send</Option>
                  <Option value="Success">Receive</Option>
                  <Option value="Failed">Enable</Option>
                  <Option value="Failed">Convert</Option>
              </Select>
            </span>
            <span className="offset-md">
              <Select defaultValue="All Sides" dropdownMatchSelectWidth={false}>
                  <Option value="all">All</Option>
                  <Option value="sell">Sell</Option>
                  <Option value="buy">Buy</Option>
              </Select>
            </span>
        </div>
        <span>
            <span>
              <button className="btn btn-primary">Cancel All</button>
            </span>
            <span className="offset-md">
              <button className="btn btn-primary">Cancel All markets</button>
            </span>
        </span>
    </div>
  )
}
function ListMyOrders(props) {
  const {orders={}}=props
  console.log('orders',orders)
  return (
    <div>
        <ListHeader orders={orders} />
        <table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2">
          <thead>
              <tr>
                  <th>Order</th>
                  <th>Time</th>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Amount<small>(LRC)</small></th>
                  <th>Price</th>
                  <th>Total<small>(WETH)</small></th>
                  <th>LRC Fee<small>(LRC)</small></th>
                  <th>Filled</th>
                  <th>Status</th>
              </tr>
          </thead>
          <tbody>
              {
                orders.items.map((item,index)=>{
                  const orderFm = new OrderFm(item)
                  return (
                    <tr key={index}>
                      <td><a href="#orderDetail" data-toggle="modal" className="text-primary">{orderFm.getHash()}</a></td>
                      <td>{orderFm.getCreatetime()}</td>
                      <td>{orderFm.getMarket()}</td>
                      <td>
                        { orderFm.getSide()==='buy' &&
                          <span className="text-up">{orderFm.getSide()}</span>
                        }
                        { orderFm.getSide()==='sell' &&
                          <span className="text-down">{orderFm.getSide()}</span>
                        }
                      </td>
                      <td>{orderFm.getAmount()}</td>
                      <td>{orderFm.getPrice()}</td>
                      <td>{orderFm.getTotal()}</td>
                      <td>{orderFm.getLRCFee()}</td>
                      <td className="text-center">{orderFm.getFilled()}</td>
                      <td>
                        {false &&
                          <i className="text-color-dark icon-success"></i>
                        }
                        {
                          orderFm.getStatus()
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
export default ListMyOrders
