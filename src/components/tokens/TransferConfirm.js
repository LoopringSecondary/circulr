import React from 'react';
import { Form,Input,Button } from 'antd';
import * as fm from 'LoopringJS/common/formatter'
import Currency from 'modules/settings/CurrencyContainer'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import intl from 'react-intl-universal';
import Notification from 'LoopringUI/components/Notification'

function TransferConfirm(props) {
  const {transferConfirm, marketcap, wallet, dispatch} = props
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
  )

  const viewInEtherscan = (txHash) => {
    window.open(`https://etherscan.io/tx/${txHash}`,'_blank')
  }

  const handelSubmit = () => {
    //modal.showLoading({id:'token/transfer/preview'})
    const account = wallet.account || window.account
    if(!account || wallet.unlockType === 'address') {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'to unlock'
      });
      return
    }
    extraData.pageFrom = "Transfer"
    let result = {...tx, extraData}
    //To test Ledger
    //tx.chainId = 1
    window.STORAGE.wallet.getNonce(wallet.address).then(nonce => {
      tx.nonce = fm.toHex(nonce)
      let toConfirmWarn = '';
      if (wallet.wallet === 'Ledger') {
        toConfirmWarn = intl.get('trade.confirm_warn_ledger')
      }
      if (wallet.wallet === 'MetaMask') {
        toConfirmWarn = intl.get('trade.confirm_warn_metamask')
      }
      if (wallet.wallet === 'Trezor') {
        toConfirmWarn = intl.get('trade.confirm_warn_trezor')
      }
      if (toConfirmWarn) {
        Notification.open({
          message: intl.get('trade.to_confirm_title'),
          description: toConfirmWarn,
          type: 'info'
        })
      }
      const signTx = account.signEthereumTx(tx);
      return window.ETH.sendRawTransaction(signTx)
    }).then(response=>{
      if(response.error) {
        console.error("Error:", response.error)
        result = {...result, error:response.error.message}
        Notification.open({
          message:intl.get('token.send_failed'),
          description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
          type:'error'
        })
      } else {
        extraData.txHash = response.result
        window.STORAGE.wallet.setWallet({address:wallet.address, nonce:tx.nonce})
        window.RELAY.account.notifyTransactionSubmitted({tx,txHash:response.result,from:wallet.address});
        Notification.open({
          message:intl.get('token.transfer_succ_notification_title'),
          description:intl.get('token.result_transfer_success', {amount:result.extraData.amount, token:result.extraData.tokenSymbol}),
          type:'success',
          actions:(
            <div>
              <Button className="alert-btn mr5" onClick={viewInEtherscan.bind(this, extraData.txHash)}>{intl.get('token.transfer_result_etherscan')}</Button>
            </div>
          )
        })
      }
      // modal.hideLoading({id:'token/transfer/preview'})
      dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
      dispatch({type: 'layers/hideLayer', payload: {id:'transfer'}})
      dispatch({type: 'transfer/reset'})
    }).catch(e=>{
      console.error("Error:", e)
      result = {...result, error:e.message}
      dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
      dispatch({type: 'layers/hideLayer', payload: {id:'transfer'}})
      dispatch({type: 'transfer/reset'})
      Notification.open({
        message:intl.get('token.send_failed'),
        description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
        type:'error'
      })
    })
  }

  const cancel = () => {
    dispatch({type: 'layers/hideLayer', payload: {id:'transferConfirm'}})
  }

  return (
    <div className="pd-lg">
        <div className="sidebar-header">
          <h3>发送 {extraData.tokenSymbol}</h3>
        </div>
        <div>
	        <i className="icon-ETH icon-token-md"></i>
          <div className="blk-sm"></div>
	        <h2>{`${extraData.amount}${extraData.tokenSymbol}`}</h2>
	        <span>{worth}</span>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>发送方</span><div className="text-lg-control break-word text-right">{extraData.from}</div></li>
            <li><span>发送到</span><div className="text-lg-control break-word text-right">{extraData.to}</div></li>
            <li>
              <span>邮费</span>
              <span className="text-right">{extraData.gas} ETH<br/>
                <small className="text-color-dark-2">{`Gas(${fm.toNumber(tx.gasLimit).toString(10)}) * Gas Price(${fm.toNumber(tx.gasPrice)/(1e9).toString(10)} Gwei)`}</small>
              </span>
            </li>
        </ul>
        <div className="col-row">
          <div className="col2-2">
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg" onClick={cancel}>不，取消发送</Button></div>
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit}>马上发送</Button></div>
          </div>
        </div>
    </div>
  )
}
export default Form.create() (TransferConfirm)
