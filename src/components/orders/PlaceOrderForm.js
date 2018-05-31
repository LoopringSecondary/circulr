import React from 'react';
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
var _ = require('lodash');

const MenuItem = (prop)=>{
  return (
    <div className="row pt5 pb5 align-items-center">
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
    const {form, placeOrder, settings, balance, wallet, marketcap, pendingTx, gas, dispatch} = this.props
    const gasResult = getLastGas(gas)
    const gasPrice = gasResult.gasPrice
    const milliLrcFee = placeOrder.sliderMilliLrcFee >0 ? placeOrder.sliderMilliLrcFee : settings.trading.lrcFee
    const ttlValue = placeOrder.timeToLive >0 ? placeOrder.timeToLive : settings.trading.timeToLive
    const ttlUnit = placeOrder.timeToLiveUnit || settings.trading.timeToLiveUnit
    const {pair, side, priceInput, amountInput} = placeOrder
    const amount = orderFormatter.isValidAmount(amountInput) ? fm.toBig(amountInput) : fm.toBig(0)
    const price = orderFormatter.isValidAmount(amountInput) ? fm.toBig(priceInput) : fm.toBig(0)
    const total = amount.times(price)
    let left = {}, right = {}, sell = {}, buy = {}, lrcFee = 0, amountSlider = 0
    let marketConfig = null
    if(pair && side) {
      if(side === 'buy' || side === 'sell'){
        const l = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
        const r = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
        marketConfig = config.getMarketBySymbol(l.symbol, r.symbol)
        if(!marketConfig || !(l && r)) {
          //TODO notification
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
      lrcFee = orderFormatter.calculateLrcFee(marketcap.items, total, milliLrcFee, right.symbol)
    }

    function sideChange(value) {
      placeOrder.sideChangeEffects({side:value})
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
        placeOrder.priceChange({priceInput:price})
      } else if (type === 'amount') {
        const tokenRConfig = config.getTokenBySymbol(right.symbol)
        amount = orderFormatter.formatAmountByMarket(e.target.value.toString(), tokenRConfig, marketConfig)
        //e.target.value = amount
        placeOrder.amountChange({amountInput:amount})
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
      placeOrder.amountChange({amountInput:amount})
    }

    function lrcFeeChange(v) {
      placeOrder.milliLrcFeeChange({milliLrcFee:v})
    }

    function timeToLivePatternChanged(value) {
      if(value === 'advance') {
        const timeToLiveTimeSelector = form.getFieldValue('timeToLiveTimeSelector')
        if(timeToLiveTimeSelector.length === 2) {
          placeOrder.timeToLivePatternChangeEffects({timeToLivePatternSelect:value, timeToLiveStart: timeToLiveTimeSelector[0], timeToLiveEnd: timeToLiveTimeSelector[1]})
        }
      } else {
        placeOrder.timeToLivePatternChangeEffects({timeToLivePatternSelect:value})
      }
    }

    function timeToLiveValueChange(type, e) {
      if(type === 'popular') {
        const ttl = e.target.value
        let timeToLivePopularSetting = true, timeToLive = 1, timeToLiveUnit = ''
        switch (ttl) {
          case '1hour':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'hour'
            break;
          case '1day':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'day'
            break;
          case '1week':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'week'
            break;
          case '1month':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'month'
            break;
          case 'more':
            timeToLivePopularSetting = false
            break;
        }
        placeOrder.timeToLiveEasyTypeChangeEffects({type, timeToLivePopularSetting, timeToLive, timeToLiveUnit})
      } else {
        if (type === 'moreUnit') {
          const ttl = form.getFieldValue('timeToLive')
          const unit = e
          placeOrder.timeToLiveEasyTypeChangeEffects({type, timeToLive: ttl, timeToLiveUnit: unit})
        }
        if (type === 'moreValue') {
          const ttl = e.target.value
          const unit = form.getFieldValue('timeToLiveUnit')
          placeOrder.timeToLiveEasyTypeChangeEffects({type, timeToLive: ttl, timeToLiveUnit: unit})
        }
      }
    }

    function timeToLiveTimeSelected(value) {
      if(value.length === 2) {
        placeOrder.timeToLivePatternChangeEffects({timeToLivePatternSelect:'advance', timeToLiveStart: value[0], timeToLiveEnd: value[1]})
      }
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

    const editLRCFee = (
      <Popover overlayClassName="place-order-form-popover" title={<div className="pt5 pb5">{intl.get('trade.custom_lrc_fee_title')}</div>} content={
        <div>
          <div className="pb5 fs12">{intl.get('trade.current_lrc_fee_ratio')} : {milliLrcFee}‰</div>
          <div className="pb15 fs12">{intl.get('trade.current_lrc_fee')} : {lrcFee} LRC</div>
          {form.getFieldDecorator('lrcFeeSlider', {
            initialValue: milliLrcFee,
            rules: []
          })(
            <Slider min={1} max={50} step={1}
                    marks={{
                      1: intl.get('token.slow'),
                      50: intl.get('token.fast')
                    }}
                    onChange={lrcFeeChange.bind(this)}
            />
          )}
        </div>
      } trigger="click">
        <a className="fs12 pointer text-dark"><i className="icon-pencil tradingFee"></i></a>
      </Popover>
    )

    const customPanelStyle = {
      background: '#fff',
      borderRadius: 4,
      border: 'none',
      overflow: 'hidden',
    };

    const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
      initialValue: "minute",
      rules: []
    })(
      <Select style={{width: 90}} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={timeToLiveValueChange.bind(this, 'moreUnit')}>
        <Select.Option value="minute">{intl.get('trade.minute')}</Select.Option>
        <Select.Option value="hour">{intl.get('trade.hour')}</Select.Option>
        <Select.Option value="day">{intl.get('trade.day')}</Select.Option>
      </Select>
    )

    const editOrderTTLPattern = (
      <Popover overlayClassName="place-order-form-popover" ref="popover"
               title={null &&<div className="pt5 pb5">{intl.get('trade.custom_time_to_live_title')}</div>}
               content={
                 <div style={{width:'382px'}}>
                   <Collapse accordion style={customPanelStyle} defaultActiveKey={['easy']} onChange={timeToLivePatternChanged}>
                     <Collapse.Panel header={intl.get('trade.order_ttl_expire_in')} key="easy">
                       <div className="pt5 pb5">
                         <Form.Item className="ttl mb0" colon={false} label={null}>
                           {form.getFieldDecorator('timeToLivePopularSetting')(
                             <Radio.Group onChange={timeToLiveValueChange.bind(this, 'popular')}>
                               <Radio className="mb5" value="1hour">1 {intl.get('hour')}</Radio>
                               <Radio className="mb5" value="1day">1 {intl.get('day')}</Radio>
                               <Radio className="mb5" value="1week">1 {intl.get('week')}</Radio>
                               <Radio className="mb5" value="1month">1 {intl.get('month')}</Radio>
                               <Radio className="mb5" value="more">{intl.get('more')}</Radio>
                             </Radio.Group>
                           )}
                         </Form.Item>
                         {!placeOrder.timeToLivePopularSetting &&
                         <Form.Item className="mb0 d-block ttl" colon={false} label={null}>
                           {form.getFieldDecorator('timeToLive', {
                             rules: [{
                               message: intl.get('trade.integer_verification_message'),
                               validator: (rule, value, cb) => orderFormatter.validateOptionInteger(value) ? cb() : cb(true)
                             }]
                           })(
                             <Input className="d-block w-100" placeholder={intl.get('trade.time_to_live_input_place_holder')} size="large" addonAfter={timeToLiveSelectAfter}
                                    onChange={timeToLiveValueChange.bind(this, 'moreValue')}/>
                           )}
                         </Form.Item>}
                       </div>
                     </Collapse.Panel>
                     <Collapse.Panel header={intl.get('trade.order_ttl_from_to')} key="advance">
                       <Form.Item className="mb5 ttl" colon={false} label={null}>
                         {form.getFieldDecorator('timeToLiveTimeSelector', {
                           initialValue:[moment(), moment().add(1, 'days')]
                         })(
                           <DatePicker.RangePicker
                             locale={'en-US'}
                             getCalendarContainer={trigger =>
                             {
                               return ReactDOM.findDOMNode(this.refs.popover);
                             }
                             }
                             showTime={{ format: 'HH:mm' }}
                             format="YYYY-MM-DD HH:mm"
                             placeholder={['Start Time', 'End Time']}
                             onChange={timeToLiveTimeSelected}
                           />
                         )}
                       </Form.Item>
                     </Collapse.Panel>
                   </Collapse>
                 </div>
               } trigger="click">
        <a className="fs12 pointer  text-dark"><i className="icon-pencil tradingFee"></i></a>
      </Popover>
    )

    let ttlInSecond = 0, ttlShow = ''
    if(placeOrder.timeToLivePatternSelect === 'easy') {
      const ttl = Number(ttlValue)
      const unit = ttlUnit
      switch(unit){
        case 'minute': ttlInSecond = ttl * 60 ; ttlShow = `${ttl} ${intl.get('minute')}`; break;
        case 'hour': ttlInSecond = ttl * 3600 ; ttlShow = `${ttl} ${intl.get('hour')}`; break;
        case 'day': ttlInSecond = ttl * 86400; ttlShow = `${ttl} ${intl.get('day')}`; break;
        case 'week': ttlInSecond = ttl * 7 * 86400; ttlShow = `${ttl} ${intl.get('week')}`; break;
        case 'month': ttlInSecond = ttl * 30 * 86400; ttlShow = `${ttl} ${intl.get('month')}`; break;
      }
    } else {
      if(placeOrder.timeToLiveStart && placeOrder.timeToLiveEnd) {
        ttlShow = `${placeOrder.timeToLiveStart.format("lll")} ~ ${placeOrder.timeToLiveEnd.format("lll")}`
      }
    }

    async function handleSubmit(orderType, e) {
      if(orderType !== 'p2p_order' && orderType !== 'market_order') {
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
          if(placeOrder.timeToLivePatternSelect === 'easy') {
            tradeInfo.validSince = moment().unix()
            tradeInfo.validUntil = moment().add(ttlInSecond, 'seconds').unix()
          } else {
            tradeInfo.validSince = placeOrder.timeToLiveStart.unix()
            tradeInfo.validUntil = placeOrder.timeToLiveEnd.unix()
          }
          tradeInfo.marginSplit = settings.trading.marginSplit
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          tradeInfo.milliLrcFee = milliLrcFee
          tradeInfo.lrcFee = lrcFee
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
              message: intl.get('trade.place_order_failed'),
              type: "error",
              description: 'to unlock'
            });
            return
          }
          if(!balance.items || !marketcap.items) {
            Notification.open({
              message:intl.get('trade.send_failed'),
              description:intl.get('trade.failed_fetch_data'),
              type:'error'
            })
            return
          }
          placeOrder.submitButtonLoadingChange({submitButtonLoading:true})

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
              message:intl.get('trade.send_failed'),
              description:intl.get('trade.failed_fetch_data'),
              type:'error'
            })
            placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
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
              message:intl.get('trade.not_allowed_place_order_worth_title'),
              description:intl.get('trade.not_allowed_place_order_worth_content', {worth: priceSymbol}),
              type:'error'
            })
            placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
            return
          }
          try {
            await orderFormatter.tradeVerification(balance.items, wallet, tradeInfo, sell.token, buy.token, left.symbol, right.symbol, side, pendingTx.items, gasPrice)
          } catch(e) {
            console.log(e)
            Notification.open({
              message:intl.get('trade.send_failed'),
              description:e.message,
              type:'error'
            })
            placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
            return
          }

          if(tradeInfo.error) {
            tradeInfo.error.map(item=>{
              if(item.value.symbol === 'ETH') {
                Notification.open({
                  message: intl.get('trade.send_failed'),
                  description: intl.get('trade.eth_is_required', {required:item.value.required}),
                  type:'error',
                  actions:(
                    <div>
                      <Button className="alert-btn mr5" onClick={() => dispatch({type:'layers/showLayer', payload: {id: 'receiveToken', symbol:'ETH'}})}>
                        {`${intl.get('tokens.options_receive')} ETH`}
                      </Button>
                    </div>
                  )
                })
              } else if (item.value.symbol === 'LRC') {
                Notification.open({
                  message: intl.get('trade.send_failed'),
                  description: intl.get('trade.lrcfee_is_required', {required:item.value.required}),
                  type:'error',
                  actions:(
                    <div>
                      <Button className="alert-btn mr5" onClick={() => dispatch({type:'layers/showLayer', payload: {id: 'receiveToken', symbol:'LRC'}})}>
                        {`${intl.get('tokens.options_receive')} LRC`}
                      </Button>
                    </div>
                  )
                })
              }
            })
            placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
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
              message:intl.get('trade.send_failed'),
              description:e.message,
              type:'error'
            })
          }
          placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
        }
      });
    }

    const showTradeModal = (tradeInfo, order, signed, unsigned) => {
      placeOrder.toConfirm({signed, unsigned})
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderConfirm', side, pair, tradeInfo, order}})
    }
    const setLRCFee = ()=>{
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderLRCFee', side, pair}})
    }
    const setTTL = ()=>{
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderTTL', side, pair}})
    }



    return (
      <div>
        <div className="card-body form-dark">
          <div className="p10 mb15" style={{border:"1px solid rgba(255,255,255,0.07)"}}>
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
          {placeOrder.side === 'buy' &&
          <ul className="token-tab">
            <li className="buy active"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>{intl.get('buy')} {left.symbol}</a></li>
            <li className="sell"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>{intl.get('sell')} {left.symbol}</a></li>
          </ul>
          }
          {placeOrder.side === 'sell' &&
          <ul className="token-tab">
            <li className="buy"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>{intl.get('buy')} {left.symbol}</a></li>
            <li className="sell active"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>{intl.get('sell')} {left.symbol}</a></li>
          </ul>
          }
          <div className="tab-content">
            <div className="blk-sm"></div>
            <div className="" id="b1">
              {false && sell && <small className="balance">{sell.token.symbol} {intl.get('balance')}: <span>{FormatAmount({value:sell.token.balance.toString(10), precision:marketConfig.pricePrecision})}</span></small>}
              <div className="blk-sm"></div>
              <Form.Item label={null} colon={false}>
                {form.getFieldDecorator('price', {
                  initialValue: placeOrder.priceInput,
                  rules: [{
                    message: intl.get('invalid_number'),
                    validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={intl.get('price')}
                         suffix={<span className="fs14 color-black-3">{right.symbol}</span>}
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
                  <div>{amountSliderField}</div>
                </div>
              }>
                {form.getFieldDecorator('amount', {
                  initialValue: '0',
                  rules: [{
                    message: intl.get('invalid_number'),
                    validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={intl.get('amount')}
                         suffix={<span className="fs14 color-black-3">{left.symbol}</span>}
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
              <div className="pt5 pb5" style={{border:'0px solid rgba(255,255,255,0.07)',margin:'0px 0px'}}>
                <MenuItem label={intl.get('total')} value={<div>{totalDisplay} {right.symbol} {totalWorthDisplay}</div>}  />
                <MenuItem label={intl.get('lrc_fee')} action={<div onClick={setLRCFee} className="cursor-pointer">{lrcFee} LRC <Icon type="right" className="" /></div>}  />
                <MenuItem label={intl.get('ttl')} action={<div onClick={setTTL} className="cursor-pointer">{ttlShow} <Icon type="right" className="" /></div>}  />
                <div hidden className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">LRC Fee <i className="icon-info tradingfeetip"></i></span>
                    <span>
                      <span>{editLRCFee}</span>
                      <span></span>
                      <span className="offset-md"></span>
                    </span>
                  </div>
                </div>
                <div hidden className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">Time to live <i className="icon-info"></i></span>
                    <span>
                      <span>{editOrderTTLPattern}</span>
                      <span className="offset-md">{ttlShow}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb15"></div>
              {
                  side === 'buy' && <Button className="btn btn-block btn-success btn-xlg" onClick={handleSubmit.bind(this, 'market_order')} loading={placeOrder.submitButtonLoading}>Place Buy Order</Button>
                }
                {
                  side === 'sell' && <Button className="btn btn-block btn-danger btn-xlg" onClick={handleSubmit.bind(this, 'market_order')} loading={placeOrder.submitButtonLoading}>Place Sell Order</Button>
                }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
class TokenActions extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        const {item} = this.props
        const gotoTransfer = ()=>{}
        const gotoConvert = ()=>{}
        const gotoReceive = ()=>{}
        const btns = (
          <div style={{width:'180px'}}>
            <Button onClick={gotoTransfer.bind(this,item)} className="d-block w-100 text-left mb5">Send {item.symbol}</Button>
            <Button onClick={gotoReceive.bind(this,{symbol:item.symbol})} className="d-block w-100 text-left mb5">Receive {item.symbol}</Button>
            {
              item.symbol === 'WETH' &&
              <Button onClick={gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">Convert WETH To ETH</Button>
            }
            {
              item.symbol === 'ETH' &&
              <Button onClick={gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">Convert ETH To WETH</Button>
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
            >
              {FormatAmount({value:item.balance.toString(10), precision:item.precision})}
              <Icon type="right" className="ml5" />
            </Popover>
          </div>
        );
      }
    }

export default Form.create({
  // mapPropsToFields(props) {
  //   return {
  //     amount: Form.createFormField(
  //       props.placeOrder.amountInput
  //     ),
  //     amountSlider: Form.createFormField(
  //       props.placeOrder.amountSlider
  //     ),
  //     price: Form.createFormField(
  //       props.placeOrder.priceInput
  //     ),
  //   }
  // }
})(PlaceOrderForm)
