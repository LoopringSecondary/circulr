import React from 'react';
import { Input,Button } from 'antd';
import * as fm from 'LoopringJS/common/formatter'
import Currency from 'modules/settings/CurrencyContainer'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import intl from 'react-intl-universal';
import Notification from 'LoopringUI/components/Notification'

function TransferConfirm(props) {
  const {transferConfirm, marketcap, wallet} = props
  const {tx, extraData} = transferConfirm

  const worth = (
    <span>
      <Currency />
      {tokenFormatter.getWorthBySymbol({prices:marketcap.items, symbol:extraData.tokenSymbol, amount:extraData.amount})}
    </span>
  )

  const signResultHandler = (response) => {
    let result = {...tx, extraData}
    if(response.error) {
      result = {...result, error:response.error.message}
      Notification.open({
        message:intl.get('token.send_failed'),
        description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
        type:'error'
      })
    } else {
      // extraData.txHash = response.result
      // window.STORAGE.wallet.setWallet({address:window.WALLET.getAddress(),nonce:tx.nonce})
      // window.RELAY.account.notifyTransactionSubmitted({rawTx,txHash:response.result,from:window.WALLET.getAddress()});
      // const worth = `${fm.getDisplaySymbol(window.STORAGE.settings.get().preference.currency)}${accMul(result.extraData.amount, result.extraData.price).toFixed(2)}`
      // Notification.open({
      //   message:intl.get('token.transfer_succ_notification_title'),
      //   description:intl.get('token.result_transfer_success', {amount:result.extraData.amount, token:result.extraData.tokenSymbol}),
      //   type:'success',
      //   actions:(
      //     <div>
      //       <Button className="alert-btn mr5" onClick={viewInEtherscan.bind(this, extraData.txHash)}>{intl.get('token.transfer_result_etherscan')}</Button>
      //     </div>
      //   )
      // })
    }
  }

  const handelSubmit = ()=>{
    //modal.showLoading({id:'token/transfer/preview'})
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
          duration:0,
          message: intl.get('trade.to_confirm_title'),
          description: toConfirmWarn,
          type: 'info'
        })
      }
      if(wallet.account) {
        wallet.account.signEthereumTx({tx, cb:signResultHandler})
      } else if(window.web3) {// MetaMask

      } else {

      }


      //return window.WALLET.sendTransaction(tx)
    }).then(({response,rawTx})=>{
      if(response.error) {

      } else {

      }
      // modal.hideLoading({id:'token/transfer/preview'})
      // modal.hideModal({id:'token/transfer/preview'})
      // modal.hideModal({id: 'token/transfer'})
      // modal.showModal({id:'token/transfer/result', result})
    }).catch(e=>{
      // console.error(e)
      // result = {...result, error:e.message}
      // modal.hideLoading({id:'token/transfer/preview'})
      // modal.hideModal({id:'token/transfer/preview'})
      // modal.hideModal({id: 'token/transfer'})
      // // modal.showModal({id:'token/transfer/result', result})
      // Notification.open({
      //   message:intl.get('token.send_failed'),
      //   description:intl.get('token.result_failed', {do:intl.get('token.send_title'), amount:result.extraData.amount, token:result.extraData.tokenSymbol, reason:result.error}),
      //   type:'error'
      // })
    })
  }

  return (
    <div>
        <div className="modal-header text-dark"><h3>发送 {extraData.tokenSymbol}</h3></div>
        <div className="pd-lg text-center text-color-dark-1">
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
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg">不，取消发送</Button></div>
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg">马上发送</Button></div>
          </div>
        </div>
    </div>
  )
}
export default TransferConfirm
