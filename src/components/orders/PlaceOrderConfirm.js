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
import {keccakHash} from 'LoopringJS/common/utils'

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, placeOrder, settings, balance, wallet, marketcap, pendingTx, dispatch} = props
  let {side, pair, tradeInfo, order} = placeOrderConfirm || {}
  let {price, amount, total, validSince,validUntil, marginSplit, lrcFee, warn, orderType} = tradeInfo || {};
  let {unsigned, signed, confirmButtonState} = placeOrder || {}
  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  let submitDatas = signed && unsigned && unsigned.length === actualSigned.length ? (
    signed.map((item, index) => {
      return {signed: item, unsigned:unsigned[index], index}
    })
  ) : new Array()

  const hash = keccakHash(JSON.stringify(unsigned))

  const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'
  const unsignedOrder = unsigned ? unsigned.find(item => item.type === 'order') : {}
  const signedOrder = signed.find(item => item && item.type === 'order')
  let qrCodeData = ''
  if(tradeInfo.orderType === 'p2p_order' && unsignedOrder.completeOrder && unsignedOrder.completeOrder.authPrivateKey && signedOrder && signedOrder.orderHash) {
    qrCodeData = JSON.stringify({type:'p2p_order', data:{authPrivateKey:unsignedOrder.completeOrder.authPrivateKey, orderHash:signedOrder.orderHash}})
  }

  async function doSubmit() {
    if(submitDatas.length === 0) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    eachLimit(submitDatas, 1, async function (item, callback) {
      const signedItem = item.signed
      const unsignedItem = item.unsigned
      if(signedItem.type === 'tx') {
        const response = await window.ETH.sendRawTransaction(signedItem.data)
        // console.log('...tx:', response, signedItem)
        if (response.error) {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            type: "error",
            description: response.error.message
          });
          callback(response.error.message)
        } else {
          signed[item.index].txHash = response.result
          window.STORAGE.wallet.setWallet({address: wallet.address, nonce: unsignedItem.data.nonce});
          window.RELAY.account.notifyTransactionSubmitted({txHash: response.result, rawTx:unsignedItem.data, from: wallet.address});
          callback()
        }
      } else {
        const response = await window.RELAY.order.placeOrder(signedItem.data)
        // console.log('...submit order :', response)
        if (response.error) {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            type: "error",
            description: response.error.message
          })
          callback(response.error.message)
        } else {
          signed[item.index].orderHash = response.result
          callback()
        }
      }
    }, function (error) {
      if(error){
        Notification.open({
          message: intl.get('notifications.title.place_order_failed'),
          type: "error",
          description: error.message
        });
        placeOrder.confirmButtonStateChange({state:1})
      }else {
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
        openNotification(balanceWarn);
        placeOrder.sendDone({signed})
      }
    });
  }

  async function generateQrCode() {
    if(orderType !== 'p2p_order') {
      throw new Error('orderType Data Error')
    }
    if(!order || (unsigned.length > 0 && unsigned.length !== actualSigned.length)) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    await doSubmit()
  }

  async function handelSubmit() {
    if(orderType !== 'market_order') {
      throw new Error('orderType Data Error')
    }
    if(!order || (unsigned.length > 0 && unsigned.length !== actualSigned.length)) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    await doSubmit()
    dispatch({type:'layers/hideLayer',payload:{id:'placeOrderConfirm'}})
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
        <Button className="alert-btn mr5"
                onClick={() => dispatch({type:'layers/showLayer',payload:{id:'receive',symbol: item.value.symbol.toUpperCase()}})}>
          {`${intl.get('common.receive')} ${item.value.symbol.toUpperCase()}`}
        </Button>
        {item.value.symbol.toUpperCase() !== 'WETH' && item.value.symbol.toUpperCase() !== 'BAR' && item.value.symbol.toUpperCase() !== 'FOO' &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath(`/trade/${item.value.symbol.toUpperCase()}-WETH`)}>
          {`${intl.get('common.buy')} ${item.value.symbol.toUpperCase()}`}
        </Button>}
        {(item.value.symbol.toUpperCase() === 'BAR' || item.value.symbol.toUpperCase() === 'FOO') &&
        <Button className="alert-btn mr5"
                onClick={() => window.routeActions.gotoPath('/trade/FOO-BAR')}>
          {`${intl.get('common.buy')} ${item.value.symbol.toUpperCase()}`}
          </Button>}
        {item.value.symbol.toUpperCase() === 'WETH' &&
        <Button className="alert-btn mr5"
                onClick={() => dispatch({type:'layers/showLayer',payload:{id:'convert', item: {symbol: 'ETH'}, showFrozenAmount: true}})}>
          {`${intl.get('common.convert')} ${item.value.symbol.toUpperCase()}`}
        </Button>}
      </div>
    )
  };

  const openNotification = (warn) => {
    const args = {
      message: intl.get('notifications.title.place_order_success'),
      description: intl.get('notifications.message.place_order_success'),
      type: 'success',
    };
    Notification.open(args);
    warn.forEach((item) => {
      Notification.open({
        message: intl.get('notifications.title.place_order_warn'),
        description: intl.get('notifications.message.place_order_balance_not_enough', {
          token: item.value.symbol,
          amount: uiFormatter.getFormatNum(item.value.required)
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
            <h3>{intl.get(`common.${side}`)} {pair.split('-')[0]}</h3>
          </div>
          <div className="pd-lg text-center text-color-dark">
            <h5>{intl.get(`common.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
            <h2>{amount.toString(10)} {pair.split('-')[0]}</h2>
            <small className="text-color-dark-1">
              {uiFormatter.getFormatNum(price.toString(10))}
              x {amount.toString(10)} = {total.toString(10)} {pair.split('-')[1]}
            </small>
          </div>
        </div>
      }
      {
        tradeInfo.orderType === 'p2p_order' &&
        <div>
          <div className="pd-lg text-center text-color-dark">
            <h2>{intl.get('common.selling')} {tradeInfo.amountS.toString(10)} {tradeInfo.tokenS}</h2>
            <h2>{intl.get('common.buying')} {tradeInfo.amountB.toString(10)} {tradeInfo.tokenB}</h2>
          </div>
        </div>
      }

        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>{intl.get('place_order.order_type')}</span><span>{tradeInfo.orderType === 'p2p_order' ? intl.get('order_type.p2p_order') : intl.get('order_type.market_order')}</span></li>
            <li><span>{intl.get('common.lrc_fee')}</span><span>{`${uiFormatter.getFormatNum(lrcFee)} LRC`}</span></li>
            <li><span>{intl.get('common.margin_split')}</span><span>{`${marginSplit} %`}</span></li>
            <li><span>{intl.get('place_order.order_since')}</span><span>{uiFormatter.getFormatTime(validSince * 1e3)}</span></li>
            <li><span>{intl.get('place_order.order_until')}</span><span>{uiFormatter.getFormatTime(validUntil * 1e3)}</span></li>
        </ul>
      {
        qrCodeData &&
        <div>
          <div><QRCode value={qrCodeData} size={240} level='H'/></div>
          <div>{intl.get('place_order_confirm.qrcode_security')}</div>
        </div>
      }
      <div className="mt20 d-block w-100">
        {
          !isUnlocked &&
          <div className="mb10 mt10">
            <Alert type="info" title={<div className="color-black-1">{intl.get('unlock.has_not_unlocked')} <a onClick={toUnlock}>{intl.get('unlock.to_unlock')}<Icon type="right" /></a></div>} theme="light" size="small"/>
          </div>
        }
        {
          isUnlocked && unsigned && unsigned.length !== actualSigned.length &&
          <div>
            <div className="mb15"></div>
            <Alert type="info" title={<div className="color-black-1">{intl.get('sign.not_signed')} <a onClick={toSign}>{intl.get('sign.to_sign')}<Icon type="right" /></a></div>} theme="light" size="small" />
            <div className="mb15"></div>
          </div>
        }
        {
          orderType === 'market_order' &&
          <Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit} disabled={!isUnlocked || !order.owner}>{intl.get('actions.submit_order')}</Button>
        }
        {
          orderType === 'p2p_order' &&
          <Button className="btn-block btn-o-dark btn-xlg" onClick={generateQrCode} loading={confirmButtonState === 2} disabled={!isUnlocked || !order.owner || confirmButtonState !== 1}>{intl.get('actions.generate_qrcode')}</Button>
        }
      </div>
    </div>
  )
}
export default PlaceOrderConfirm
