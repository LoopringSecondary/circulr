import React from 'react';
import {Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider,Collapse,Tooltip,Popconfirm,Popover,DatePicker} from 'antd';
import intl from 'react-intl-universal';
import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'
import * as orderFormatter from 'modules/orders/formatters'
import {store} from '../../index'

class PlaceOrderForm extends React.Component {

  render() {
    const state = this.props.placeOrder
    const {form, side, left, right} = this.props

    function sideChange(value) {
      store.dispatch({type:'placeOrder/sideChangeEffects', payload:{side:value}})
    }

    function validatePirce(value) {
      const result = form.validateFields(["amount"], {force:true})
      return Number(value) > 0
    }

    // function calculateLrcFee(total, milliLrcFee) {
    //   const totalWorth = calculateWorthInLegalCurrency(tokenR, total)
    //   if(totalWorth <= 0) {
    //     calculatedLrcFee = 0
    //     return
    //   }
    //   if (!milliLrcFee) {
    //     milliLrcFee = Number(configs.defaultLrcFeePermillage)
    //   }
    //   let userSetLrcFeeInEth = calculateLrcFeeInEth(totalWorth, milliLrcFee)
    //   const minimumLrcfeeInEth = configs.minimumLrcfeeInEth
    //   if(userSetLrcFeeInEth >= minimumLrcfeeInEth){
    //     calculatedLrcFee = calculateLrcFeeByEth(userSetLrcFeeInEth)
    //   } else {
    //     calculatedLrcFee = calculateLrcFeeByEth(minimumLrcfeeInEth)
    //   }
    // }

    function inputChange(type, e) {
      let price = 0, amount = 0
      const marketConfig = config.getMarketBySymbol(state.left.symbol, state.right.symbol)
      if (type === 'price') {
        price = e.target.value.toString()
        if(!orderFormatter.isValidAmount(price)) return false
        price = orderFormatter.formatPriceByMarket(price, marketConfig)
        //e.target.value = price
        store.dispatch({type:'placeOrder/priceChangeEffects', payload:{priceInput:price}})
      } else if (type === 'amount') {
        amount = e.target.value.toString()
        if(!orderFormatter.isValidAmount(amount)) return false
        const tokenRConfig = config.getTokenBySymbol(state.right.symbol)
        amount = orderFormatter.formatAmountByMarket(amount, tokenRConfig, marketConfig)
        //e.target.value = amount
        store.dispatch({type:'placeOrder/amountChangeEffects', payload:{amountInput:amount}})
      }
      // //LRC Fee
      // calculateLrcFee(total, sliderMilliLrcFee)
    }

    function validateAmount(value) {
      return value > 0
    }

    function amountSliderChange(e) {
      store.dispatch({type:'placeOrder/amountSliderChangeEffects', payload:{amountSlider:e}})
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
              tipFormatter={null} disabled={state[state.side].availableAmount <= 0}/>
    )

    return (
      <div>
        <div className="card-body form-inverse">
          <ul className="pair-price text-inverse">
            <li>
              <h4>{state.left.symbol}</h4><span className="token-price">0.00009470 USD</span><span className="text-up">+0.98</span></li>
            <li>
              <h4>{state.right.symbol}</h4><span className="token-price">0.56 USD</span><span className="text-up">+0.45</span></li>
          </ul>
          {state.side === 'buy' &&
          <ul className="token-tab">
            <li className="buy active"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {state.left.symbol}</a></li>
            <li className="sell"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {state.left.symbol}</a></li>
          </ul>
          }
          {state.side === 'sell' &&
          <ul className="token-tab">
            <li className="buy"><a data-toggle="tab" onClick={sideChange.bind(this, 'buy')}>Buy {state.left.symbol}</a></li>
            <li className="sell active"><a data-toggle="tab"onClick={sideChange.bind(this, 'sell')}>Sell {state.left.symbol}</a></li>
          </ul>
          }
          <div className="tab-content">
            <div className="tab-pane active" id="b1">
              {state.sell && <small className="balance text-inverse">{state.sell.token.symbol} Balance: <span>{state.sell.token.balanceDisplay}</span></small>}
              <div className="blk-sm"></div>
              <Form.Item label={null} colon={false}>
                {form.getFieldDecorator('price', {
                  initialValue: state.priceInput,
                  rules: [{
                    message: intl.get('trade.price_verification_message'),
                    validator: (rule, value, cb) => validatePirce(value) ? cb() : cb(true)
                  }]
                })(
                  <Input placeholder="" size="large"
                         prefix={`Price`}
                         suffix={<span className="fs14 color-black-4">{state.right.symbol}</span>}
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
                         suffix={<span className="fs14 color-black-4">{state.left.symbol}</span>}
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
                    <span className="font-bold">Total</span><span><span>{state.total}</span>{state.right.symbol} ≈ $0</span>
                  </div>
                </div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">LRC Fee <i className="icon-info tradingfeetip"></i></span><span><i className="icon-pencil tradingFee"></i><span>0</span><span className="offset-md">LRC (2‰)</span></span>
                  </div>
                </div>
                <div className="form-group mr-0">
                  <div className="form-control-static d-flex justify-content-between">
                    <span className="font-bold">Time to live <i className="icon-info"></i></span><span><i className="icon-pencil timetolive"></i><span>1</span><span className="offset-md">Day</span></span>
                  </div>
                </div>
                <div className="blk"></div>
                <Button type="primary" className="btn-block">Place Order</Button>
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
  mapPropsToFields(props) {
    return {
      amount: Form.createFormField(
        props.placeOrder.amountInput
      ),
      amountSlider: Form.createFormField(
        props.placeOrder.amountSlider
      ),
      price: Form.createFormField(
        props.placeOrder.priceInput
      ),
    }
  }
})(PlaceOrderForm)
