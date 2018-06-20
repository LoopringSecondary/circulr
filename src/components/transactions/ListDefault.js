import React from 'react';
import {Icon, Select, Spin} from 'antd';
import intl from 'react-intl-universal';
import {getTypes, TxFm} from 'modules/transactions/formatters';
import {getShortAddress} from 'modules/formatter/common';
import {connect} from "dva";
import config from '../../common/config'
import {toBig, toHex, toNumber} from "LoopringJS/common/formatter";
import Notification from '../../common/loopringui/components/Notification'

const Option = Select.Option;

 function ListTransaction(props) {
  const {latestTransaction: list,gasPrice,wallet,dispatch} = props;
  const statusChange = (value) => {
    dispatch({type:"sockets/filtersChange",payload:{id:"latestTransaction",filters:{status: value}}})
  };
  const typeChange = (value) => {
    dispatch({type:"sockets/filtersChange",payload:{id:"latestTransaction",filters:{type: value}}})
  };

  const getGasPrice = (txGas) => {
    txGas  = toBig(txGas).div(1e9).toNumber() +1;
    return toHex(toBig(Math.max(txGas,gasPrice)).times(1e9))
  };

  const resendTx  = (item)  => {
    if(wallet.unlockType && wallet.unlockType !== 'locked') {
      window.RELAY.account.getPendingRawTxByHash(item.txHash).then((res) => {
        if (!res.error) {
          const tx = res.result;
          tx.gasPrice = getGasPrice(tx.gasPrice);
          tx.data = tx.input;
          tx.gasLimit = tx.gas;
          tx.chainId = config.getChainId();
          dispatch({type: 'layers/showLayer', payload: {id: 'resend', tx}})
        } else {
          Notification.open({
            type: 'error',
            message: intl.get('txs.can_not_resend'),
            description: intl.get('txs.not_detail')
          });
        }
      })
    }else{
      Notification.open({type:'warning',message:intl.get('notifications.title.unlock_first')})
    }
  };

  const cancelTx = (item) => {
    if(wallet.unlockType && wallet.unlockType !== 'locked'){
      const tx = {
        to:window.WALLET.address,
        value:"0x0",
        data:'0x',
        chainId:config.getChainId(),
        gasLimit:'0x5208',
        gasPrice:toHex(toBig(gasPrice).times(1e9)),
        nonce:toHex(toNumber(item.nonce))
      };
      window.RELAY.account.getPendingRawTxByHash(item.txHash).then((res) => {
        if(!res.error){
          tx.gasPrice = getGasPrice(res.result.gasPrice)
        }
        dispatch({type:'layers/showLayer',payload:{id:'cancel',tx}})
      })
    }else {
      Notification.open({type:'warning',message:intl.get('notifications.title.unlock_first')})
    }
  };

  const token = list.filters.token || 'LRC';
  const types = getTypes(token)
  return (
    <div>
      <div className="card-header bordered">
        <h4>{intl.get('tx.title')}</h4>
        <div className="form-inline form-dark">
                <span>
                  <Select
                    defaultValue=""
                    onChange={statusChange}
                    placeholder={intl.get('tx.status')}
                    dropdownMatchSelectWidth={false}
                    className="form-inline form-inverse"
                  >
                    <Select.Option value="">{intl.get('tx_status.all')}</Select.Option>
                    <Select.Option value="pending">{intl.get('tx_status.pending')}</Select.Option>
                    <Select.Option value="success">{intl.get('tx_status.success')}</Select.Option>
                    <Select.Option value="failed">{intl.get('tx_status.failed')}</Select.Option>
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
                      types.map((item, index) =>
                        <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                      )
                    }
                  </Select>
                </span>
        </div>
      </div>
      <div style={{height: "100%", overflow: "hidden", padding: "0 0 60px"}}>
        <div className="content-scroll">
          <Spin spinning={list.loading}>
            <table className="table table-hover table-striped table-dark text-center">
              <thead>
              <tr>
                <th className="text-left">{intl.get('tx.type')}</th>
                <th className="text-left">{intl.get('tx.gas')}</th>
                {false && <th className="text-left">{intl.get('tx.block')}</th>}
                <th className="text-left">{intl.get('tx.nonce')}</th>
                {false && <th className="text-left">{intl.get('tx.txHash')}</th>}
                <th className="text-left">{intl.get('tx.created')}</th>
                <th className="text-left">{intl.get('tx.status')}</th>
              </tr>
              </thead>
              <tbody>
              {
                list.items.map((item, index) => {
                  const txFm = new TxFm(item);
                  const actions = {
                    gotoDetail: () => props.dispatch({type: 'layers/showLayer', payload: {id: 'txDetail', tx: item}}),
                    toResend:() => resendTx(item),
                    toCancel: () => cancelTx(item)
                  };
                  return (
                    <tr key={index} className="cursor-pointer" onClick={actions.gotoDetail}>
                      <td className="text-left">{renders.type(txFm)}</td>
                      <td className="text-left">{renders.gas(txFm)}</td>
                      {false && <td className="text-left">{item.blockNumber}</td>}
                      <td className="text-left">{item.nonce}</td>
                      {false && <td className="text-left">{renders.txHash(txFm, actions)}</td>}
                      <td className="text-left">{renders.createTime(txFm)}</td>
                      <td className="">{renders.status(txFm,actions,index)}</td>
                    </tr>
                  )
                })
              }
              {list.items.length === 0 &&
              <tr>
                <td colSpan="100" className="text-center">{intl.get('common.list.no_data')}</td>
              </tr>
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
  createTime: (fm) => (
    <div>{fm.getCreateTime()}</div>
  ),
  txHash: (fm, actions) => (
    <span
      onCopy={null}
      onClick={null}
    >
      <span className="" onClick={actions && actions.gotoDetail}>{getShortAddress(fm.tx.txHash)}</span>
    </span>
  ),
  type: (fm) => {
    const side = fm.getSide()
    return (
      <div>
        {fm.getType((side === 'in' || side === 'out') && fm.getValue())}
        {null && side && side.toLowerCase() === 'in' &&
          <span className='text-success ml5 fs12'><Icon type="plus-circle-o"/></span>
        }
        {null && side && side.toLowerCase() === 'out' &&
          <span className='text-error ml5 fs12'><Icon type="minus-circle-o"/></span>
        }
      </div>
    )
  },
  gas: (fm) => {
    const type = fm.tx.type
    return (
      <div>
        {fm.getGas()} ETH
        {(type === 'sell' || type === 'buy' || type === 'lrc_fee' || type === 'lrc_reward') &&
          <span className={`color-white-3 d-inline-block ml5`}>
            (Miner Paid)
          </span>
        }
      </div>
    )
  },
  status: (fm,actions,index) => {
    return (
      <div>
        {fm.tx.status === 'success' && <i className="icon-success"></i>}
        {fm.tx.status === 'failed' && <i className="icon-warning"></i>}
        {fm.tx.status === 'pending' && <i className="icon-clock"></i>}
        {fm.tx.status === 'pending' &&
          <span>
            <span className="text-primary ml10" onClick={(e) => {e.stopPropagation();actions.toResend()}}>{intl.get('tx_resend.action_resend')}</span>
            <span className="text-primary ml5" onClick={(e) => {e.stopPropagation();actions.toCancel()}}>{intl.get('common.cancel')}</span>
          </span>
        }
      </div>
    )
  },
}

function mapStateToProps(state) {
   return {
     gasPrice:state.gas.gasPrice.estimate,
     wallet:state.wallet,
     latestTransaction:state.sockets.latestTransaction,
   }
}

export default connect(mapStateToProps)(ListTransaction)

