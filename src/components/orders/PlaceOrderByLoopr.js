import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'
const PlaceOrderByLoopr = ({
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
    title: '手机扫码',
    content: 'First-content',
  }, {
    title: '交易签名',
    content: 'Second-content',
  }, {
    title: '下单结果',
    content: 'Last-content',
  }];

  return (
    <Card className="rs" title={<div className="pl10 ">Place Order By Loopr Wallet</div>}>
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
                <img src="http://pic.36krcnd.com/avatar/201612/07071825/57rrbw8czufu0hqm.png" alt="" style={{width:'320px',height:'320px'}}/>
                <div className="pt10 pb10 color-black-2 text-left fs12 " style={{width:'320px',margin:'0 auto'}}>
                  1. 下载 Loopr-IOS
                  <br />
                  2. 打开 Loopr Wallet，点击扫码
                  <br />
                </div>
              </div>
            </div>

          </div>
        }
        {
          true &&
          <div className="mt15">
            <div className="zb-b">
                <div className="text-center p35">
                  <Icon type="clock-circle" className="fs36 text-warning" />
                  <div className="mt15">等待手机对订单进行签名提交</div>
                  <Button className="mt15" type="default"> 返回上一级 </Button>
                </div>
            </div>
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


export default Form.create()(connect()(PlaceOrderByLoopr));


