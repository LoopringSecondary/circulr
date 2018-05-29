import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'

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
      <div className="pb10 fs18 color-black-1">提交订单</div>
      <Steps current={0}>
          {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
      </Steps>
      <div className="zb-b p10 mt10">
        <div className="pt20 pb20">订单信息</div>
        <div className="pt20 pb20">交易方式设置</div>
        <div className="pt20 pb20">签名方式设置</div>
      </div>
      <div className="mt20 text-right d-block w-100">
        <Button onClick={handleReset} type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(GasFeeForm));


