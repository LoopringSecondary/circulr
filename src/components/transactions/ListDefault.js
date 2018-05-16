import React from 'react';
import { Form,Select,Spin } from 'antd';
import intl from 'react-intl-universal';
import {getTypes} from 'modules/transactions/formatters';
const Option = Select.Option;

export default function ListTransaction(props) {
  console.log('ListTransaction component render')
  const {transaction:list}= props
  const statusChange = (value)=>{
    list.filtersChange({status:value})
  }
  const typeChange = (value)=>{
    list.filtersChange({type:value})
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
                      onChange={statusChange}
                      placeholder={intl.get('txs.status')}
                      dropdownMatchSelectWidth={false}
                      className="form-inline form-inverse"
                      onFocus={()=>{}}
                      onBlur={()=>{}}
                      optionFilterProp="children"
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
                    defaultValue=""
                    onChange={typeChange}
                    placeholder={intl.get('txs.type')}
                    dropdownMatchSelectWidth={false}
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
                <table className="table table-hover table-striped table-dark text-center text-left-col1 text-left-col2 text-right-col4 text-right-last">
                    <thead>
                        <tr>
                            <th>Hash</th>
                            <th>Type</th>
                            <th>Age</th>
                            <th>Gas</th>
                            <th className="text-right">Value</th>
                            <th className="text-center">status</th>
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
                                  <td>{item.txHash}</td>
                                  <td>{item.type} {item.symbol}</td>
                                  <td>{item.createTime}</td>
                                  {
                                    false && <td className="text-right text-down">-100.00 LRC</td>
                                  }
                                  <td className="text-right text-success">
                                    {item.value} {item.symbol}
                                  </td>
                                  <td className="text-right">
                                    {item.gas_used} ETH
                                  </td>
                                  <td className="text-center">
                                    {
                                      false && <i className="text-color-dark icon-success"></i>
                                    }
                                    {item.status}
                                  </td>
                              </tr>
                            )
                        }
                        {
                          !list.loading && list.items.length === 0 &&
                          <tr>
                              <td colSpan="100">{intl.get('txs.no_txs')}</td>
                          </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
export const renders = {

}
