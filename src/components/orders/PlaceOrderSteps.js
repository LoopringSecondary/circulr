import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
const MetaItem = (props) => {
  const {label, value, render} = props
  return (

  )
}
const GasFeeForm = ({
    settings,form
  }) => {
  const {trading} = settings

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
  const steps = [{
    title: '交易设置',
    content: 'First-content',
  }, {
    title: '交易签名',
    content: 'Second-content',
  }, {
    title: '提交成功',
    content: 'Last-content',
  }];

  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b mb15">提交订单</div>
      <Steps current={0}>
          {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
      </Steps>

      <div className="p10 mt10">
        <Card title="订单信息">
          <MetaItem label="订单类型" value="P2P订单" />
        </Card>
        <div className="mb15"></div>
        <Card title="支付方式" >
          <MetaItem label="订单类型" value="P2P订单" />
        </Card>
      </div>
      <div className="mt20 text-right d-block w-100">
        <Button onClick={handleReset} type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(GasFeeForm));


