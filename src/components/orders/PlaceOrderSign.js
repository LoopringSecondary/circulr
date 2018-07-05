import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Collapse} from 'antd'
import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import eachLimit from 'async/eachLimit';
import * as uiFormatter from 'modules/formatter/common'

const PlaceOrderSign = (props) => {
  const {placeOrder, wallet, dispatch} = props
  const {tradeInfo,signed,unsigned} = placeOrder
  let {warn} = tradeInfo || {};
  const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked'
  let actualSigned = signed && wallet ? signed.filter(item => item !== undefined && item !== null) : []
  let submitDatas = signed && unsigned.length === actualSigned.length ? (
    signed.map((item, index) => {
      return {signed: item, unsigned:unsigned[index], index}
    })
  ) : new Array()

  async function sign(item, index, e) {
    e.preventDefault()
    e.stopPropagation()
    const account = wallet.account || window.account
    if(!account) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'to unlock'
      });
      return
    }
    try {
      if(item.address !== wallet.address) {
        Notification.open({
          message: intl.get('trade.place_order_failed'),
          type: "error",
          description: 'your address in original order is not the same as unlocked, please replace order'
        });
        return
      }
      let toConfirmWarn = ''
      if (wallet.unlockType === 'ledger') {
        toConfirmWarn = intl.get('notifications.message.confirm_warn_ledger')
      }
      if (wallet.unlockType === 'metaMask') {
        toConfirmWarn = intl.get('notifications.message.confirm_warn_metamask')
      }
      if(toConfirmWarn) {
        Notification.open({
          message: intl.get('notifications.title.to_confirm'),
          description: toConfirmWarn,
          type: 'info'
        })
      }
      if(item.type === 'order') {
        const signedOrder = await account.signOrder(item.data)
        signedOrder.powNonce = 100;
        signed[index] = {type: 'order', data:signedOrder};
      } else {
        signed[index] = {type: 'tx', data: await account.signEthereumTx(item.data)};
      }
      dispatch({type:'placeOrder/signedChange',payload:{signed}})
    } catch(e) {
      console.error(e)
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: e.message
      });
    }
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

  function UserError(message) {
    this.message = message;

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
          callback(new UserError(response.error.message))
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
          callback(new UserError(response.error.message))
        } else {
          signed[item.index].orderHash = response.result
          callback()
        }
      }
    }, function (error) {
      if(error){
        switch(placeOrder.payWith) {
          case 'ledger':
            dispatch({type:'placeOrderByLedger/orderStateChange',payload:{orderState:2}})
            break;
          case 'metaMask':
            dispatch({type:'placeOrderByMetaMask/orderStateChange',payload:{orderState:2}})
            break;
        }
        dispatch({type:'placeOrder/resultMsgChange',payload:{resultMsg:error.message}})
        dispatch({type:'placeOrder/confirmButtonStateChange',payload:{state:1}})
      } else {
        const balanceWarn = warn ? warn.filter(item => item.type === "BalanceNotEnough") : [];
        openNotification(balanceWarn);
        dispatch({type:'placeOrder/sendDone',payload:{signed}})
        switch(placeOrder.payWith) {
          case 'ledger':
            dispatch({type:'placeOrderByLedger/orderStateChange',payload:{orderState:1}})
            break;
          case 'metaMask':
            dispatch({type:'placeOrderByMetaMask/orderStateChange',payload:{orderState:1}})
            break;
        }
      }
    });
  }

  async function handelSubmit() {
    if(!signed || unsigned.length !== actualSigned.length) {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'to sign'
      });
      return
    }
    if(tradeInfo.orderType !== 'market_order') {
      throw new Error('orderType Data Error')
    }
    if(unsigned.length > 0 && unsigned.length !== actualSigned.length) {
      Notification.open({
        message: intl.get('notifications.title.place_order_failed'),
        type: "error",
        description: intl.get('notifications.message.some_items_not_signed')
      });
      return
    }
    await doSubmit()
  }

  const Description = ({tx}) => {
    if(tx.type === 'order') {
      return intl.get('place_order_sign.type_sign_order')
    } else if(tx.type === 'tx') {
      if(tx.action === 'CancelAllowance') {
        return intl.get('place_order_sign.type_cancel_allowance', {token:tx.token})
      } else if (tx.action === 'ApproveAllowance') {
        return intl.get('place_order_sign.type_approve', {token:tx.token})
      }
    }
    return ''
  };

  const TxHeader = ({tx,index})=>{
    return (
      <div className="row pl0 pr0 align-items-center">
        <div className="col">
          <div className="fs14 color-black-2">
            <Button type="primary" shape="circle" size="small" className="mr10">{index+1}</Button>
            <Description tx={tx}/>
          </div>
        </div>
        <div className="col-auto pr20">
          {signed[index] &&
            <div className="text-up">
              {intl.get('place_order_sign.signed')} <Icon className="ml5" type="check-circle"  />
            </div>
          }
          {!signed[index] &&
            <div className="color-black-3">
              <a onClick={sign.bind(this, tx, index)}>{intl.get('place_order_sign.unsigned')}<Icon className="ml5" type="right"  /></a>
            </div>
          }
        </div>
      </div>
    )
  }
  const TxContent = ({tx,index})=>{
    return (
      <div className="row p5 zb-b-t">
        <div className="col-6 pr5">
          <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.unsigned_tx')}</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={JSON.stringify(unsigned[index])}/>
        </div>
        <div className="col-6 pl5">
          <div className="fs12 color-black-2 mt5">{intl.get('place_order_sign.signed_tx')}</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={signed && signed[index] ? JSON.stringify(signed[index]) : ''}/>
        </div>
      </div>
    )
  }

  return (
    <div className="zb-b">
      <Collapse accordion bordered={false} defaultActiveKey={[]}>
        {
          isUnlocked && unsigned && unsigned.map((item, index)=>{
            return (
              <Collapse.Panel  header={<TxHeader tx={item} index={index} />} key={index} showArrow={false}>
                <TxContent tx={item} index={index}/>
              </Collapse.Panel>
            )
          })
        }
      </Collapse>
      <div className="p10">
        {tradeInfo && tradeInfo.orderType !== 'p2p_order' && <Button className="w-100 d-block" size="large" type="primary" onClick={handelSubmit} disabled={!signed || !unsigned || unsigned.length !== actualSigned.length}> {intl.get('actions.submit_order')} </Button>}
      </div>

    </div>
  );
};

function mapToProps(state) {
  return {
    placeOrder:state.placeOrder,
    wallet:state.wallet
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderSign));


