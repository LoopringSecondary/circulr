import React from 'react';
import { Form,Select,Spin } from 'antd';
import intl from 'react-intl-universal';
import {TxFm,getTypes} from 'modules/transactions/formatters';
import {getShortAddress} from 'modules/formatter/common';
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
                <Spin spinning={list.loading}>
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
                          </tr>
                      </thead>
                      <tbody>
                          {
                            list.items.map((item,index)=>{
                              const txFm = new TxFm(item)
                              return (
                                <tr key={index}>
                                  <td className="text-left">{txFm.getType()}</td>
                                  <td className="text-left">{renders.createTime(txFm)}</td>
                                  <td className="text-left">{item.blockNumber}</td>
                                  <td className="text-right">{renders.value(txFm)}</td>
                                  <td className="text-right">{txFm.getGas()} ETH</td>
                                  <td className="text-center">{renders.status(txFm)}</td>
                                  <td className="text-right">{renders.txHash(txFm)}</td>
                                </tr>
                              )
                            })
                          }
                          {!list.loading && list.items.length === 0 &&
                            <tr><td colSpan="100" className="text-center">{intl.get('txs.no_txs')}</td></tr>
                          }
                      </tbody>
                  </table>
                </Spin>
            </div>
        </div>
    </div>
  )
}
export const renders = {
  createTime:(fm) => (
    <span>{fm.getCreateTime()}</span>
  ),
  txHash:(fm) => (
    <span
       onCopy={null}
       onClick={null}
    >
      <span className="text-primary">{getShortAddress(fm.tx.txHash)}</span>
    </span>
  ),
  value:(fm)=>{
    return (
      <div>
        {
          fm.getSide()==='income' &&
          <span className="text-success">+ {fm.getValue()} {fm.tx.symbol}</span>
        }
        {
          fm.getSide()==='outcome' &&
          <span className="text-error">- {fm.getValue()} {fm.tx.symbol}</span>
        }
      </div>
    )
  },
  status:(fm)=>{
    return (
      <div>
        { fm.tx.status === 'success' && <i className="icon-success"></i> }
        { fm.tx.status === 'failed' && <i className="icon-warning"></i> }
        { fm.tx.status === 'pending' && <i className="icon-clock"></i> }
      </div>
    )
  },
}
