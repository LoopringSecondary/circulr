import React from 'react';
import { Form,Select,Spin } from 'antd';
import intl from 'react-intl-universal';
const Option = Select.Option;
const getTypes = (token)=>{
  let types = [
    {label:intl.get(`global.all`)+ ' ' +intl.get('txs.type'),value:''},
    {label:intl.get(`txs.type_sell`),value:'sell'},
    {label:intl.get(`txs.type_buy`),value:'buy'},
    {label:intl.get(`txs.type_transfer`),value:'send'},
    {label:intl.get(`txs.type_receive`),value:'receive'},
    {label:intl.get(`txs.type_enable`),value:'approve'},
  ]
  let convertTypes = [{label:intl.get(`txs.type_convert`),value:'convert'}]
  let lrcTypes = [
     {label:intl.get(`txs.type_lrc_fee`),value:'lrc_fee'},
     {label:intl.get(`txs.type_lrc_reward`),value:'lrc_reward'},
  ]
  let othersTypes = [
     // {label:intl.get(`txs.type_others`),value:'others'},
  ]
  if(token.toUpperCase() === 'WETH' || token.toUpperCase() === 'ETH'){
    types = [...types,...convertTypes]
  }
  if(token.toUpperCase() === 'LRC'){
    types = [...types,...lrcTypes]
  }
  types = [...types,...othersTypes]
}

function ListBlock(props) {
  const {transactions:list}= props
  const statusChange = (e)=>{
    list.filtersChange({status:e.targe.value})
  }
  const typeChange = (e)=>{
    list.filtersChange({type:e.targe.value})
  }
  const types = getTypes('LRC')
  return (
    <div>
        <div className="card-header bordered">
            <h4>Transactions</h4>
            <div className="form-inline form-dark">
                <span>
                  <Select
                      allowClear
                      defaultValue=""
                      placeholder={intl.get('txs.status')}
                      className="form-inline form-inverse"
                      optionFilterProp="children"
                      dropdownMatchSelectWidth={false}
                      onChange={statusChange}
                      onFocus={()=>{}}
                      onBlur={()=>{}}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('txs.status')}</Select.Option>
                    <Select.Option value="pending">{intl.get('txs.status_pending')}</Select.Option>
                    <Select.Option value="success">{intl.get('txs.status_success')}</Select.Option>
                    <Select.Option value="failed">{intl.get('txs.status_failed')}</Select.Option>
                  </Select>
                </span>
                <span>
                  <Select
                    allowClear
                    onChange={typeChange}
                    dropdownMatchSelectWidth={false}
                    placeholder={intl.get('txs.type')}
                    className="form-inline form-inverse"
                  >
                    {
                      types.map((item,index)=>
                        <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                      )
                    }
                  </Select>
                </span>
            </div>
        </div>
        <div style={{height: "100%", overflow: "hidden", padding:"0 0 60px"}}>
            <div className="content-scroll">
                <table className="table table-striped table-dark text-center text-left-col1 text-left-col2 text-right-col4 text-right-last">
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
                        {
                          list.loading &&
                          <tr>
                              <td colSpan="100"><Spin/></td>
                          </tr>
                        }
                        {
                          list.items.map((item,index)=>
                              <tr key={index}>
                                  <td>Receive LRC</td>
                                  <td>3 hour ago</td>
                                  <td>5241856</td>
                                  <td className="text-right text-success">+100.00 LRC</td>
                                  <td className="text-center"><i className="text-color-dark icon-success"></i></td>
                                  <td>→ 0xf1d48f1aaeba93</td>
                              </tr>
                            )
                        }
                        {
                          !list.loading && list.items.length === 0 &&
                          <tr>
                              <td colSpan="100">{intl.get('txs.no_txs')}</td>
                          </tr>
                        }
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
