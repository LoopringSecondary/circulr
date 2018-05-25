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
var _ = require('lodash');

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
    if(pair && side) {
      if(side === 'buy' || side === 'sell'){
        const l = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
        const r = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
        const marketConfig = config.getMarketBySymbol(l.symbol, r.symbol)
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
      100: '100％'
    };

    const amountSliderField = form.getFieldDecorator('amountSlider', {
      initialValue: 0,
      rules: []
    })(
      <Slider className="place-order-amount-percentage" min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)}
              tipFormatter={null} disabled={placeOrder.side === 'sell' ? fm.toBig(sell.availableAmount).lt(0) : fm.toBig(buy.availableAmount).lt(0)}/>
    )

    const totalWorthDisplay = (
      <span className="">
        {total && fm.toBig(total).gt(0) ? ` ≈ $${orderFormatter.calculateWorthInLegalCurrency(marketcap.items, right.symbol, total).toFixed(2)}` : ''}
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
                               <Radio className="mb5" value="1hour">1 {intl.get('trade.hour')}</Radio>
                               <Radio className="mb5" value="1day">1 {intl.get('trade.day')}</Radio>
                               <Radio className="mb5" value="1week">1 {intl.get('trade.week')}</Radio>
                               <Radio className="mb5" value="1month">1 {intl.get('trade.month')}</Radio>
                               <Radio className="mb5" value="more">{intl.get('trade.more')}</Radio>
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
        case 'minute': ttlInSecond = ttl * 60 ; ttlShow = `${ttl} ${intl.get('trade.minute')}`; break;
        case 'hour': ttlInSecond = ttl * 3600 ; ttlShow = `${ttl} ${intl.get('trade.hour')}`; break;
        case 'day': ttlInSecond = ttl * 86400; ttlShow = `${ttl} ${intl.get('trade.day')}`; break;
        case 'week': ttlInSecond = ttl * 7 * 86400; ttlShow = `${ttl} ${intl.get('trade.week')}`; break;
        case 'month': ttlInSecond = ttl * 30 * 86400; ttlShow = `${ttl} ${intl.get('trade.month')}`; break;
      }
    } else {
      if(placeOrder.timeToLiveStart && placeOrder.timeToLiveEnd) {
        ttlShow = `${placeOrder.timeToLiveStart.format("lll")} ~ ${placeOrder.timeToLiveEnd.format("lll")}`
      }
    }

    async function handleSubmit() {
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

          if(!wallet.address) { // locked, do not verify
            //TODO notification to user, order verification in confirm page(unlocked)
            Notification.open({
              message: intl.get('trade.place_order_failed'),
              type: "error",
              description: ''
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
          // if(!lrcBalance || lrcBalance.balance.lessThan(900)){
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
          let currency = 'USD';// TODO settings.preference.currency
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
          await orderFormatter.tradeVerification(balance.items, wallet, tradeInfo, sell.token, buy.token, left.symbol, right.symbol, side, pendingTx.items, gasPrice)
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

          const {order, signed, unsigned} = await orderFormatter.signOrder(tradeInfo, wallet)
          showTradeModal(tradeInfo, order, signed, unsigned)
          placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
        }
      });
    }

    const showTradeModal = (tradeInfo, order, signed, unsigned) => {
      placeOrder.toConfirm({signed, unsigned})
      dispatch({type:'layers/showLayer', payload: {id: 'placeOrderConfirm', side, pair, tradeInfo, order}})
    }

    return (
      <div>
        <div className="card-body form-inverse">
          <ul className="pair-price text-inverse">
            <li>
              <h4>{left.symbol}</h4><span className="token-price">0.00009470 USD</span><span className="text-up">+0.98</span></li>
            <li>
              <h4>{right.symbol}</h4><span className="token-price">0.56 USD</span><span className="text-up">+0.45</span></li>
          </ul>
          {placeOrder.side === 'buy' &&
          <ul className="token-tab">
            <li className="buy active"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {left.symbol}</a></li>
            <li className="sell"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {left.symbol}</a></li>
          </ul>
          }
          {placeOrder.side === 'sell' &&
          <ul className="token-tab">
            <li className="buy"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {left.symbol}</a></li>
            <li className="sell active"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {left.symbol}</a></li>
          </ul>
          }
          <div className="tab-content">
            <div className="blk-sm"></div>
            <div className="" id="b1">
              {sell && <small className="balance">{sell.token.symbol} Balance: <span>{sell.token.balance.toString(10)}</span></small>}
              <div className="blk-sm"></div>
              <Form.Item label={null} colon={false}>
                {form.getFieldDecorator('price', {
                  initialValue: placeOrder.priceInput,
                  rules: [{
                    message: intl.get('trade.price_verification_message'),
                    validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={`Price`}
                         suffix={<span className="fs14 color-black-4">{right.symbol}</span>}
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
                    message: intl.get('trade.amount_verification_message'),
                    validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={`Amount`}
                         suffix={<span className="fs14 color-black-4">{left.symbol}</span>}
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
              <div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">Total</span><span><span>{total.toString(10)}</span>{right.symbol}{totalWorthDisplay}</span>
                  </div>
                </div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">LRC Fee <i className="icon-info tradingfeetip"></i></span>
                    <span>
                      <span>{editLRCFee}</span>
                      <span></span>
                      <span className="offset-md">{lrcFee}LRC ({milliLrcFee}‰)</span>
                    </span>
                  </div>
                </div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">Time to live <i className="icon-info"></i></span>
                    <span>
                      <span>{editOrderTTLPattern}</span>
                      <span className="offset-md">{ttlShow}</span>
                    </span>
                  </div>
                </div>
                <div className="blk"></div>
                {
                  side === 'buy' && <Button className="btn-block btn-primary" onClick={handleSubmit} loading={placeOrder.submitButtonLoading}>Place Order</Button>
                }
                {
                  side === 'sell' && <Button className="btn-block btn-danger" onClick={handleSubmit} loading={placeOrder.submitButtonLoading}>Place Order</Button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
