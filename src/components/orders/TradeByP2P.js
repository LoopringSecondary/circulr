import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import {connect} from 'dva'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import * as orderFormatter from 'modules/orders/formatters'
import {sorterByBalance, sorterBySymbol} from 'modules/tokens/TokensFm'
import * as fm from 'LoopringJS/common/formatter'
import moment from 'moment'
import config from 'common/config'
import Notification from 'LoopringUI/components/Notification'
import {getLastGas, getEstimateGas} from 'modules/settings/formatters'
import {FormatAmount} from 'modules/formatter/FormatNumber'

const MenuItem = (prop)=>{
  return (
    <div className="row pt10 pb10 pl10 pr10 zb-b-b align-items-center">
      <div className="col">
        <span className="fs14 color-black-1 pr10">{prop.label}</span>
      </div>
      {prop.value &&
        <div className="col-auto text-right">
          {prop.value}
        </div>
      }
      {prop.action &&
        <div className="col-auto text-right">
          {prop.action}
        </div>
      }
    </div>
  )
}
const TradeByP2P = (props) => {
  const {form, balance, p2pOrder, order, marketcap, tokens, settings, wallet, gas, pendingTx, dispatch} = props
  const gasResult = getLastGas(gas)
  const gasPrice = gasResult.gasPrice
  const {tokenS, tokenB, amountS, amountB} = p2pOrder
  const balanceS = tokenS ? tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokenS, toUnit:true}).balance : fm.toBig(0)
  const balanceB = tokenB ? tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokenB, toUnit:true}).balance : fm.toBig(0)

  const price = amountB && amountB.gt(0) ? fm.toFixed(amountB.div(amountS), 8) : fm.toBig(0)
  // const tokenSells = balance.map(item => {
  //   const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance, symbol:item.symbol, toUnit:true})
  //   return {...item, ...tokenBalance}
  // }).filter(item => {
  //   return item.symbol !== 'ETH' && item.symbol !== 'WETH_OLD' && item.symbol !== tokenB && item.balance.gt(0)
  // })
  const allTokens = tokens.map(item=>{
    const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance, symbol:item.symbol, toUnit:true})
    return {...item, ...tokenBalance}
  })
  const tokenSells = [...allTokens].filter(item => {
    return item.symbol !== 'ETH' && item.symbol !== 'WETH_OLD' && item.symbol !== tokenB
  })
  tokenSells.sort(sorterBySymbol)
  const tokenBuys = [...allTokens].filter(item => item.symbol !== 'ETH' && item.symbol !== 'WETH_OLD' && item.symbol !== tokenS)
  tokenBuys.sort(sorterBySymbol)

  function tokenChange(side, token, e) {
    if(side === 'buy') {
      dispatch({type:'p2pOrder/tokenChange', payload:{'tokenB':token}})
    } else {
      dispatch({type:'p2pOrder/tokenChange', payload:{'tokenS':token}})
    }
  }

  function amountChange(side, e) {
    if(side === 'buy') {
      if(tokenFormatter.isValidNumber(e.target.value)) {
        dispatch({type:'p2pOrder/amountChange', payload:{'amountB':fm.toBig(e.target.value)}})
      }
    } else {
      if(validateAmountS(e.target.value)){
        dispatch({type:'p2pOrder/amountChange', payload:{'amountS':fm.toBig(e.target.value)}})
      }
    }
  }

  function validateAmountS(value) {
    if(tokenS && tokenFormatter.isValidNumber(value)) {
      const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokenS, toUnit:true})
      return tokenBalance.balance.gt(value)
    } else {
      return false
    }
  }

  function handleSubmit() {
    form.validateFields(async (err,values) => {
      if(!err){
        if(!wallet.address) {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            type: "error",
            description: intl.get('notifications.message.wallet_locked')
          });
          return
        }
        if(!balance || !marketcap) {
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: intl.get('notifications.message.failed_fetch_data_from_server'),
            type:'error'
          })
          return
        }
        dispatch({type:'p2pOrder/loadingChange', payload:{loading:true}})
        const tradeInfo = {}
        tradeInfo.amountB = amountB
        tradeInfo.amountS = amountS
        tradeInfo.tokenB = tokenB
        tradeInfo.tokenS = tokenS
        //TODO mock datas
        tradeInfo.validSince = moment().unix()
        tradeInfo.validUntil = moment().add(3600, 'seconds').unix()
        tradeInfo.marginSplit = 0
        tradeInfo.milliLrcFee = 0
        tradeInfo.lrcFee = 0
        tradeInfo.delegateAddress = config.getDelegateAddress();
        tradeInfo.protocol = settings.trading.contract.address;
        tradeInfo.gasLimit = config.getGasLimitByType('approve').gasLimit;
        tradeInfo.gasPrice = fm.toHex(Number(gasPrice) * 1e9);
        tradeInfo.orderType = 'p2p_order'
        try {
          await orderFormatter.p2pVerification(balance, wallet, tradeInfo, pendingTx ? pendingTx.items : [], gasPrice)
        } catch(e) {
          console.log(e)
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description: e.message,
            type:'error'
          })
          dispatch({type:'p2pOrder/loadingChange', payload:{loading:false}})
          return
        }
        if(tradeInfo.error) {
          tradeInfo.error.map(item=>{
            if(item.value.symbol === 'ETH') {
              Notification.open({
                message: intl.get('notifications.title.place_order_failed'),
                description: intl.get('notifications.message.eth_is_required_when_place_order', {required:item.value.required}),
                type:'error',
                actions:(
                  <div>
                    <Button className="alert-btn mr5" onClick={() => dispatch({type:'layers/showLayer', payload: {id: 'receiveToken', symbol:'ETH'}})}>
                      {`${intl.get('actions.receive')} ETH`}
                    </Button>
                  </div>
                )
              })
            } else if (item.value.symbol === 'LRC') {
              Notification.open({
                message: intl.get('notifications.title.place_order_failed'),
                description: intl.get('notifications.message.lrcfee_is_required_when_place_order', {required:item.value.required}),
                type:'error',
                actions:(
                  <div>
                    <Button className="alert-btn mr5" onClick={() => dispatch({type:'layers/showLayer', payload: {id: 'receiveToken', symbol:'LRC'}})}>
                      {`${intl.get('actions.receive')} LRC`}
                    </Button>
                  </div>
                )
              })
            }
          })
          dispatch({type:'p2pOrder/loadingChange', payload:{loading:false}})
          return
        }
        try {
          const {order, signed, unsigned} = await orderFormatter.signP2POrder(tradeInfo, wallet)
          showConfirm(tradeInfo, order, signed, unsigned)
        } catch (e) {
          console.log(e)
          Notification.open({
            message: intl.get('notifications.title.place_order_failed'),
            description:e.message,
            type:'error'
          })
        }
        dispatch({type:'p2pOrder/loadingChange', payload:{loading:false}})
      }
    });
  }
  const showConfirm = (tradeInfo, order, signed, unsigned) => {
    dispatch({type:'placeOrder/toConfirm', payload:{signed, unsigned}})
    dispatch({type:'layers/showLayer', payload: {id: 'placeOrderConfirm', tradeInfo, order}})
    dispatch({type:'layers/hideLayer', payload: {id: 'tradeByP2P'}})
  }

  const worthDisplay = (prefix, symbol, amount) => {
    return (
      <span className="">
        {symbol && amount && fm.toBig(amount).gt(0) &&
          <span>
            {prefix} {amount.toString(10)} {symbol}
            ≈{fm.getDisplaySymbol(settings.preference.currency)}
            {FormatAmount({value:orderFormatter.calculateWorthInLegalCurrency(marketcap, symbol, amount).toFixed(2), precision:2})}
          </span>
        }
        {(!symbol || !fm.toBig(amount).gt(0)) &&
          <span></span>
        }
      </span>
    )
  }

  const TokenItem = ({token})=>{
    return (
      <div className="row">
        <div className="col color-black-1 fs16">{token.symbol}</div>
        {false && <div className="col-atuo color-black-3 fs14 pl5">{token.balance}</div>}
      </div>
    )
  }
  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b mb15">{intl.get('p2p_order.order_title')}</div>
      <div className="row pl0 pr0 pt10 pb10">
        <div className="col pl0 pr0">
          <Form.Item label={null} colon={false}>
            {form.getFieldDecorator('amountS', {
              initialValue: amountS.toString(10),
              rules: [{
                message: intl.get('common.invalid_number'),
                validator: (rule, value, cb) => validateAmountS(value) ? cb() : cb(true)
              }]
          })(
            <Input size="large"
                   placeholder={intl.get('p2p_order.amounts_placeholder')}
                   addonBefore={intl.get('common.sell')}
                   addonAfter={
                     <Select
                       showSearch
                       placeholder={tokenS}
                       dropdownMatchSelectWidth={false}
                       size="small"
                       defaultValue={tokenS}
                       className="d-block"
                       onChange={tokenChange.bind(this, 'sell')}
                     >
                       {
                         tokenSells && tokenSells.map((item, index) => {
                           const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance, symbol:item.symbol, toUnit:true})
                           return <Select.Option key={index} value={item.symbol}><TokenItem token={{symbol:item.symbol,balance:tokenBalance.balance.toString(10)}} /></Select.Option>
                         })
                       }
                     </Select>
                   }
                   onFocus={() => {
                     const amount = form.getFieldValue("amountS")
                     if (amount === '0') {
                       form.setFieldsValue({"amountS": ''})
                     }
                   }}
                   onBlur={() => {
                     const amount = form.getFieldValue("amountS")
                     if (amount === '') {
                       form.setFieldsValue({"amountS": '0'})
                     }
                   }}
                   onChange={amountChange.bind(this, 'sell')}
            />
          )}
          </Form.Item>
        </div>
      </div>
      <div className="row pl0 pr0">
        <div className="col pl0 pr0">
          <Form.Item label={null} colon={false}>
            {form.getFieldDecorator('amountB', {
              initialValue: amountB.toString(10),
              rules: [{
                message: intl.get('common.invalid_number'),
                validator: (rule, value, cb) => tokenFormatter.isValidNumber(value) ? cb() : cb(true)
              }]
            })(
              <Input size="large"
                     placeholder={intl.get('p2p_order.amountb_placeholder')}
                     addonBefore={intl.get('common.buy')}
                     addonAfter={
                       <Select
                         showSearch
                         placeholder={tokenB}
                         dropdownMatchSelectWidth={false}
                         size="small"
                         defaultValue={tokenB}
                         className="d-block"
                         onChange={tokenChange.bind(this, 'buy')}
                       >
                         {
                           tokenBuys && tokenBuys.map((item, index) => {
                             return <Select.Option key={index} value={item.symbol}><TokenItem token={{symbol:item.symbol,balance:item.balance.toString(10)}} /></Select.Option>
                           })
                         }
                       </Select>
                     }
                     onFocus={() => {
                       const amount = form.getFieldValue("amountB")
                       if (amount === '0') {
                         form.setFieldsValue({"amountB": ''})
                       }
                     }}
                     onBlur={() => {
                       const amount = form.getFieldValue("amountB")
                       if (amount === '') {
                         form.setFieldsValue({"amountB": '0'})
                       }
                     }}
                     onChange={amountChange.bind(this, 'buy')}
              />
            )}
          </Form.Item>
        </div>
      </div>
      {
        tokenB && tokenS &&
        <div className="mt10">
          <div>{intl.get('p2p_order.token_balance')}</div>
          <div className="zb-b">
            <MenuItem label={`${tokenS}`} value={balanceS.toString()} />
            <MenuItem label={`${tokenB}`} value={balanceB.toString()} />
          </div>
        </div>
      }
      <div className="mt10">
        <div>{intl.get('p2p_order.order_detail')}</div>
        <div className="zb-b">
          {false && <MenuItem label={intl.get('price')} value={`${price.toString(10)} ${tokenB}`} />}
          <MenuItem label={intl.get('common.worth')} value={
            <div>
              <div>{worthDisplay(intl.get('common.sell'), tokenS, amountS)}</div>
              <div>{worthDisplay(intl.get('common.buy'), tokenB, amountB)}</div>
            </div>
          } />
          <MenuItem label={intl.get('common.ttl')} action={<span onClick={()=>{}} className="cursor-pointer">06-10 10:00 ~ 06-15 24:00<Icon type="right" className="ml5" /></span>} />
        </div>
      </div>
      <div className="mb15"></div>
      <Button type="primary" size="large" className="d-block w-100" onClick={handleSubmit} loading={p2pOrder.loading}>{intl.get('p2p_order.generate_order')}</Button>
      { false && <Alert type="info" title={<div className="color-black-1">分享给指定的人</div>} theme="light" size="small"/> }
      <div className="row pt10 pl0 pr0 pb10">
        {intl.getHTML('p2p_order.instruction')}
        <div className="pt5">{intl.getHTML('p2p_order.notice')}</div>
      </div>
    </div>
  );
};

function mapToProps(state) {
  return {
    p2pOrder:state.p2pOrder,
    wallet:state.wallet,
    balance:state.sockets.balance.items,
    marketcap:state.sockets.marketcap.items,
    tokens:state.tokens.items,
    settings:state.settings,
    gas:state.gas,
    pendingTx:state.pendingTx
  }
}

export default Form.create()(connect(mapToProps)(TradeByP2P));


