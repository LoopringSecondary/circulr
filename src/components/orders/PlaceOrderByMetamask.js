import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderSign from './PlaceOrderSign'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'

const PlaceOrderByMetamask = ({
    form
  }) => {
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
    title: '连接',
    content: 'First-content',
  }, {
    title: '交易签名',
    content: 'Second-content',
  }, {
    title: '结果',
    content: 'Last-content',
  },
  ]
  return (
    <Card className="rs" title={<div className="pl10 ">Place Order By MetaMask</div>}>
      <div className="p15">
        <div className="mb20 mt15">
          <Steps current={0}>
           {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        {
          true &&
          <div className="mt15">
            <div className="zb-b">
              <div className="text-center p15">
                <i className={`fs36 icon-metamaskwallet text-primary`}></i>
                <div className="mt10">Metamask 连接成功！</div>
                <Button className="mt15" type="default"> 下一步 </Button>
              </div>
            </div>
          </div>
        }
        {
          true &&
          <div className="mt15">
            <PlaceOrderSign />
          </div>
        }
        {
          true &&
          <div className="mt15">
            <PlaceOrderResult />
          </div>
        }
      </div>
    </Card>
  );
};


export default Form.create()(connect()(PlaceOrderByMetamask));


