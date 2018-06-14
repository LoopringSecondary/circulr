import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Spin} from 'antd'
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
import {getXPubKey as getLedgerPublicKey,connect as connectLedger} from "LoopringJS/ethereum/ledger";
import {wallets} from "../../common/config/data";
import {trimAll} from "LoopringJS/common/utils";
import moment from 'moment'

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pb5 pl0 pr0">
      <div className="col-auto">
        <div className="fs13 color-black-2 lh25" style={{width:'80px'}}>{label}</div>
      </div>
      <div className="col text-left">
        <div className="fs13 color-black-1 text-wrap lh25">{value}</div>
      </div>
    </div>
  )
}
const WalletItem = (props) => {
  const {title, description,icon,layout,showArrow,loading=false} = props
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
          <Spin spinning={loading}>
            <div className="fs14 color-black-1 text-wrap">{title}</div>
            <div className="fs12 color-black-2">{description}</div>
          </Spin>
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
  const {placeOrderSteps, placeOrder, placeOrderByLoopr, wallet, dispatch} = props
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

  function chooseType(type) {
    switch(type) {
      case 'Loopr' :
        if(placeOrderByLoopr.qrcode) {
          dispatch({type:'layers/showLayer',payload:{id:'placeOrderByLoopr'}});
          return
        }
        dispatch({type:'placeOrder/payWithChange',payload:{payWith:'loopr'}});
        const origin = JSON.stringify(unsigned)
        const hash = keccakHash(origin)
        const qrcode = JSON.stringify({type:'sign', value:hash})
        window.RELAY.order.setTempStore(hash, origin).then(res=>{
          if(!res.error) {
            const time = moment().valueOf()
            dispatch({type:'placeOrderByLoopr/qrcodeGenerated',payload:{qrcode, hash, time}});
            dispatch({type:'layers/showLayer',payload:{id:'placeOrderByLoopr'}});
          } else {
            console.error(res.error)
            Notification.open({
              message: intl.get('notifications.title.place_order_failed'),
              type: "error",
              description: 'failed send datas'
            });
          }
          dispatch({type:'layers/hideLayer',payload:{id:'placeOrderSteps'}});
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
        dispatch({type:'placeOrder/payWithChange',payload:{payWith:'metaMask'}});
        dispatch({type:'layers/showLayer',payload:{id:'placeOrderByMetamask'}});
        dispatch({type:'layers/hideLayer',payload:{id:'placeOrderSteps'}});
        break;
      case 'Ledger' :
        dispatch({type:'placeOrder/payWithChange',payload:{payWith:'ledger'}});
        dispatch({type:"hardwareWallet/setWalletType",payload:{walletType:'ledger'}});
        const walletConfig = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'ledger(eth)');
        connectLedger().then(res =>{
          if(!res.error){
            const ledger = res.result;
            getLedgerPublicKey(walletConfig.dpath,ledger).then(resp => {
              if(!resp.error){
                const {chainCode, publicKey} = resp.result;
                dispatch({type: "placeOrderByLedger/connectChange", payload: {isConnected:true}});
                dispatch({type: "hardwareWallet/setKeyAndCode", payload: {chainCode, publicKey}});
                dispatch({type:'layers/showLayer',payload:{id:'placeOrderByLedger'}});
                dispatch({type:'layers/hideLayer',payload:{id:'placeOrderSteps'}});
              }
            });
          }
        });
        break;
    }
  }
  const loading = false
  return (
    <Card className="rs" title={<div className="pl10 ">{intl.get('place_order.title')}</div>}>
      <div className="p15">
        <div className="zb-b">
          <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">1. {intl.get(`place_order.${side === 'sell' ? 'selling' : 'buying'}`)} {intl.get('common.format_amount', {amount})} {pair.split('-')[0]}</div>
          <div className="pt10 pb10">
            <OrderMetaItem label={intl.get('common.sell')} value={`${amount.toString(10)} ${pair.split('-')[0]}`} />
            <OrderMetaItem label={intl.get('common.buy')} value={`${total.toString(10)} ${pair.split('-')[1]}`} />
            <OrderMetaItem label={intl.get('common.price')} value={`${uiFormatter.getFormatNum(price.toString(10))} ${pair.split('-')[1]}`} />
            <OrderMetaItem label={intl.get('common.lrc_fee')} value={`${uiFormatter.getFormatNum(lrcFee)} LRC`} />
            { false && <OrderMetaItem label={intl.get('common.margin_split')} value={`${marginSplit} %`} /> }
            <OrderMetaItem label={intl.get('common.ttl')} value={`${uiFormatter.getFormatTime(validSince * 1e3)} ~ ${uiFormatter.getFormatTime(validUntil * 1e3)}`} />
          </div>
        </div>

        <div className="zb-b mt15">
          <div className="fs16 color-black-1 p10 zb-b-b bg-grey-50">2. {intl.get('place_order.select_wallet')}</div>
          <div className="row ml0 mr0">
            <div hidden={signed && signed.length >0 && placeOrder.payWith !== 'loopr'} className="col-4 zb-b-r cursor-pointer" onClick={loading ? ()=>{} : chooseType.bind(this, 'Loopr')}>
              <WalletItem icon="json" title="Loopr Wallet" loading={loading} />
            </div>
            <div hidden={signed && signed.length >0 && placeOrder.payWith !== 'metaMask'} className="col-4 zb-b-r cursor-pointer" onClick={chooseType.bind(this, 'MetaMask')}>
              <WalletItem icon="metamaskwallet" title="MetaMask" />
            </div>
            <div hidden={signed && signed.length >0 && placeOrder.payWith !== 'ledger'} className="col-4 cursor-pointer" onClick={chooseType.bind(this, 'Ledger')}>
              <WalletItem icon="ledgerwallet" title="Ledger" />
            </div>
            {false && <div className="col-4 zb-b-r">
              <WalletItem icon="trezorwallet" title="TREZOR" />
            </div>}
            <div hidden={signed && signed.length >0 && placeOrder.payWith !== 'more'} className="col-4 zb-b-r cursor-pointer" onClick={chooseType.bind(this, 'more')}>
              <WalletItem icon="key" title="More Wallets" />
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
    placeOrderByLoopr:state.placeOrderByLoopr,
    wallet:state.wallet,
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderSteps));


