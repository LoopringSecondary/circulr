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

  // const handelSubmit = () => {
  //   extraData.pageFrom = "Transfer"
  //   let result = {...tx, extraData}
  //   //To test Ledger
  //   //tx.chainId = 1
  //   window.RELAY.account.getNonce(wallet.address).then(res => {
  //     let nonce  = res.result;
  //     tx.nonce = fm.toHex(nonce)
  //     let toConfirmWarn = '';
  //     if (wallet.wallet === 'Ledger') {
  //       toConfirmWarn = intl.get('notifications.message.confirm_warn_ledger')
  //     }
  //     if (wallet.wallet === 'MetaMask') {
  //       toConfirmWarn = intl.get('notifications.message.confirm_warn_metamask')
  //     }
  //     if (wallet.wallet === 'Trezor') {
  //       toConfirmWarn = intl.get('notifications.message.confirm_warn_trezor')
  //     }
  //     if (toConfirmWarn) {
  //       Notification.open({
  //         message: intl.get('notifications.title.to_confirm'),
  //         description: toConfirmWarn,
  //         type: 'info'
  //       })
  //     }
  //     const signTx = account.signEthereumTx(tx);
  //     return window.ETH.sendRawTransaction(signTx)
  //   }).then(response=>{
  //     if(response.error) {
  //       console.error("Error:", response.error)
  //       result = {...result, error:response.error.message}
  //       Notification.open({
  //         message:intl.get('notifications.title.send_failed'),
  //         description:intl.get('notifications.message.send_failed', {do:intl.get('common.send'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
  //         type:'error'
  //       })
  //     } else {
  //       extraData.txHash = response.result
  //       window.RELAY.account.notifyTransactionSubmitted({tx,txHash:response.result,from:wallet.address});
  //       Notification.open({
  //         message:intl.get('notifications.title.send_succ'),
  //         description:intl.get('notifications.message.send_succ', {amount:result.extraData.amount, token:result.extraData.tokenSymbol}),
  //         type:'success',
  //         actions:(
  //           <div>
  //             <Button className="alert-btn mr5" onClick={viewInEtherscan.bind(this, extraData.txHash)}>{intl.get('actions.view_result_etherscan')}</Button>
  //           </div>
  //         )
  //       })
  //     }
  //     // modal.hideLoading({id:'token/transfer/preview'})
  //     dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
  //     dispatch({type: 'layers/hideLayer', payload: {id:'transfer'}})
  //     dispatch({type: 'transfer/reset'})
  //   }).catch(e=>{
  //     console.error("Error:", e)
  //     result = {...result, error:e.message}
  //     dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
  //     dispatch({type: 'layers/hideLayer', payload: {id:'transfer'}})
  //     dispatch({type: 'transfer/reset'})
  //     Notification.open({
  //       message:intl.get('notifications.title.send_failed'),
  //       description:intl.get('notifications.message.send_failed', {do:intl.get('common.send'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
  //       type:'error'
  //     })
  //   })
  // }

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
