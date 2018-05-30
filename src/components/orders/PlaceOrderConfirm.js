import React from 'react';
import { Input,Button,Icon } from 'antd';
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
import QRCode from 'qrcode.react';
import Alert from 'LoopringUI/components/Alert'

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, placeOrder, settings, balance, wallet, marketcap, pendingTx, dispatch} = props
  let {side, pair, tradeInfo, order} = placeOrderConfirm || {}
  let {unsigned, signed, confirmButtonState} = placeOrder || {}
  let {price, amount, total, validSince,validUntil, marginSplit, lrcFee, warn, orderType} = tradeInfo || {};

  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'
  const unsignedOrder = unsigned.find(item => item.type === 'order')
  const signedOrder = signed.find(item => item && item.type === 'order')
  let qrCodeData = ''
  if(tradeInfo.orderType === 'p2p_order' && unsignedOrder.completeOrder && unsignedOrder.completeOrder.authPrivateKey && signedOrder && signedOrder.orderHash) {
    qrCodeData = JSON.stringify({type:'p2p_order', data:{authPrivateKey:unsignedOrder.completeOrder.authPrivateKey, orderHash:signedOrder.orderHash}})
  }

  async function doSubmit(signed) {
    eachLimit(signed, 1, async function (tx, callback) {
      if(tx.type === 'tx') {
        const {response, rawTx} = await window.ETH.sendRawTransaction(tx.data)
        // console.log('...tx:', response)
        if (response.error) {
          Notification.open({
            message: intl.get('trade.place_order_failed'),
            type: "error",
            description: response.error.message
          });
          callback(response.error.message)
        } else {
          tx.txHash = response.result
          window.STORAGE.wallet.setWallet({address: wallet.address, nonce: tx.nonce});
          window.RELAY.account.notifyTransactionSubmitted({txHash: response.result, rawTx, from: wallet.address});
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
          tx.orderHash = response.result
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
        placeOrder.confirmButtonStateChange({state:1})
      }else {
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
        openNotification(balanceWarn);
        updateOrders();
        placeOrder.sendDone({signed})
      }
    });
  }

  async function generateQrCode() {
    if(orderType !== 'p2p_order') {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'order type Error'
      });
      return
    }
    if(!order || (unsigned.length > 0 && unsigned.length !== actualSigned.length)) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'Not Signed'
      });
      return
    }
    await doSubmit(signed)
  }

  async function handelSubmit() {
    if(orderType !== 'market_order') {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'order type Error'
      });
      return
    }
    if(!order || (unsigned.length > 0 && unsigned.length !== actualSigned.length)) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'Not Signed'
      });
      return
    }
    await doSubmit(signed)
    dispatch({type:'layers/hideLayer',payload:{id:'placeOrderConfirm'}})
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

  const toUnlock = () => {
    dispatch({type:'layers/showLayer',payload:{id:'unlock'}})
  }

  const toSign = () => {
    dispatch({type:'layers/showLayer',payload:{id:'placeOrderSign'}})
  }

  const ActionItem = (item) => {
    return (
      <div>
        <Button className="alert-btn mr5" onClick={() =>
          dispatch({type:'layers/showLayer',payload:{id:'receive',symbol: item.value.symbol.toUpperCase()}})
        }> {intl.get('order.receive_token', {token: item.value.symbol.toUpperCase()})}</Button>
        {item.value.symbol.toUpperCase() !== 'WETH' && item.value.symbol.toUpperCase() !== 'BAR' && item.value.symbol.toUpperCase() !== 'FOO' &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath(`/trade/${item.value.symbol.toUpperCase()}-WETH`)}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {(item.value.symbol.toUpperCase() === 'BAR' || item.value.symbol.toUpperCase() === 'FOO') &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath('/trade/FOO-BAR')}> {intl.get('order.buy_token', {token: item.value.symbol.toUpperCase()})}</Button>}
        {item.value.symbol.toUpperCase() === 'WETH' &&
        <Button className="alert-btn mr5" onClick={() =>
          dispatch({type:'layers/showLayer',payload:{id:'convert', item: {symbol: 'ETH'}, showFrozenAmount: true}})
        }> {intl.get('order.convert_token', {token: item.value.symbol.toUpperCase()})}</Button>}
      </div>
    )
  };

  const openNotification = (warn) => {
    const args = {
      message: intl.get('order.place_success'),
      description: intl.get('order.place_success_tip'),
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
    <div className="pd-lg">
      {
        tradeInfo.orderType === 'market_order' &&
        <div>
          <div className="sidebar-header">
            <h3>Market Order</h3>
          </div>
          <div className="sidebar-header">
            <h3>{intl.get(`order.${side}`)} {pair.split('-')[0]}</h3>
          </div>
          <div className="pd-lg text-center text-color-dark">
            <h5>{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
            <h2>{intl.get('global.amount', {amount:amount.toString(10)})} {pair.split('-')[0]}</h2>
            <small className="text-color-dark-1">
              {uiFormatter.getFormatNum(price.toString(10))}
              x {intl.get('global.amount', {amount:amount.toString(10)})} = {total.toString(10)} {pair.split('-')[1]}
            </small>
          </div>
        </div>
      }
      {
        tradeInfo.orderType === 'p2p_order' &&
        <div>
          <div className="sidebar-header">
            <h3>P2P Order</h3>
          </div>
          <div className="pd-lg text-center text-color-dark">
            <h2>Sell {intl.get('global.amount', {amount:tradeInfo.amountS.toString(10)})} {tradeInfo.tokenS}</h2>
            <h2>Buy {intl.get('global.amount', {amount:tradeInfo.amountB.toString(10)})} {tradeInfo.tokenB}</h2>
          </div>
        </div>
      }

        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>{`${uiFormatter.getFormatNum(lrcFee)} LRC`}</span></li>
            <li><span>分润比例</span><span>{`${marginSplit} %`}</span></li>
            <li><span>订单生效时间</span><span>{uiFormatter.getFormatTime(validSince * 1e3)}</span></li>
            <li><span>订单失效时间</span><span>{uiFormatter.getFormatTime(validUntil * 1e3)}</span></li>
        </ul>
      {
        qrCodeData &&
        <div>
          <div><QRCode value={qrCodeData} size={240} level='H'/></div>
          <div>*For your order's security, your QR code will only generated once and not be stored locally. Make sure to save it properly, any one who received your QR code could take your order</div>
        </div>
      }
      <div className="mt20 d-block w-100">
        {
          !isUnlocked &&
          <div className="mb10 mt10">
            <Alert type="info" title={<div className="color-black-1">您的钱包还没有解锁 <a onClick={toUnlock}>解锁钱包<Icon type="right" /></a></div>} theme="light" size="small"/>
          </div>
        }
        {
          isUnlocked && unsigned.length !== actualSigned.length &&
          <div>
            <div className="mb15"></div>
            <Alert type="info" title={<div className="color-black-1">您的订单还没有完成签名 <a onClick={toSign}>订单签名<Icon type="right" /></a></div>} theme="light" size="small" />
            <div className="mb15"></div>
          </div>
        }
        {
          orderType === 'market_order' &&
          <Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit} disabled={!isUnlocked || !order.owner || orderType !== 'market_order'}>提交订单</Button>
        }
        {
          orderType === 'p2p_order' &&
          <Button className="btn-block btn-o-dark btn-xlg" onClick={generateQrCode} loading={confirmButtonState === 2} disabled={!isUnlocked || !order.owner || confirmButtonState !== 1}>Generate QR Code</Button>
        }
      </div>
    </div>
  )
}
export default PlaceOrderConfirm
