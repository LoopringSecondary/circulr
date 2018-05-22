import React from 'react';
import { Input,Button } from 'antd';
import {toBig, toHex, clearHexPrefix} from 'LoopringJS/common/formatter'
import config from 'common/config'
import intl from 'react-intl-universal';
import * as datas from 'common/config/data'
import eachLimit from 'async/eachLimit';
import * as orderFormatter from 'modules/orders/formatters'
import Notification from 'LoopringUI/components/Notification'
import {createWallet} from 'LoopringJS/ethereum/account';
import * as uiFormatter from 'modules/formatter/common'
import * as fm from 'LoopringJS/common/formatter'

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, placeOrder, settings, balance, wallet, marketcap, pendingTx, modals} = props
  let {side, pair, tradeInfo, order} = placeOrderConfirm
  let {unsigned, signed} = placeOrder
  let {price, amount, total, validSince,validUntil, marginSplit, lrcFee, warn} = tradeInfo;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];
  let sell = '', buy = ''
  if(side === 'buy') {
    sell = token2
    buy = token
  } else {
    sell = token
    buy = token2
  }
  let actualSigned = []
  if(order.owner) { // verified
    actualSigned = signed.filter(item => item !== undefined)
  }

  async function sign(item, index, e) {
    e.preventDefault()
    const account = wallet.account || window.account
    if(item.type === 'order') {
      const signedOrder = await account.signOrder(item.data)
      signedOrder.powNonce = 100;
      signed[index] = {type: 'order', data:signedOrder};
    } else {
      signed[index] = {type: 'tx', data: await account.signEthereumTx(item.data)};
    }
    placeOrder.signedChange({signed})
  }

  function handelSubmit() {
    if(!order || (unsigned.length > 0 && unsigned.length !== actualSigned.length)) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'Not Signed'
      });
      return
    }
    eachLimit(signed, 1, async function (tx, callback) {
      if(tx.type === 'tx') {
        const response = await window.ETH.sendRawTransaction(tx.data)
        // console.log('...tx:', response)
        if (response.error) {
          callback(response.error.message)
        } else {
          const txHash = response.response.result
          const rawTx = response.rawTx
          window.STORAGE.wallet.setWallet({address: wallet.address, nonce: tx.nonce});
          window.RELAY.account.notifyTransactionSubmitted({txHash: txHash, rawTx, from: wallet.address});
          callback()
        }
      } else {
        const response = await window.RELAY.order.placeOrder(tx.data)
        // console.log('...submit order :', response)
        if (response.error) {
          Notification.open({
            message: intl.get('trade.place_order_failed'),
            type: "error",
            description: response.error.message
          })
          callback(response.error.message)
        } else {
          callback()
        }
      }

    }, function (error) {
      //TODO
      //_this.reEmitPendingTransaction();
      if(error){
        Notification.open({
          message: intl.get('trade.place_order_failed'),
          type: "error",
          description: error.message
        });
      }else {
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
        openNotification(balanceWarn);
        updateOrders();
      }
      // _this.setState({loading:false});
      modals.hideModal({id: 'placeOrderConfirm'});
    });
  }

  function updateOrders() {
    //TODO
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'orders/filtersChange',
    //   payload: {
    //     id: 'orders/trade',
    //   }
    // })
  }

  function toUnlock() {
    if(wallet && balance && marketcap) { // just unlocked, to verify
      const totalWorth = orderFormatter.calculateWorthInLegalCurrency(marketcap.items, token2, tradeInfo.total)
      if(!totalWorth.gt(0)) {
        Notification.open({
          message:intl.get('trade.send_failed'),
          description:intl.get('trade.failed_fetch_data'),
          type:'error'
        })
        placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
        return
      }
      let allowed = false
      let currency = 'USD';// TODO settings.preference.currency
      let priceSymbol = fm.getDisplaySymbol(currency)
      if(currency === 'USD') {
        priceSymbol = '100' + priceSymbol
        if(totalWorth.gt(100)) {
          allowed = true
        }
      } else {
        priceSymbol = '500' + priceSymbol
        if(totalWorth.gt(500)) {
          allowed = true
        }
      }
      if(!allowed) {
        Notification.open({
          message:intl.get('trade.not_allowed_place_order_worth_title'),
          description:intl.get('trade.not_allowed_place_order_worth_content', {worth: priceSymbol}),
          type:'error'
        })
        placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
        return
      }
      orderFormatter.tradeVerification(balance.items, wallet, tradeInfo, sell, buy, pendingTx.items).then(result=>{
        if(tradeInfo.error) {
          tradeInfo.error.map(item=>{
            Notification.open({
              message: intl.get('trade.send_failed'),
              description: intl.get('trade.eth_is_required', {required:item.value.required}),
              type:'error',
            })
          })
          placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
          return
        }

        //TODO MOCK
        const test = new Array()
        test.push({type:"AllowanceNotEnough", value:{symbol:'LRC', allowance:12, required:123456}})
        test.push({type:"AllowanceNotEnough", value:{symbol:'WETH', allowance:12, required:123456}})
        tradeInfo.warn = test

        return orderFormatter.signOrder(tradeInfo, wallet)
      }).then(signResult => {
        order = signResult.order
        signed = signResult.signed
        unsigned = signResult.unsigned
        placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
      })
    }
  }

  const ActionItem = (item) => {
    return (
      <div>
        <Button className="alert-btn mr5" onClick={() => modals.showModal({
          id: 'receive',
          symbol: item.value.symbol.toUpperCase()
        })}> {intl.get('order.receive_token', {token: item.value.symbol.toUpperCase()})}</Button>
        {item.value.symbol.toUpperCase() !== 'WETH' && item.value.symbol.toUpperCase() !== 'BAR' && item.value.symbol.toUpperCase() !== 'FOO' &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath(`/trade/${item.value.symbol.toUpperCase()}-WETH`)}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {(item.value.symbol.toUpperCase() === 'BAR' || item.value.symbol.toUpperCase() === 'FOO') &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath('/trade/FOO-BAR')}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {item.value.symbol.toUpperCase() === 'WETH' &&
        <Button className="alert-btn mr5" onClick={() => modals.showModal({
          id: 'convert',
          item: {symbol: 'ETH'},
          showFrozenAmount: true
        })}> {intl.get('order.convert_token', {token: item.value.symbol.toUpperCase()})}</Button>}
      </div>
    )
  };

  const openNotification = (warn) => {
    const args = {
      message: intl.get('order.place_success'),
      description: intl.get('order.place_success_tip'),
      duration: 3,
      type: 'success',
    };
    Notification.open(args);
    warn.forEach((item) => {
      Notification.open({
        message: intl.get('order.place_warn'),
        description: intl.get('order.balance_not_enough', {
          token: item.value.symbol,
          amount: window.uiFormatter.getFormatNum(item.value.required)
        }),
        type: 'warning',
        actions: ActionItem(item)
      })
    })
  };

  return (
    <div>
        <div className="modal-header text-dark"><h3>{intl.get(`order.${side}`)} {token}</h3></div>
        <div className="pd-lg text-center text-color-dark">
	        <h5>{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
	        <h2>{intl.get('global.amount', {amount:amount.toString(10)})} {token}</h2>
	        <small className="text-color-dark-1">
            {uiFormatter.getFormatNum(price.toString(10))}
            x {intl.get('global.amount', {amount:amount.toString(10)})} = {total.toString(10)} {token2}
          </small>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>{`${uiFormatter.getFormatNum(lrcFee)} LRC`}</span></li>
            <li><span>分润比例</span><span>{`${marginSplit} %`}</span></li>
            <li><span>订单生效时间</span><span>{uiFormatter.getFormatTime(validSince * 1e3)}</span></li>
            <li><span>订单失效时间</span><span>{uiFormatter.getFormatTime(validUntil * 1e3)}</span></li>
          {
            unsigned.length !== actualSigned.length && unsigned.map((item, index)=>{
              const signedItem = signed[index]
              return (
                <li key={index} className="d-block">
                  {!signedItem && <Button className="btn-block btn-o-dark btn-xlg" onClick={sign.bind(this, item, index)}>Sign {item.type === 'order' ? 'Order' : 'Tx'}</Button>}
                  {signedItem && 'Signed'}
                </li>
              )
            })
          }
          {
            null &&
            <li className="d-block">
              <b><i className="icon-chevron-up"></i>签名信息</b>
              <div className="blk"></div>
              <div className="col-row form-dark">
                <div className="col2-2 d-flex justify-space-between">
                  <div className="item">
                    <p className="text-color-dark-2">未签名的订单</p>
                    <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} value={JSON.stringify(order)}/>
                  </div>
                  <div className="item">
                    <p className="text-color-dark-2">签名的订单</p>
                    <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} />
                  </div>
                </div>
                <div className="blk"></div>
                <div className="text-center text-color-dark-3">提交订单是免费的，不需要消耗Gas</div>
              </div>
            </li>
          }
        </ul>
      {order.owner &&
        <Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit}>提交订单</Button>
      }
      {!order.owner &&
        <div>
          <Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit}>Unlock Your Wallet</Button>
          <div>* You should unlock your wallet first, but your order may not available after verification </div>
        </div>
      }
    </div>
  )
}
export default PlaceOrderConfirm
