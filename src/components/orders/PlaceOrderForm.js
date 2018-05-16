import React from 'react';
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Tooltip,Popconfirm,Popover,DatePicker} from 'antd';
import intl from 'react-intl-universal';
import config from 'common/config'
import * as datas from 'common/config/data'
import * as fm from 'LoopringJS/common/formatter'
import * as orderFormatter from 'modules/orders/formatters'
import * as selectors from 'modules/formatter/selectors'
import moment from 'moment'
import ReactDOM from 'react-dom'
import Notification from 'LoopringUI/components/Notification'

class PlaceOrderForm extends React.Component {

  render() {
    const {form, placeOrder, settings, balance, wallet, marketcap} = this.props
    const milliLrcFee = placeOrder.sliderMilliLrcFee >0 ? placeOrder.sliderMilliLrcFee : settings.trading.lrcFee
    const ttlValue = placeOrder.timeToLive >0 ? placeOrder.timeToLive : settings.trading.timeToLive
    const ttlUnit = placeOrder.timeToLiveUnit >0 ? placeOrder.timeToLiveUnit : settings.trading.timeToLiveUnit

    function sideChange(value) {
      placeOrder.sideChangeEffects({side:value})
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    function inputChange(type, e) {
      let price = 0, amount = 0
      const marketConfig = config.getMarketBySymbol(placeOrder.left.symbol, placeOrder.right.symbol)
      if (type === 'price') {
        price = e.target.value.toString()
        if(!orderFormatter.isValidAmount(price)) return false
        price = orderFormatter.formatPriceByMarket(price, marketConfig)
        //e.target.value = price
        placeOrder.priceChangeEffects({priceInput:price})
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if(!orderFormatter.isValidAmount(amount)) return false
        const tokenRConfig = config.getTokenBySymbol(placeOrder.right.symbol)
        amount = orderFormatter.formatAmountByMarket(amount, tokenRConfig, marketConfig)
        //e.target.value = amount
        placeOrder.amountChangeEffects({amountInput:amount})
      }
    }

    function validateAmount(value) {
      return value > 0
    }

    function amountSliderChange(e) {
      placeOrder.amountSliderChangeEffects({amountSlider:e})
    }

    function lrcFeeChange(v) {
      placeOrder.milliLrcFeeChangeEffects({milliLrcFee:v})
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

    const amountSlider = form.getFieldDecorator('amountSlider', {
      initialValue: 0,
      rules: []
    })(
      <Slider className="place-order-amount-percentage" min={0} max={100} marks={marks} onChange={amountSliderChange.bind(this)}
              tipFormatter={null} disabled={fm.toBig(placeOrder[placeOrder.side].availableAmount).lt(0)}/>
    )

    const totalWorth = (
      <span className="">
        {placeOrder.total && fm.toBig(placeOrder.total).gt(0) ? ` ≈ $${fm.toBig(placeOrder.total).toFixed(2)}` : ''}
      </span>
    )

    const editLRCFee = (
      <Popover overlayClassName="place-order-form-popover" title={<div className="pt5 pb5">{intl.get('trade.custom_lrc_fee_title')}</div>} content={
        <div>
          <div className="pb5 fs12">{intl.get('trade.current_lrc_fee_ratio')} : {milliLrcFee}‰</div>
          <div className="pb15 fs12">{intl.get('trade.current_lrc_fee')} : {placeOrder.lrcFee} LRC</div>
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
        <a className="fs12 pointer color-black-3"><i className="icon-pencil tradingFee"></i></a>
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
      <Popover overlayClassName="place-order-form-popover p0" ref="popover"
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
        <a className="fs12 pointer color-black-3"><i className="icon-pencil tradingFee"></i></a>
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
      //TODO unlock check, moved before sign
      const lrcBalance = selectors.getAssetByToken(balance.items, 'LRC', true)
      if(!lrcBalance || lrcBalance.balance.lessThan(900)){
        // TODO !await config.isinWhiteList(window.WALLET.getAddress())
        if(config.getChainId() !== 7107171){
          Notification.open({
            type:'warning',
            message:intl.get('trade.not_inWhiteList'),
            description:intl.get('trade.not_allow')
          });
          return
        }
      }
      const address = wallet.address
      if(!address) {
        //TODO
        // Notification.open({
        //   type:'warning',
        //   message:intl.get('trade.not_inWhiteList'),
        //   description:intl.get('trade.not_allow')
        // });
        // return
      }
      form.validateFields((err, values) => {
        if (!err) {
          placeOrder.submitButtonLoadingChange({submitButtonLoading:true})
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
          if (values.marginSplit) {
            tradeInfo.marginSplit = Number(values.marginSplit)
          }
          const totalWorth = orderFormatter.calculateWorthInLegalCurrency(marketcap, placeOrder.right.symbol, tradeInfo.total)
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
          tradeInfo.milliLrcFee = milliLrcFee
          tradeInfo.lrcFee = placeOrder.lrcFee
          orderFormatter.tradeVerification(wallet, tradeInfo, placeOrder.sell, placeOrder.buy, this.props.txs)
          if(tradeInfo.error) {
            tradeInfo.error.map(item=>{
              Notification.open({
                message: intl.get('trade.send_failed'),
                description: intl.get('trade.eth_is_required', {required:item.value.required}),
                type:'error',
              })
            })
            placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
            return
          }
          showTradeModal(tradeInfo)
          placeOrder.submitButtonLoadingChange({submitButtonLoading:false})
        }
      });
    }

    const showTradeModal = (tradeInfo) => {
      this.props.dispatch({
        type: 'modals/modalChange',
        payload: {
          id: 'trade/confirm',
          visible: true,
          side : placeOrder.side,
          pair : placeOrder.pair,
          ...tradeInfo
        }
      })
    }

    return (
      <div>
        <div className="card-body form-inverse">
          <ul className="pair-price text-inverse">
            <li>
              <h4>{placeOrder.left.symbol}</h4><span className="token-price">0.00009470 USD</span><span className="text-up">+0.98</span></li>
            <li>
              <h4>{placeOrder.right.symbol}</h4><span className="token-price">0.56 USD</span><span className="text-up">+0.45</span></li>
          </ul>
          {placeOrder.side === 'buy' &&
          <ul className="token-tab">
            <li className="buy active"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {placeOrder.left.symbol}</a></li>
            <li className="sell"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {placeOrder.left.symbol}</a></li>
          </ul>
          }
          {placeOrder.side === 'sell' &&
          <ul className="token-tab">
            <li className="buy"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {placeOrder.left.symbol}</a></li>
            <li className="sell active"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {placeOrder.left.symbol}</a></li>
          </ul>
          }
          <div className="tab-content">
            <div className="tab-pane active" id="b1">
              {placeOrder.sell && <small className="balance text-inverse">{placeOrder.sell.token.symbol} Balance: <span>{placeOrder.sell.token.balanceDisplay}</span></small>}
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
                         suffix={<span className="fs14 color-black-4">{placeOrder.right.symbol}</span>}
                         onChange={inputChange.bind(this, 'price')}
                         onFocus={() => {
                           const amount = form.getFieldValue("price")
                           if (amount === 0) {
                             form.setFieldsValue({"price": ''})
                           }
                         }}
                         onBlur={() => {
                           const amount = form.getFieldValue("price")
                           if (amount === '') {
                             form.setFieldsValue({"price": 0})
                           }
                         }}/>
                )}
              </Form.Item>
              <Form.Item label={null} colon={false} extra={
                <div>
                  <div className="fs10" style={{marginBottom:"-10px"}}>{amountSlider}</div>
                </div>
              }>
                {form.getFieldDecorator('amount', {
                  initialValue: 0,
                  rules: [{
                    message: intl.get('trade.amount_verification_message'),
                    validator: (rule, value, cb) => validateAmount(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={`Amount`}
                         suffix={<span className="fs14 color-black-4">{placeOrder.left.symbol}</span>}
                         onChange={inputChange.bind(this, 'amount')}
                         onFocus={() => {
                            const amount = Number(form.getFieldValue("amount"))
                            if (amount === 0) {
                              form.setFieldsValue({"amount": ''})
                            }
                         }}
                         onBlur={() => {
                            const amount = form.getFieldValue("amount")
                            if (amount === '') {
                              form.setFieldsValue({"amount": 0})
                            }
                         }}/>
                )}
              </Form.Item>
              <div className="text-inverse text-secondary">
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">Total</span><span><span>{placeOrder.total}</span>{placeOrder.right.symbol}{totalWorth}</span>
                  </div>
                </div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">LRC Fee <i className="icon-info tradingfeetip"></i></span>
                    <span>
                      <span>{editLRCFee}</span>
                      <span></span>
                      <span className="offset-md">{placeOrder.lrcFee}LRC ({milliLrcFee}‰)</span>
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
                <Button type="primary" className="btn-block" onClick={handleSubmit} loading={placeOrder.submitButtonLoading}>Place Order</Button>
                <Button type="danger" className="btn-block">Place Order</Button>
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
