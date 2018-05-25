import React from 'react';
import {Button, Form, Icon, Input, Popover, Radio, Slider, Tabs} from 'antd'
import intl from 'react-intl-universal'
import {calculateGas} from 'LoopringJS/common/utils'
import {configs} from 'common/config/data'
import {isValidInteger} from 'modules/orders/formatters'
import * as fm from 'LoopringJS/common/formatter'

const GasFeeForm = (props) => {
  const {gas, form, onGasChange,advanced} = props
  const gasPriceStore = gas.gasPrice
  const gasLimitStore = fm.toNumber(gas.gasLimit)
  const fixedGasLimit = gas.fixedGasLimit ? fm.toNumber(gas.fixedGasLimit) : 0
  const gasLimit = fixedGasLimit || gasLimitStore

  if(gasPriceStore.last === 0 && form.getFieldValue('gasSelector') === 'last') {
    form.setFieldsValue({'gasSelector':'estimate'})
  }

  function tabChange(value) {
    gas.tabChange({tabSelected:value})
    form.setFieldsValue({'gasSelector' : 'last'})
  }

  function handleSubmit() {
    form.validateFields((err,values) => {
      let p = 0, l = 0
      switch(gas.tabSelected){
        case 'easy':
          if(!err || (!err.gasSelector && !err.gasPriceSlider)){
            l = gasLimit
            switch(form.getFieldValue('gasSelector')) {
              case 'last':
                p = gasPriceStore.last
                break;
              case 'estimate':
                p = gasPriceStore.estimate
                break;
              case 'custom':
                p = form.getFieldValue('gasPriceSlider')
                break;
            }
            if(onGasChange) {
              onGasChange({gasPrice:p})
            }
            gas.gasChange({gasPrice:p, gasLimit:l})
            gas.visibleChange({visible:false})
          }
          break;
        case 'advance':
          if(!err || (!err.gasPrice && !err.gasLimit)){
            p = form.getFieldValue('gasPrice')
            l = form.getFieldValue('gasLimit')
            gas.gasChange({gasPrice:p, gasLimit:l})
            if(onGasChange) {
              onGasChange({gasPrice:p, gasLimit:l})
            }
            gas.visibleChange({visible:false})
          }
          break;
      }
    });
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
    return <div>{`${title} 无`}</div>
  }

  const handleVisibleChange = (visible) => {
    gas.visibleChange({visible})
  }

  return (
    <Popover overlayClassName="place-order-form-popover"
             content={
               <div>
                 <div className="pb10 fs16 color-black-1 zb-b-b">Gas Fee</div>
                 <div className="zb-b"  style={{width:'320px'}}>
                   {advanced && <Tabs defaultActiveKey="easy" onChange={tabChange}>
                     <Tabs.TabPane tab={<div className="pb5">Recommended</div>} key="easy">
                       <Form.Item label={null} colon={false} className="mb0">
                         {form.getFieldDecorator('gasSelector', {
                           initialValue:'last',
                           rules:[]
                         })(
                           <Radio.Group className="d-block w-100">
                             <Radio value='last' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15" disabled={gasPriceStore.last === 0}>
                               <div className="ml5 pt10 pb10">
                                 <div className="fs14 color-black-1">
                                   {gasShow(gasPriceStore.last, gasLimit, '上一次')}
                                 </div>
                               </div>
                             </Radio>
                             <Radio value='estimate' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                               <div className="ml5 pt10 pb10">
                                 <div className="fs14 color-black-1">
                                   {gasShow(gasPriceStore.estimate, gasLimit, '推荐')}
                                 </div>
                               </div>
                             </Radio>
                             <Radio value='custom' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                               <div className="ml5 pt10 pb10">
                                 <div className="fs14 color-black-1">
                                   {gasShow(form.getFieldValue('gasPriceSlider'), gasLimit, '自定义')}
                                 </div>
                                 <div>
                                   <Form.Item label={null} colon={false} className="mb0">
                                     {form.getFieldDecorator('gasPriceSlider', {
                                       initialValue:configs.defaultGasPrice,
                                       rules:[]
                                     })(
                                       <Slider min={1} max={99} step={1}
                                               marks={{
                                                 1: intl.get('settings.slow') ,
                                                 99: intl.get('settings.fast') ,
                                               }}
                                       />
                                     )}
                                   </Form.Item>
                                 </div>
                               </div>
                             </Radio>
                           </Radio.Group>
                         )}
                       </Form.Item>
                     </Tabs.TabPane>
                     <Tabs.TabPane tab={<div className="pb5">Advanced</div>} key="advance">
                       <div className="fs12 color-black-3" hidden>
                         { intl.get('settings.gasPrice')+':  '+ gasPriceStore.last+" Gwei" }
                       </div>
                       <div className="fs14 color-black-1 pl10 pr10">
                         <div className="mb15">
                           <Form.Item label='Gas Limit' colon={false} className="mb0">
                             {form.getFieldDecorator('gasLimit', {
                               initialValue:'',
                               rules:[{
                                 message:intl.get('trade.integer_verification_message'),
                                 validator: (rule, value, cb) => isValidInteger(value) ? cb() : cb(true)
                               }]
                             })(
                                <Input className="" />
                             )}
                           </Form.Item>
                         </div>
                         <div className="mb15">
                           <Form.Item label='Gas Price' colon={false} className="mb0">
                             {form.getFieldDecorator('gasPrice', {
                               initialValue:1,
                               rules:[]
                             })(
                               <Slider min={1} max={99} step={1}
                                       marks={{
                                         1: intl.get('token.slow'),
                                         99: intl.get('token.fast')
                                       }}
                               />
                             )}
                         </Form.Item>
                         </div>
                         <div className="mb15 text-left">
                           {
                             form.getFieldValue('gasLimit') && form.getFieldValue('gasPrice') &&
                             <span>
                               {gasShow(form.getFieldValue('gasPrice'), form.getFieldValue('gasLimit'), 'Gas')}
                             </span>
                           }
                         </div>
                       </div>
                     </Tabs.TabPane>
                   </Tabs>}
                   {!advanced &&
                   <Form.Item label={null} colon={false} className="mb0">
                     {form.getFieldDecorator('gasSelector', {
                       initialValue:'last',
                       rules:[]
                     })(
                       <Radio.Group className="d-block w-100">
                         <Radio value='last' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15" disabled={gasPriceStore.last === 0}>
                           <div className="ml5 pt10 pb10">
                             <div className="fs14 color-black-1">
                               {gasShow(gasPriceStore.last, gasLimit, '上一次')}
                             </div>
                           </div>
                         </Radio>
                         <Radio value='estimate' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                           <div className="ml5 pt10 pb10">
                             <div className="fs14 color-black-1">
                               {gasShow(gasPriceStore.estimate, gasLimit, '推荐')}
                             </div>
                           </div>
                         </Radio>
                         <Radio value='custom' className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                           <div className="ml5 pt10 pb10">
                             <div className="fs14 color-black-1">
                               {gasShow(form.getFieldValue('gasPriceSlider'), gasLimit, '自定义')}
                             </div>
                             <div>
                               <Form.Item label={null} colon={false} className="mb0">
                                 {form.getFieldDecorator('gasPriceSlider', {
                                   initialValue:configs.defaultGasPrice,
                                   rules:[]
                                 })(
                                   <Slider min={1} max={99} step={1}
                                           marks={{
                                             1: intl.get('settings.slow') ,
                                             99: intl.get('settings.fast') ,
                                           }}
                                   />
                                 )}
                               </Form.Item>
                             </div>
                           </div>
                         </Radio>
                       </Radio.Group>
                     )}
                   </Form.Item>
                   }
                 </div>
                 <div className="mt20 text-right d-block w-100">
                   <Button onClick={handleSubmit} type="primary" size="large" className="d-block w-100">确认</Button>
                 </div>
               </div>
             }
             visible={gas.visible}
             onVisibleChange={handleVisibleChange}
             trigger="click">
             <a className="text-dark"><i className="icon-pencil"></i></a>
    </Popover>
  );
};

export default Form.create()(GasFeeForm);


