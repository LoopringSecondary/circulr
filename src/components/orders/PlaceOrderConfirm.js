import React from 'react';
import { Input,Button } from 'antd';
import {toBig, toHex} from 'LoopringJS/common/formatter'
import config from 'common/config'
import intl from 'react-intl-universal';
import * as datas from 'common/config/data'
import eachLimit from 'async/eachLimit';
import * as orderFormatter from 'modules/orders/formatters'
import Notification from 'LoopringUI/components/Notification'
//import {create} from 'LoopringJS/ethereum/account';

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, settings, wallet, modals} = props
  const {side, pair, verifiedAddress} = placeOrderConfirm
  let {amount, total, validSince, validUntil, marginSplit, lrcFee, warn} = placeOrderConfirm.tradeInfo;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];
  marginSplit = marginSplit === undefined ? settings.trading.marginSplit : marginSplit;
  let order = {};
  order.delegateAddress = config.getDelegateAddress();
  order.protocol = settings.trading.contract.address;
  const tokenB = side.toLowerCase() === "buy" ? config.getTokenBySymbol(token) : config.getTokenBySymbol(token2);
  const tokenS = side.toLowerCase() === "sell" ? config.getTokenBySymbol(token) : config.getTokenBySymbol(token2);
  order.tokenB = tokenB.address;
  order.tokenS = tokenS.address;
  order.amountB = toHex(toBig(side.toLowerCase() === "buy" ? amount : total).times('1e' + tokenB.digits));
  order.amountS = toHex(toBig(side.toLowerCase() === "sell" ? amount : total).times('1e' + tokenS.digits));
  order.lrcFee = toHex(toBig(lrcFee).times(1e18));
  order.validSince = toHex(validSince);
  order.validUntil = toHex(validUntil);
  order.marginSplitPercentage = Number(marginSplit);
  order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
  order.walletAddress = config.getWalletAddress();
  const authAccount = {}
  //TODO create('');
  order.authAddr = authAccount.address;
  order.authPrivateKey = authAccount.privateKey;
  if(wallet && verifiedAddress && wallet.address === verifiedAddress) {
    order.owner = verifiedAddress

  } else { // unlock and verify order
    //TODO
    return
  }

  // sign orders and txs
  const txs = [];
  const approveWarn = warn.filter(item => item.type === "AllowanceNotEnough");
  if (approveWarn) {
    const gasLimit = config.getGasLimitByType('approve');
    const gasPrice = toHex(Number(settings.trading.gasPrice) * 1e9);
    window.STORAGE.wallet.getNonce(wallet.address).then(nonce => {
      approveWarn.forEach(item => {
        const tokenConfig = config.getTokenBySymbol(item.value.symbol);
        if (item.value.allowance > 0) {
          txs.push(orderFormatter.generateApproveTx({symbol:item.value.symbol, gasPrice, gasLimit, amount:'0x0', nonce:toHex(nonce)}));
          nonce = nonce + 1;
        }
        txs.push(orderFormatter.generateApproveTx({symbol:item.value.symbol, gasPrice, gasLimit, amount:toHex(toBig('9223372036854775806').times('1e' + tokenConfig.digits || 18)), nonce:toHex(nonce)}));
        nonce = nonce + 1;
      });

      eachLimit(txs, 1, async function (tx, callback) {
        const {response, rawTx} = await window.WALLET.sendTransaction(tx);
        if (response.error) {
          callback(response.error.message)
        } else {
          window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
          window.RELAY.account.notifyTransactionSubmitted({txHash: response.result, rawTx, from: window.WALLET.getAddress()});
          callback()
        }
      }, function (error) {
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
    }).catch(e=>{

    })


  } else {
    const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
    this.openNotification(balanceWarn);
    this.setState({loading:false});
    modals.hideModal({id: 'placeOrderConfirm'});
    updateOrders();
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

  const unsigned = {order, txs}
  window.WALLET.signOrder(order).then(function (signedOrder) {
    signedOrder.powNonce = 100;

  }.bind(this)).catch(err => {
    Notification.open({
      message: intl.get('trade.sign_order_failed'),
      type: "error",
      description: err.message
    })
  });


  return (
    <div>
        <div className="modal-header text-dark"><h3>{intl.get(`order.${side}`)} {token}</h3></div>
        <div className="pd-lg text-center text-color-dark">
	        <h5>您正在{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
	        <h2>{intl.get('global.amount', {amount})} {token}</h2>
	        <small className="text-color-dark-1">0.0015 × 100 =0.15WETH</small>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>0.5LRC</span></li>
            <li><span>分润比例</span><span>{`${marginSplit} %`}</span></li>
            <li><span>订单生效时间</span><span>2018年5月14日 16:28</span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
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
        </ul>
        <Button className="btn-block btn-o-dark btn-xlg">提交订单</Button>
    </div>
  )
}
export default PlaceOrderConfirm
