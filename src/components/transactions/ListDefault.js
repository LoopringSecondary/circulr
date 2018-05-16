import React from 'react';
import { Form,Select,Spin } from 'antd';
import intl from 'react-intl-universal';
import {getTypes} from 'modules/transactions/formatters';
import {getShortAddress,getFormattedTime} from 'modules/formatter/common';
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
                <table className="table table-hover table-striped table-dark text-center">
                    <thead>
                        <tr>
                            <th className="text-left">Type</th>
                            <th className="text-left">Created</th>
                            <th className="text-left">Block</th>
                            <th className="text-right">Value</th>
                            <th className="text-right">Gas</th>
                            <th className="text-center">Status</th>
                            <th className="text-right">TxHash</th>
                            <th hidden className="text-right">Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                          list.items.map((item,index)=>
                            <tr key={index}>
                              <td className="text-left">{renders.type(item,index)}</td>
                              <td className="text-left">{renders.createTime(item,index)}</td>
                              <td className="text-left">{item.block || 5241856}</td>
                              <td className="text-right">{renders.value(item,index)}</td>
                              <td className="text-right">{renders.gas(item,index)}</td>
                              <td className="text-center">{renders.status(item,index)}</td>
                              <td className="text-right">{renders.txHash(item,index)}</td>
                              <td hidden className="text-right">{renders.miner(item,index)}</td>
                            </tr>
                          )
                        }
                        {list.loading &&
                          <tr><td colSpan="100" className="text-center"><Spin/></td></tr>
                        }
                        {!list.loading && list.items.length === 0 &&
                          <tr><td colSpan="100" className="text-center">{intl.get('txs.no_txs')}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
export const renders = {
  createTime:(item) => (
    <span>{getFormattedTime(item.createTime,'MM-DD HH:SS')}</span>
  ),
  txHash:(item, index) => (
    <span
       onCopy={null}
       onClick={null}
    >
      <span className="text-primary">{getShortAddress(item.txHash)}</span>
    </span>
  ),
  type:(item)=>{
    return (
      <div>{item.type.toUpperCase()} {item.symbol}</div>
    )
  },
  value:(item)=>{
    return (
      <div>
        {
          item.type==='receive' &&
          <span className="text-success">+ {item.value} {item.symbol}</span>
        }
        {
          item.type==='send' &&
          <span className="text-error">- {item.value} {item.symbol}</span>
        }
      </div>
    )
  },
  gas:(item)=>{
    return (
      <div>
        - {item.gas_used} ETH
      </div>
    )
  },
  miner:(item,index)=>{
    return (
      <span>
       {index < 3 && <span className="">Miner</span>}
      </span>

    )
  },
  status:(item)=>{
    return (
      <div>
        { item.status === 'success' && <i className="icon-success"></i> }
        { item.status === 'failed' && <i className="icon-warning"></i> }
        { item.status === 'pending' && <i className="icon-clock"></i> }
      </div>
    )
  },
}
