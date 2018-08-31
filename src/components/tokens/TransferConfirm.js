import React from 'react';
import { Form,Button } from 'antd';
import * as fm from 'LoopringJS/common/formatter'
import Currency from 'modules/settings/CurrencyContainer'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import intl from 'react-intl-universal';


function TransferConfirm(props) {
  const {transferConfirm, marketcap, dispatch} = props
  const {tx, extraData={}} = transferConfirm
  if(!tx){return null}
  const worth = (
    <span>
      { marketcap && extraData.amount > 0 &&
        <span>
          <Currency />
          {tokenFormatter.getWorthBySymbol({prices:marketcap.items, symbol:extraData.tokenSymbol, amount:extraData.amount})}
        </span>
      }
    </span>
  );
  const handleSubmit =  () => {
    dispatch({type: 'layers/hideLayer', payload: {id: 'transferConfirm'}});
    dispatch({type: 'layers/showLayer', payload: {id: 'transferSign',tx,token:extraData.tokenSymbol,amount:extraData.amount}});
  };

  const cancel = () => {
    dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
  }

  return (
    <div className="pd-lg">
        <div className="sidebar-header">
          <h3>{intl.get('common.send')} {extraData.tokenSymbol}</h3>
        </div>
        <div className="text-center pt15 pb15">
	        <i className={`icon-${extraData.tokenSymbol} icon-token-md`}></i>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>{intl.get('common.amount')}</span><div className="text-lg-control break-word text-right">{worth} ≈ {`${extraData.amount}${extraData.tokenSymbol}`}</div></li>
            <li><span>{intl.get('transfer.from')}</span><div className="text-lg-control break-word text-right">{extraData.from}</div></li>
            <li><span>{intl.get('transfer.to')}</span><div className="text-lg-control break-word text-right">{extraData.to}</div></li>
            <li>
              <span>{intl.get('transfer.gas')}</span>
              <span className="text-right">{extraData.gas} ETH<br/>
                <small className="text-color-dark-2">{`Gas(${fm.toNumber(tx.gasLimit).toString(10)}) * Gas Price(${fm.toNumber(tx.gasPrice)/(1e9).toString(10)} Gwei)`}</small>
              </span>
            </li>
        </ul>
      <div className="col-row mt15">
        <div className="col2-2">
          <div className="item"><Button className="btn-block btn-o-dark btn-xlg" onClick={cancel}>{intl.get('actions.transfer_cancel')}</Button></div>
          <div className="item"><Button className="btn-block btn-o-dark btn-xlg" onClick={handleSubmit}>{intl.get('actions.transfer_send')}</Button></div>
        </div>
      </div>
    </div>
  )
}
export default Form.create() (TransferConfirm)
