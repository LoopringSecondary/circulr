import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import {connect} from 'dva'
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

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt5 pb5 pl0 pr0 zb-b-b">
      <div className="col">
        <div className="fs13 color-black-2 lh25">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs13 color-black-1 text-wrap lh25">{value}</div>
      </div>
    </div>
  )
}
const WalletItem = (props) => {
  const {title, description,icon,layout,showArrow} = props
  if(layout === 'vertical'){
    return (
      <div className="mt5 mb5">
        <div className="text-center">
          <i className={`fs24 icon-${icon}`}></i>
        </div>
        <div className="">
          <div className="fs14">{title}</div>
        </div>
      </div>
    )
  }else{
    return (
      <div className="row pt10 pb10 pl0 pr0 align-items-center zb-b-b">
        <div className="col-auto pr5 text-right text-primary">
          <i className={`fs20 icon-${icon}`}></i>
        </div>
        <div className="col pl10">
          <div className="fs14 color-black-1 text-wrap">{title}</div>
          <div className="fs12 color-black-2">{description}</div>
        </div>
        {showArrow &&
          <div className="col-auto text-right">
            <Icon type="right" />
          </div>
        }
      </div>
     )
  }
}

const PlaceOrderSteps = (props) => {
  const {placeOrderSteps, placeOrder, wallet, dispatch} = props
  let {side, pair, tradeInfo, order} = placeOrderSteps || {}
  let {price, amount, total, validSince,validUntil, marginSplit, lrcFee, warn, orderType} = tradeInfo || {};
  let {unsigned, signed} = placeOrder || {}
  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  let submitDatas = signed && unsigned.length === actualSigned.length ? (
    signed.map((item, index) => {
      return {signed: item, unsigned:unsigned[index], index}
    })
  ) : new Array()

  const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'

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
        dispatch({type:'placeOrder/confirmButtonStateChange',payload:{state:1}})
      }else {
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
        openNotification(balanceWarn);
        dispatch({type:'placeOrder/sendDone',payload:{signed}})
      }
    });
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

  function chooseType(type) {
    switch(type) {
      case 'Loopr' :
        const origin = JSON.stringify(unsigned)
        const hash = keccakHash(origin)
        const qrcode = JSON.stringify({type:'sign', 'id':hash})
        window.RELAY.order.storeDatasInShortTerm(hash, origin).then(res=>{
          if(!res.error) {
            dispatch({type:'placeOrderByLoopr/qrcodeChange',payload:{qrcode}});
            dispatch({type:'layers/showLayer',payload:{id:'placeOrderByLoopr'}});
            dispatch({type:'sockets/filtersChange',payload:{id:'authorization', filters:{hash}}});
            dispatch({type:'sockets/fetch',payload:{id:'authorization'}});
          } else {
            console.error(res.error)
            Notification.open({
              message: intl.get('notifications.title.place_order_failed'),
              type: "error",
              description: 'failed send datas'
            });
          }
        }).catch(e=>{
          console.error(e)
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            type: "error",
            description: 'failed send datas'
          });
        })
        break;
      case 'MetaMask' :
        dispatch({type:'layers/showLayer',payload:{id:'placeOrderByMetamask'}});
        break;
      case 'Ledger' :
        dispatch({type:'layers/showLayer',payload:{id:'placeOrderByLedger'}});
        break;
    }
  }
  return (
    <Card className="rs" title={<div className="pl10 ">订单提交</div>}>
      <div className="p15">
        <div className="zb-b">
          <div className="fs16 color-black-1 p10 zb-b-b">订单详情</div>
          <OrderMetaItem label={intl.get('place_order.order_type')} value={tradeInfo.orderType === 'p2p_order' ? intl.get('order_type.p2p_order') : intl.get('order_type.market_order')} />
          <OrderMetaItem label={intl.get('common.price')} value={`${uiFormatter.getFormatNum(price.toString(10))} ${pair.split('-')[1]}`} />
          <OrderMetaItem label={intl.get('common.amount')} value={`${amount.toString(10)} ${pair.split('-')[0]}`} />
          <OrderMetaItem label={intl.get('common.total')} value={`${total.toString(10)} ${pair.split('-')[1]}`} />
          <OrderMetaItem label={intl.get('common.lrc_fee')} value={`${uiFormatter.getFormatNum(lrcFee)} LRC`} />
          <OrderMetaItem label={intl.get('common.margin_split')} value={`${marginSplit} %`} />
          <OrderMetaItem label={intl.get('common.ttl')} value={`${uiFormatter.getFormatTime(validSince * 1e3)} ~ ${uiFormatter.getFormatTime(validUntil * 1e3)}`} />
        </div>

        <div className="zb-b mt15">
          <div className="fs16 color-black-1 p10 zb-b-b">选择支付钱包</div>
          <div className="row ml0 mr0">
            <div className="col-4 zb-b-r cursor-pointer" onClick={chooseType.bind(this, 'Loopr')}>
              <WalletItem icon="json" title="Loopr Wallet" />
            </div>
            <div className="col-4 zb-b-r cursor-pointer" onClick={chooseType.bind(this, 'MetaMask')}>
              <WalletItem icon="metamaskwallet" title="MetaMask" />
            </div>
            <div className="col-4 cursor-pointer" onClick={chooseType.bind(this, 'Ledger')}>
              <WalletItem icon="ledgerwallet" title="Ledger" />
            </div>
            {false && <div className="col-4 zb-b-r">
              <WalletItem icon="trezorwallet" title="TREZOR" />
            </div>}
            <div className="col-4 zb-b-r cursor-pointer" onClick={chooseType.bind(this, 'imToken')}>
              <WalletItem icon="key" title="imToken" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

function mapToProps(state) {
  return {
    placeOrder:state.placeOrder,
    wallet:state.wallet,
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderSteps));


