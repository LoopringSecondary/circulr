import React from 'react';
import {Button, Form, Icon, Input, Popover, Radio, Slider, Tabs,Card} from 'antd'
import intl from 'react-intl-universal'
import {calculateGas} from 'LoopringJS/common/utils'
import {configs} from 'common/config/data'
import {isValidInteger} from 'modules/orders/formatters'
import * as fm from 'LoopringJS/common/formatter'
import {connect} from 'dva'

const GasFeeForm = (props) => {
  const {gas, gasFee, form, dispatch} = props
  const {onGasChange, advanced} = gasFee
  const gasPriceStore = gas.gasPrice
  let gasLimit = 0
  if(gas.tabSelected === 'easy') {
    gasLimit = fm.toNumber(gas.fixedGasLimit)
  } else {
    gasLimit = fm.toNumber(gas.gasLimit)
  }
  if(gasPriceStore.last === 0 && form.getFieldValue('gasSelector') === 'last') {
    form.setFieldsValue({'gasSelector':'estimate'})
  }

  function tabChange(value) {
    gas.tabChange({tabSelected:value})
    form.setFieldsValue({'gasSelector' : 'last'})
  }

  function radioChanged(v) {
    if(gas.tabSelected === 'easy') {
      let p = 0
      switch(v.target.value) {
        case 'last':
          p = gasPriceStore.last
          break;
        case 'estimate':
          p = gasPriceStore.estimate
          break;
        case 'custom':
          p = form.getFieldValue('gasPriceSlider')
          break;
        default:
          throw new Error('Data Error')
      }
      if(onGasChange) {
        onGasChange({gasPrice:p})
      }
      gas.currentGasChange({gasPrice:p})
    } else {
      throw new Error('Data Error')
    }
  }

  function gasPriceChanged(v) {
    if(gas.tabSelected === 'easy') {
      if(onGasChange) {
        onGasChange({gasPrice:v})
      }
      gas.currentGasChange({gasPrice:v})
    } else {
      throw new Error('Data Error')
    }
  }

  function inputChange(type, e) {
    if(type === 'gasLimit') {
      gas.gasLimitChange({gasLimit:e.target.value})
      if(onGasChange) {
        onGasChange({gasLimit:e.target.value})
      }
    } else if(type === 'gasPrice'){
      gas.currentGasChange({gasPrice: e})
      if(onGasChange) {
        onGasChange({gasPrice:e})
      }
    } else {
      throw new Error('Data Error')
    }
  }

  const gasShow = (gasPrice, gasLimit, title) => {
    if(gasPrice && gasLimit) {
      const gas = calculateGas(gasPrice, gasLimit);
      return (
        <div>
          <div className="row justify-content-start">{`${title} ${gas.toString(10)} ETH`}</div>
          <div className="row justify-content-start fs14 color-black-3">{`Gas(${gasLimit}) * Gas Price(${gasPrice} Gwei)`}</div>
        </div>
      )
    }
    return <div>{`${title} ${intl.get('gas_setting.none')}`}</div>
  }

  const recommended = (
    <Form.Item label={null} colon={false} className="mb0">
      {form.getFieldDecorator('gasSelector', {
        initialValue:'last',
        rules:[]
      })(
        <Radio.Group className="d-block w-100" onChange={radioChanged}>
          <Radio value='last' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15" disabled={gasPriceStore.last === 0}>
            <div className="pl15 pt10 pb10">
              <div className="fs14 color-black-1">
                {gasShow(gasPriceStore.last, gasLimit, intl.get('gas_setting.gas_selector_last'))}
              </div>
            </div>
          </Radio>
          <Radio value='estimate' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
            <div className="pl15 pt10 pb10">
              <div className="fs14 color-black-1">
                {gasShow(gasPriceStore.estimate, gasLimit, intl.get('gas_setting.gas_selector_estimate'))}
              </div>
            </div>
          </Radio>
          <Radio value='custom' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
            <div className="pt10 pb10">
              <div className="fs14 color-black-1">
                {gasShow(form.getFieldValue('gasPriceSlider'), gasLimit, intl.get('gas_setting.gas_selector_custom'))}
              </div>
              {form.getFieldValue('gasSelector') === 'custom' && form.getFieldDecorator('gasPriceSlider', {
                initialValue:configs.defaultGasPrice,
                rules:[]
              })(
                <Slider min={1} max={99} step={1}
                        marks={{
                          1: intl.get('settings.slow') ,
                          99: intl.get('settings.fast') ,
                        }}
                        onChange={gasPriceChanged}
                />
              )}
            </div>
          </Radio>
        </Radio.Group>
      )}
    </Form.Item>
  )

  return (
    <Card title={<div className="pl15">{intl.get('gas_setting.title')}</div>} className="rs">
      <div className="zb-b">
        {advanced &&
          <Tabs defaultActiveKey="easy" onChange={tabChange}>
            <Tabs.TabPane tab={<div className="pb5">{intl.get('gas_setting.mode_easy_title')}</div>} key="easy">
              {recommended}
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className="pb5">{intl.get('gas_setting.mode_advanced_title')}</div>} key="advance">
              <div className="fs12 color-black-3" hidden>
                { intl.get('settings.gasPrice')+':  '+ gasPriceStore.last+" Gwei" }
              </div>
              <div className="fs14 color-black-1 pl10 pr10">
                <div className="mb15">
                  <Form.Item label={intl.get('gas_setting.gas_limit')} colon={false} className="mb0">
                    {form.getFieldDecorator('gasLimit', {
                      initialValue:'',
                      rules:[{
                        message:intl.get('trade.integer_verification_message'),
                        validator: (rule, value, cb) => isValidInteger(value) ? cb() : cb(true)
                      }]
                    })(
                       <Input className="" onChange={inputChange.bind(this, 'gasLimit')}/>
                    )}
                  </Form.Item>
                </div>
                <div className="mb15">
                  <Form.Item label={intl.get('gas_setting.gas_price')} colon={false} className="mb0">
                    {form.getFieldDecorator('gasPrice', {
                      initialValue:1,
                      rules:[]
                    })(
                      <Slider min={1} max={99} step={1}
                              marks={{
                                1: intl.get('token.slow'),
                                99: intl.get('token.fast')
                              }}
                              onChange={inputChange.bind(this, 'gasPrice')}
                      />
                    )}
                </Form.Item>
                </div>
                <div className="mb15 text-left">
                  {
                    form.getFieldValue('gasLimit') && form.getFieldValue('gasPrice') &&
                    <span>
                      {gasShow(form.getFieldValue('gasPrice'), form.getFieldValue('gasLimit'), intl.get('gas_setting.gas_fee'))}
                    </span>
                  }
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        }
        {!advanced && recommended
        }
      </div>
    </Card>
  )
}
/*<Containers.Gas initState={{gasLimit}}>*/
    // <GasFee advanced={transfer.token.toLowerCase() === 'eth'}/>
// </Containers.Gas>

export default Form.create()(connect()(GasFeeForm));




