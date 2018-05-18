import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'

const GasFeeForm = ({
    settings,form
  }) => {
  const {trading} = settings
  const integerReg = new RegExp("^0*[1-9]{1}[0-9]*$")
  function handleChange(type, e) {
    if ('timeToLive' === type || 'lrcFee' === type || 'marginSplit' === type) {
      handleChangeValue(type, e.target.value)
    } else {
      handleChangeValue(type, e)
    }
  }
  function handleChangeValue(type, v) {

  }
  function validateLrcFee(value) {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=50
  }
  function validateMarginSplit(value) {
    let v = Number(value);
    return value && v.toString() === value && v >=0 && v <=100
  }
  function validateGasPrice(value) {
    return value >=0 && value < 100;
  }
  function validateInteger(value) {
    return integerReg.test(value)
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleReset() {

  }
  function resetForm(){
    form.resetFields()
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const Option = Select.Option;
  const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
    initialValue:trading.timeToLiveUnit,
    rules:[]
  })(
    <Select style={{ width: 90 }} onChange={handleChange.bind(this, "timeToLiveUnit")}>
      <Option value="minute">{intl.get('trade.minute')}</Option>
      <Option value="hour">{intl.get('trade.hour')}</Option>
      <Option value="day">{intl.get('trade.day')}</Option>
      <Option value="week">{intl.get('trade.week')}</Option>
      <Option value="month">{intl.get('trade.month')}</Option>
    </Select>
  )
  return (
    <div>
      <div className="pb10 fs16 color-black-1 zb-b-b">Gas Fee</div>
      <div className="zb-b">
        <Tabs defaultActiveKey="1" >
          <Tabs.TabPane tab={<div className="pb5">Recommended</div>} key="1">
            <Radio.Group value={1} className="d-block w-100">
                <Radio value={1} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        0.000055ETH ≈ $0.55
                      </div>
                      <div className="fs12 color-black-3">
                      速度快：费用较高，但是交易速度比较快
                      </div>
                  </div>
                </Radio>
                <Radio value={2} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        0.000015ETH ≈ $0.15
                      </div>
                      <div className="fs12 color-black-3" >
                      费用低：费用较低，但是等待时间可能比较长
                      </div>
                  </div>
                </Radio>
                <Radio value={3} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        0.000035ETH ≈ $0.35
                      </div>
                      <div className="fs12 color-black-3">
                        平均值：基于当前以太网络交易的平均gas值，
                      </div>
                  </div>
                </Radio>
                <Radio value={4} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        自定义油费
                      </div>
                      <div>
                        <Form.Item label={null} colon={false} className="mb0">
                          {form.getFieldDecorator('gasPrice', {
                            initialValue:Number([trading.gasPrice]),
                            rules:[]
                          })(
                            <Slider min={1} max={99} step={1} onChange={handleChange.bind(this, "gasPrice")}
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
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="pb5">Advanced</div>} key="3">
            <div className="fs12 color-black-3" hidden>
            { intl.get('settings.gasPrice')+':  '+ trading.gasPrice+" Gwei" }
            </div>
            <div className="fs14 color-black-1 pl10 pr10" style={{minWidth:'300px'}}>
                <div className="mb15">
                  <Input className="" addonBefore="Gas Limit" />
                </div>
                <div className="mb15">
                  <Input className="" addonBefore="Gas Price" />
                </div>
                <div className="mb15 text-left">
                  <Input className="" addonBefore="Gas Fee" style={{paddingLeft:'0px'}} value="0.005 ETH" suffix={<span className="color-black-3">Gas Price x Gas Fee</span>}/>
                </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>


      <div className="mt20 text-right d-block w-100">
        <Button onClick={handleReset} type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(GasFeeForm));


