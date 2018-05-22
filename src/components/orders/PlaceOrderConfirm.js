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

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, settings, wallet, modals} = props
  const {side, pair, tradeInfo, order, unsigned, signed} = placeOrderConfirm
  let {price, amount, total, validSince,validUntil, marginSplit, lrcFee, warn} = tradeInfo;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];

  function handelSubmit() {
    if(order && unsigned.length !== signed.length) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'Not Signed'
      });
      return
    }
    eachLimit(signed, 1, async function (tx, callback) {
      let txHash = '', rawTx = ''
      if(tx.type === 'tx') {
        const response = await window.ETH.sendRawTransaction(tx.data)
        console.log('tx:', response)
        if (response.error) {
          callback(response.error.message)
        } else {
          txHash = response.response.result
          rawTx = response.rawTx
        }
      } else {
        const response = await window.RELAY.order.placeOrder(tx.data)
        console.log('submit order :', response)
        if (response.error) {
          Notification.open({
            message: intl.get('trade.place_order_failed'),
            type: "error",
            description: response.error.message
          })
          callback(response.error.message)
        }
      }
      if(txHash && rawTx) {
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        window.RELAY.account.notifyTransactionSubmitted({txHash: txHash, rawTx, from: window.WALLET.getAddress()});
        callback()
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
	        <h5>您正在{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
	        <h2>{intl.get('global.amount', {amount})} {token}</h2>
	        <small className="text-color-dark-1">
            {uiFormatter.getFormatNum(price)}
            x {intl.get('global.amount', {amount})} = {total} {token2}
          </small>
        </div>
        <div className="divider solid"unsigned></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>{`${uiFormatter.getFormatNum(lrcFee)} LRC`}</span></li>
            <li><span>分润比例</span><span>{`${marginSplit} %`}</span></li>
            <li><span>订单生效时间</span><span>{uiFormatter.getFormatTime(validSince * 1e3)}</span></li>
            <li><span>订单失效时间</span><span>{uiFormatter.getFormatTime(validUntil * 1e3)}</span></li>
          {//(wallet.unlockType !== 'keystore' && wallet.unlockType !== 'mnemonic' && wallet.unlockType !== 'privateKey')
            unsigned.length !== signed.length && unsigned.map((item, index)=>{
              console.log(111, unsigned.length, index, item)
              return (
              <li key={index} className="d-block">
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
              </li>)
            })
          }
        </ul>
        <Button className="btn-block btn-o-dark btn-xlg" onClick={handelSubmit}>提交订单</Button>
    </div>
  )
}
export default PlaceOrderConfirm
