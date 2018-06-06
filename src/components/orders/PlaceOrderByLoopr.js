import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import {connect} from 'dva'

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt5 pb5 pl0 pr0 zb-b-b">
      <div className="col">
        <div className="fs13 color-black-2 lh25">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs13 color-black-1 text-wrap lh25">{value}</div>
      </div>
    </div>
  )
}
const WalletItem = (props) => {
  const {title, description,icon,layout,showArrow} = props
  if(layout === 'vertical'){
    return (
      <div className="mt5 mb5">
        <div className="text-center">
          <i className={`fs24 icon-${icon}`}></i>
        </div>
        <div className="">
          <div className="fs14">{title}</div>
        </div>
      </div>
    )
  }else{
    return (
      <div className="row pt10 pb10 pl0 pr0 align-items-center zb-b-b">
        <div className="col-auto pr5 text-right text-primary">
          <i className={`fs20 icon-${icon}`}></i>
        </div>
        <div className="col pl10">
          <div className="fs14 color-black-1 text-wrap">{title}</div>
          <div className="fs12 color-black-2">{description}</div>
        </div>
        {showArrow &&
          <div className="col-auto text-right">
            <Icon type="right" />
          </div>
        }
      </div>
     )
  }
}

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
    title: '签名提交',
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
            <div className="zb-b">
                {
                  true &&
                  <div className="text-center p35">
                    <i className={`fs36 icon-success`}></i>
                    <div className="mt15">订单提交成功！</div>
                    <Button className="mt15" type="default"> 查看订单 </Button>
                  </div>
                }
                {
                  true &&
                  <div className="text-center p35">
                    <Icon type="close-circle" className="fs36 text-error" />
                    <div className="mt15">您取消了订单提交</div>
                    <Button className="mt15" type="default"> 返回上级 </Button>
                    <Button className="mt15" type="default"> 返回交易页 </Button>
                  </div>
                }
            </div>
          </div>
        }


      </div>
    </Card>
  );
};


export default Form.create()(connect()(PlaceOrderByLoopr));


