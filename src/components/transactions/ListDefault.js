import React from 'react';
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
        <div className="card-header bordered">
            <h4>Transactions</h4>
            <div className="form-inline form-dark">
                <span>
                  <Select defaultValue="All Status" dropdownMatchSelectWidth={false} className="form-inline form-inverse">
                    <Option value="all">All Status</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Success">Success</Option>
                    <Option value="Failed">Failed</Option>
                  </Select>
                </span>
                <span>
                <Select defaultValue="All types" dropdownMatchSelectWidth={false}>
                  <Option value="all">All types</Option>
                  <Option value="Pending">Send</Option>
                  <Option value="Success">Receive</Option>
                  <Option value="Failed">Enable</Option>
                  <Option value="Failed">Convert</Option>
                </Select>
                </span>
            </div>
        </div>
        <div style={{height: "100%", overflow: "hidden", padding:"0 0 60px"}}>
            <div className="content-scroll">
                <table className="table table-striped table-dark text-center text-left-col1 text-left-col2 text-right-col4 text-right-last">
                    <col width="20%" />
                    <col width="15%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="15%" />
                    <col width="20%" />
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Age</th>
                            <th>Block</th>
                            <th className="text-right">Value</th>
                            <th className="text-center">status</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Receive LRC</td>
                            <td>3 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-success">+100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Receive LRC</td>
                            <td>4 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-success">+100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Receive LRC</td>
                            <td>12 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-success">+100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Receive LRC</td>
                            <td>14 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-success">+100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>3 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-warning"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Convert LRC To WETH</td>
                            <td>3 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100,000.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Convert LRC To WETH</td>
                            <td>2/6/2018 10:00 PM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100,000.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-clock"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Receive LRC</td>
                            <td>14 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-success">+100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>3 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Convert LRC To WETH</td>
                            <td>3 hour ago</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100,000.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Convert LRC To WETH</td>
                            <td>2/6/2018 10:00 PM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100,000.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-clock"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                        <tr>
                            <td>Send LRC</td>
                            <td>2/6/2018 10:00 AM</td>
                            <td>5241856</td>
                            <td className="text-right text-down">-100.00 LRC</td>
                            <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                            <td>→ 0xf1d48f1aaeba93</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default ListBlock
