import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderSign from './PlaceOrderSign'
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
            <div className="zb-b">
                {
                  true &&
                  <div className="text-center p35">
                    <i className={`fs50 icon-success`}></i>
                    <div className="fs18 color-black-1">订单提交成功！</div>
                    <div className="mt10">
                      <Button className="m5" type="default"> 查看订单 </Button>
                      <Button className="m5" type="default"> 继续下单 </Button>
                    </div>
                  </div>
                }
                {
                  true &&
                  <div className="text-center p35">
                    <Icon type="close-circle" className="fs50 text-error" />
                    <div className="fs18 color-black-1 mt15">您取消了订单提交</div>
                    <div className="mt10">
                      <Button className="m5" type="default"> 返回上级 </Button>
                      <Button className="m5" type="default"> 返回交易页 </Button>
                    </div>
                  </div>
                }
            </div>
          </div>
        }
      </div>
    </Card>
  );
};


export default Form.create()(connect()(PlaceOrderByMetamask));


