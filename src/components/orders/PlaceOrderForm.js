import React from 'react';
import {connect} from 'dva'
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Tooltip,Popconfirm,Popover,DatePicker} from 'antd';
import intl from 'react-intl-universal';
import config from 'common/config'
import * as datas from 'common/config/data'
import * as fm from 'LoopringJS/common/formatter'
import * as orderFormatter from 'modules/orders/formatters'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import moment from 'moment'
import ReactDOM from 'react-dom'
import Notification from 'LoopringUI/components/Notification'
import {createWallet} from 'LoopringJS/ethereum/account';
import {getLastGas, getEstimateGas} from 'modules/settings/formatters'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {getFormattedTime} from 'modules/formatter/common'


var _ = require('lodash');

const MenuItem = (prop)=>{
  return (
    <div style={{fontFamily:"Open Sans"}} className="row align-items-center">
      <div className="col">
        <span className="fs14 color-white-1 pr10">{prop.label}</span>
      </div>
      {prop.value &&
        <div className="col-auto fs14 color-white-1">
          {prop.value}
        </div>
      }
      {prop.action &&
        <div className="col-auto fs14 color-white-1 text-nowrap text-truncate">
          {prop.action}
        </div>
      }
    </div>
  )
}

class PlaceOrderForm extends React.Component {

  render() {
    const {form, placeOrder, settings, balance, wallet, marketcap, pendingTx, gas, ttl, lrcFee, dispatch} = this.props
    const gasResult = getLastGas(gas)
    const gasPrice = gasResult.gasPrice
    const milliLrcFee = lrcFee.pattern === 'basic' ? lrcFee.lrcFeeSlider : lrcFee.milliLrcFee
    const ttlValue = ttl.timeToLive >0 ? ttl.timeToLive : settings.trading.timeToLive
    const ttlUnit = ttl.timeToLiveUnit || settings.trading.timeToLiveUnit
    const {pair, side, priceInput, amountInput} = placeOrder
    const amount = orderFormatter.isValidAmount(amountInput) ? fm.toBig(amountInput) : fm.toBig(0)
    const price = orderFormatter.isValidAmount(amountInput) ? fm.toBig(priceInput) : fm.toBig(0)
    const total = amount.times(price)
    let left = {}, right = {}, sell = {}, buy = {}, lrcFeeValue = 0, amountSlider = 0
    let marketConfig = null
    if(pair && side) {
      if(side === 'buy' || side === 'sell'){
        const l = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
        const r = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
        marketConfig = config.getMarketBySymbol(l.symbol, r.symbol)
        if(!marketConfig || !(l && r)) {
          throw new Error('Not supported market:'+pair)
        }
        const formAmount = form.getFieldValue('amount')
        const formPrice = form.getFieldValue('price')
        if(formAmount !== undefined && amountInput !== undefined && (formAmount !== '' && formAmount.toString() != amountInput.toString())) {
          form.setFieldsValue({"amount": amountInput})
        }
        if(formPrice !== undefined && (formPrice !== '' && formPrice.toString() !== priceInput.toString())) {
          form.setFieldsValue({"price": priceInput})
        }
        const balanceL = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:l.symbol, toUnit:true})
        const balanceR = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:r.symbol, toUnit:true})
        left = {...l, ...balanceL}
        right = {...r, ...balanceR}
        const amountPrecision = Math.max(0, right.precision - marketConfig.pricePrecision)
        let availableAmount = orderFormatter.calculateAvailableAmount(side, priceInput, left, right, amountPrecision)
        if(side === 'buy') {
          sell = {token : right, availableAmount : 0}
          buy = {token : left, availableAmount : availableAmount}
        } else {
          sell = {token : left, availableAmount : availableAmount}
          buy = {token : right, availableAmount : 0}
        }
        amountSlider = orderFormatter.amountChangeEffectSlider(availableAmount, amountInput)
        const formAmountSlider = form.getFieldValue('amountSlider')
        if(_.isNumber(formAmountSlider) && formAmountSlider !== amountSlider) {
          form.setFieldsValue({"amountSlider": amountSlider})
        }
      } else {
        throw new Error('Not supported side change:'+side)
      }
    }
    if(amount.gt(0) && price.gt(0) && milliLrcFee) {
      const total = price.times(amount)
      lrcFeeValue = orderFormatter.calculateLrcFee(marketcap.items, total, milliLrcFee, right.symbol)
    }

    function sideChange(value) {
      dispatch({type:'placeOrder/sideChangeEffects', payload:{side:value}})
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    function inputChange(type, e) {
      let price = '0', amount = '0'
      const marketConfig = config.getMarketBySymbol(left.symbol, right.symbol)
      if (type === 'price') {
        price = orderFormatter.formatPriceByMarket(e.target.value.toString(), marketConfig)
        //e.target.value = price
        dispatch({type:'placeOrder/priceChange', payload:{priceInput:price}})
      } else if (type === 'amount') {
        const tokenRConfig = config.getTokenBySymbol(right.symbol)
        amount = orderFormatter.formatAmountByMarket(e.target.value.toString(), tokenRConfig, marketConfig)
        //e.target.value = amount
        dispatch({type:'placeOrder/amountChange', payload:{amountInput:amount}})
      }
    }

    function validateAmount(value) {
      return value > 0
    }

    function amountSliderChange(e) {
      let availableAmount = 0
      if(side === 'buy') {
        availableAmount = buy.availableAmount
      } else {
        availableAmount = sell.availableAmount
      }
      const amount = orderFormatter.sliderEffectAmount(availableAmount, e, left, right)
      dispatch({type:'placeOrder/amountChange', payload:{amountInput:amount}})
    }

    const marks = {
      0: '0',
      25: '25％',
      50: '50％',
      75: '75％',
      100: '100'
    };

    const amountSliderField = form.getFieldDecorator('amountSlider', {
      initialValue: 0,
      rules: [] 
    })(
      <Slider className="place-order-amount-percentage" min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)}
              tipFormatter={null} disabled={placeOrder.side === 'sell' ? fm.toBig(sell.availableAmount).lt(0) : fm.toBig(buy.availableAmount).lt(0)}/>
    )

    const totalDisplay = (
      <span>
        {marketConfig && total && fm.toBig(total).gt(0) ? FormatAmount({value:total.toString(10), precision:marketConfig.pricePrecision}) : 0}
      </span>
    )

    const totalWorthDisplay = (
      <span className="">
        {total && fm.toBig(total).gt(0) &&
          <span>≈ {fm.getDisplaySymbol(settings.preference.currency)}
            {FormatAmount({value:orderFormatter.calculateWorthInLegalCurrency(marketcap.items, right.symbol, total).toFixed(2), precision:2})}
          </span>
        }
        {(!total || !fm.toBig(total).gt(0)) &&
          <span></span>
        }
      </span>
    )

    const customPanelStyle = {
      background: '#fff',
      borderRadius: 4,
      border: 'none',
      overflow: 'hidden',
    };

    let ttlInSecond = 0, ttlShow = ''
    if(ttl.timeToLivePatternSelect === 'easy') {
      const ttlNumber = Number(ttlValue)
      const unit = ttlUnit
      switch(unit){
        case 'minute': ttlInSecond = ttlNumber * 60 ; ttlShow = `${ttlNumber} ${intl.get('common.minute')}`; break;
        case 'hour': ttlInSecond = ttlNumber * 3600 ; ttlShow = `${ttlNumber} ${intl.get('common.hour')}`; break;
        case 'day': ttlInSecond = ttlNumber * 86400; ttlShow = `${ttlNumber} ${intl.get('common.day')}`; break;
        case 'week': ttlInSecond = ttlNumber * 7 * 86400; ttlShow = `${ttlNumber} ${intl.get('common.week')}`; break;
        case 'month': ttlInSecond = ttlNumber * 30 * 86400; ttlShow = `${ttlNumber} ${intl.get('common.month')}`; break;
      }
    } else {
      if(ttl.timeToLiveStart && ttl.timeToLiveEnd) {
        //ttlShow = `${ttl.timeToLiveStart.format("lll")} ~ ${ttl.timeToLiveEnd.format("lll")}`
        ttlShow = `${getFormattedTime(ttl.timeToLiveStart,'MM-DD HH:mm')}~${getFormattedTime(ttl.timeToLiveEnd,'MM-DD HH:mm')}`
      }
    }

    async function handleSubmit(orderType, e) {
      if(orderType !== 'market_order') {
        Notification.open({
          message: intl.get('trade.place_order_failed'),
          type: "error",
          description: 'order type'
        });
        return
      }
      form.validateFields(async (err, values) => {
        if (!err) {
          const tradeInfo = {}
          tradeInfo.amount = fm.toBig(values.amount)
          tradeInfo.price = fm.toBig(values.price)
          tradeInfo.total = tradeInfo.amount.times(tradeInfo.price)
          if(ttl.timeToLivePatternSelect === 'easy') {
            tradeInfo.validSince = moment().unix()
            tradeInfo.validUntil = moment().add(ttlInSecond, 'seconds').unix()
          } else {
            tradeInfo.validSince = ttl.timeToLiveStart.unix()
            tradeInfo.validUntil = ttl.timeToLiveEnd.unix()
          }
          tradeInfo.marginSplit = settings.trading.marginSplit
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          tradeInfo.milliLrcFee = milliLrcFee
          tradeInfo.lrcFee = lrcFeeValue
          tradeInfo.delegateAddress = config.getDelegateAddress();
          tradeInfo.protocol = settings.trading.contract.address;
          tradeInfo.gasLimit = config.getGasLimitByType('approve').gasLimit;
          tradeInfo.gasPrice = fm.toHex(Number(gasPrice) * 1e9);
          tradeInfo.pair = pair
          tradeInfo.side = side
          tradeInfo.orderType = orderType

          if(!wallet.address) { // locked, do not verify
            //TODO notification to user, order verification in confirm page(unlocked)
            Notification.open({
              message: intl.get('notifications.title.place_order_failed'),
              type: "error",
              description: intl.get('notifications.message.wallet_locked')
            });
            return
          }
          if(!balance.items || !marketcap.items) {
            Notification.open({
              message:intl.get('notifications.title.place_order_failed'),
              description:intl.get('notifications.message.failed_fetch_data_from_server'),
              type:'error'
            })
            return
          }
          dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:true}})

          //TODO mock
          // const lrcBalance = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:'LRC', toUnit:true})
          // if(!lrcBalance || lrcBalance.balance.lt(900)){
          //   // TODO !await config.isinWhiteList(window.WALLET.getAddress())
          //   if(config.getChainId() !== 7107171){
          //     Notification.open({
          //       type:'warning',
          //       message:intl.get('trade.not_inWhiteList'),
          //       description:intl.get('trade.not_allow')
          //     });
          //     return
          //   }
          // }

          const totalWorth = orderFormatter.calculateWorthInLegalCurrency(marketcap.items, right.symbol, tradeInfo.total)
          if(!totalWorth.gt(0)) {
            Notification.open({
              message:intl.get('notifications.title.place_order_failed'),
              description:intl.get('notifications.message.failed_fetch_data_from_server'),
              type:'error'
            })
            dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:false}})
            return
          }
          let allowed = false
          let currency = settings.preference.currency;
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
              message:intl.get('notifications.title.not_allowed_place_order_worth'),
              description:intl.get('notifications.message.not_allowed_place_order_worth', {worth: priceSymbol}),
              type:'error'
            })
            dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:false}})
            return
          }
          try {
            await orderFormatter.tradeVerification(balance.items, wallet, tradeInfo, sell.token, buy.token, left.symbol, right.symbol, side, pendingTx.items, gasPrice)
          } catch(e) {
            console.log(e)
            Notification.open({
              message:intl.get('notifications.title.place_order_failed'),
              description:e.message,
              type:'error'
            })
            dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:false}})
            return
          }

          if(tradeInfo.error) {
            tradeInfo.error.map(item=>{
              if(item.value.symbol === 'ETH') {
                Notification.open({
                  message: intl.get('notifications.title.place_order_failed'),
                  description: intl.get('notifications.message.eth_is_required', {required:item.value.required}),
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
                  description: intl.get('notifications.message.lrcfee_is_required', {required:item.value.required}),
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
            dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:false}})
            return
          }

          //TODO MOCK
          // const test = new Array()
          // test.push({type:"AllowanceNotEnough", value:{symbol:'LRC', allowance:12, required:123456}})
          // test.push({type:"AllowanceNotEnough", value:{symbol:'WETH', allowance:12, required:123456}})
          // tradeInfo.warn = test

          try {
            const {order, signed, unsigned} = await orderFormatter.signOrder(tradeInfo, wallet)
            showTradeModal(tradeInfo, order, signed, unsigned)
          } catch (e) {
            console.log(e)
            Notification.open({
              message:intl.get('notifications.title.place_order_failed'),
              description:e.message,
              type:'error'
            })
          }
          dispatch({type:'placeOrder/submitButtonLoadingChange', payload:{submitButtonLoading:false}})
        }
      });
    }

    const showTradeModal = (tradeInfo, order, signed, unsigned) => {
      dispatch({type:'placeOrderByLedger/reset', payload: {}})
      dispatch({type:'placeOrderByLoopr/reset', payload: {}})
      dispatch({type:'placeOrderByMetaMask/reset', payload:{}})
      dispatch({type:'placeOrder/toConfirm', payload:{tradeInfo, signed, unsigned}})
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderSteps', side, pair, tradeInfo, order}})
    }
    const setLRCFee = ()=>{
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderLRCFee', side, pair}})
    }
    const setLRCFeeInstant = (feeValue) => {
      dispatch({type:'lrcFee/lrcFeeSliderChange', payload:{lrcFeeSlider:feeValue}})
    }
    const setMaxAmount = (feeValue) => {
      console.log("max amount");
      dispatch({type:'amountSliderChange', payload:{amountSliderChange:feeValue}})
    }
    const setTTL = ()=>{
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderTTL', side, pair}})
    }

    return (
      <div>
        <div className="card-body form-dark" style={{borderRadius:"5px", marginTop:"60px"}}>
        {/*}
          <div className="p10 mb15" style={{border:'1px solid rgba(255,255,255,0.07)',borderRadius:"5px"}}>
            <div className="row pb10">
              <div className="col-auto fs14">{left.symbol}</div>
              <div className="col fs14 text-right">
                <TokenActions item={left} />
              </div>
            </div>
            <div className="row">
              <div className="col-auto fs14">{right.symbol}</div>
              <div className="col fs14 text-right">
                <TokenActions item={right} />
              </div>
            </div>
          </div>
    */}
            <span style={{fontSize:'16px', fontWeight:'600', paddingLeft:'10px', position:'relative', top:'5px'}}>
              {intl.get('common.order_form')}
            </span>
            {placeOrder.side === 'sell' &&
          <ul className="token-tab" style={{width:'45%', marginBottom:'13px'}}>
            <li className="sell active"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>{intl.get('common.sell')}</a></li>
            <li className="buy"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>{intl.get('common.buy')}</a></li>
          </ul>
          }
          {placeOrder.side === 'buy' &&
          <ul className="token-tab" style={{width:'45%', marginBottom:'13px'}}>
            <li className="sell"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>{intl.get('common.sell')}</a></li>
            <li className="buy active"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>{intl.get('common.buy')}</a></li>
          </ul>
          }
          <div className="tab-content">
            <div className="" id="b1">
             {false && sell && <small className="balance">{sell.token.symbol} {intl.get('balance')}: <span>{FormatAmount({value:sell.token.balance.toString(10), precision:marketConfig.pricePrecision})}</span></small>}
              <Form.Item label={null} colon={false}>
                {form.getFieldDecorator('price', {
                  initialValue: placeOrder.priceInput,
                  rules: [{
                    message: intl.get('common.invalid_number'),
                    validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
                  }]
                })(
                  <Input className="orderContainer" placeholder="" size="large"
                         prefix={<span className="orderFormStl">{intl.get('common.price')}</span>}
                         suffix={<span className="orderFormStl" style={{paddingRight:"102px"}}>{right.symbol}</span>}
                         onChange={inputChange.bind(this, 'price')}
                         onFocus={() => {
                           const price = form.getFieldValue("price")
                           if (price === '0') {
                             form.setFieldsValue({"price": ''})
                           }
                         }}
                         onBlur={() => {
                           const price = form.getFieldValue("price")
                           if (price === '') {
                             form.setFieldsValue({"price": '0'})
                           }
                         }}/>
                )}  
              </Form.Item>
              <Form.Item label={null} colon={false} extra={
                <div>
                  {/*<div>{amountSliderField}</div>*/}
                 </div>
              }>
                {form.getFieldDecorator('amount', {
                  initialValue: '0',
                  rules: [{
                    message: intl.get('common.invalid_number'),
                    validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                  }]
                })(
                  <Input className="orderContainer" placeholder="" size="large"
                         prefix={<span className="orderFormStl">{intl.get('common.amount')}</span>}
                         suffix={<span className="orderFormStl">{left.symbol} <button class="btn btn-buy-max" onClick={setMaxAmount.bind(this, 100)} >{intl.get('common.buy_max')}</button> </span>}
                         onChange={inputChange.bind(this, 'amount')}
                         onFocus={() => {
                            const amount = form.getFieldValue("amount")
                            if (amount === '0') {
                              form.setFieldsValue({"amount": ''})
                            }
                         }}
                         onBlur={() => {
                            const amount = form.getFieldValue("amount")
                            if (amount === '') {
                              form.setFieldsValue({"amount": '0'})
                            }
                         }}/>
                )}
              </Form.Item>
              <div className="pt5 pb5" style={{border:'0px solid rgba(255,255,255,0.07)',margin:'15px 0px', paddingLeft:'3px'}}>
                  <button class="btn btn-fee-slow" onClick={setLRCFeeInstant.bind(this, 10)} >{intl.get('common.gas_slow')}</button>
                  <button id="defaultChecked" class="btn btn-fee-standard" onClick={setLRCFeeInstant.bind(this, 30)} >{intl.get('common.gas_standard')}</button>
                  <button class="btn btn-fee-fast" onClick={setLRCFeeInstant.bind(this, 50)} >{intl.get('common.gas_fast')}</button>                
                <div className="mt70">
                <MenuItem label={intl.get('common.total')} value={<div>{totalDisplay} {right.symbol} {totalWorthDisplay}</div>} />
                <MenuItem label={intl.get('common.lrc_fee')} action={<div onClick={setLRCFee} className="cursor-pointer">{lrcFeeValue} LRC <Icon type="right" className="" /></div>}  />
                </div>
          {/*}  <MenuItem label={intl.get('common.ttl')} action={<div onClick={setTTL} className="cursor-pointer">{ttlShow} <Icon type="right" className="" /></div>}  /> */}
              </div>
              <div className="mb15"></div>
              {
                  side === 'sell' && <Button className="btn btn-block btn-danger btn-xlg" onClick={handleSubmit.bind(this, 'market_order')} loading={placeOrder.submitButtonLoading}>{intl.get('actions.place_sell_order')}</Button>
                }
                {
                  side === 'buy' && <Button className="btn btn-block btn-danger btn-xlg" onClick={handleSubmit.bind(this, 'market_order')} loading={placeOrder.submitButtonLoading}>{intl.get('actions.place_buy_order')}</Button>

                }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
@connect()
class TokenActions extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        const {item} = this.props
        const gotoTransfer = (item)=>{
          this.props.dispatch({
            type:'layers/showLayer',
            payload:{id:'transferToken'},
          })
          this.props.dispatch({
            type: 'transfer/assignedtokenChange',
            payload: {
              assignedToken:item.symbol
            }
          })
        }
        const gotoConvert = (item)=>{
          this.props.dispatch({
            type:'layers/showLayer',
            payload:{
              id:'convertToken',
              token:item.symbol,
              showFrozenAmount: false,
            },
          })
        }
        const gotoReceive = (item)=>{
          this.props.dispatch({
            type:'layers/showLayer',
            payload:{id:'receiveToken',item},
          })
        }
        const btns = (
          <div style={{width:'180px'}}>
            <Button onClick={gotoTransfer.bind(this,item)} className="d-block w-100 text-left mb5">Send {item.symbol}</Button>
            <Button onClick={gotoReceive.bind(this,{symbol:item.symbol})} className="d-block w-100 text-left mb5">Receive {item.symbol}</Button>
            {
              item.symbol === 'WETH' &&
              <Button onClick={gotoConvert.bind(this,{symbol:"WETH"})} className="d-block w-100 text-left mb5">Convert WETH To ETH</Button>
            }
            {
              item.symbol === 'WETH' &&
              <Button onClick={gotoConvert.bind(this,{symbol:"ETH"})} className="d-block w-100 text-left mb5">Convert ETH To WETH</Button>
            }
          </div>
        )
        return (
          <div className="more token-action" onClick={e=>{ e.stopPropagation();e.preventDefault()}}>
            <Popover
              title={null}
              placement="right"
              arrowPointAtCenter
              content={btns}
              overlayClassName=""
            >
              {FormatAmount({value:item.balance.toString(10), precision:item.precision})}
              <Icon type="right" className="ml5" />
            </Popover>
          </div>
        );
      }
}

export default Form.create()(connect()(PlaceOrderForm));