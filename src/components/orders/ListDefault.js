import React from 'react'
import { Form,Select } from 'antd';
const Option = Select.Option;
function ListHeaderForm({className=''}){
  return (
    <div className={className}>
    	ListHeaderForm
    </div>
  )
}

function ListHeader({className=''}){
  return (
    <div className={className}>
    	ListHeader
    </div>
  )
}
function ListBlock(props) {
  return (
    <div>
        <div className="order-filter d-flex justify-content-between form-inline-inverse">
            <div className="d-flex justify-content-between">
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
        <table className="table table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2">
          <thead>
              <tr>
                  <th>Order</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Amount<small>(LRC)</small></th>
                  <th>Price</th>
                  <th>Total<small>(WETH)</small></th>
                  <th>LRC Fee<small>(LRC)</small></th>
                  <th>Filled</th>
                  <th>Options</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td><a href="#orderDetail" data-toggle="modal" className="text-primary">0x58...ba9b</a></td>
                  <td>March 27, 2018 5:51 PM</td>
                  <td><i className="text-inverse icon-success"></i></td>
                  <td>LRC-WETH</td>
                  <td><span className="text-success">Sell</span></td>
                  <td>300</td>
                  <td>0.00087</td>
                  <td>0.259989</td>
                  <td>0.58</td>
                  <td className="text-center">50%</td>
                  <td></td>
              </tr>
              <tr>
                  <td><a href="#orderDetail" data-toggle="modal" className="text-primary">0x44...da11</a></td>
                  <td>March 27, 2018 5:40 PM</td>
                  <td><i className="text-inverse icon-success"></i></td>
                  <td>LRC-WETH</td>
                  <td><span className="text-danger">Buy</span></td>
                  <td>300</td>
                  <td>0.00087</td>
                  <td>0.259989</td>
                  <td>0.23</td>
                  <td className="text-center">50%</td>
                  <td></td>
              </tr>
              <tr>
                  <td><a href="#orderDetail" data-toggle="modal" className="text-primary">0x44...da11</a></td>
                  <td>March 27, 2018 5:40 PM</td>
                  <td><i className="text-inverse icon-success"></i></td>
                  <td>LRC-WETH</td>
                  <td><span className="text-success">Sell</span></td>
                  <td>300</td>
                  <td>0.00087</td>
                  <td>0.259989</td>
                  <td>0.51</td>
                  <td className="text-center">50%</td>
                  <td></td>
              </tr>
              <tr>
                  <td><a href="#orderDetail" data-toggle="modal" className="text-primary">0x44...da11</a></td>
                  <td>March 27, 2018 5:40 PM</td>
                  <td><i className="text-inverse icon-success"></i></td>
                  <td>LRC-WETH</td>
                  <td><span className="text-danger">Buy</span></td>
                  <td>300</td>
                  <td>0.00087</td>
                  <td>0.259989</td>
                  <td>0.58</td>
                  <td className="text-center">50%</td>
                  <td></td>
              </tr>
          </tbody>
        </table>
  </div>
  )
}

export default ListBlock
