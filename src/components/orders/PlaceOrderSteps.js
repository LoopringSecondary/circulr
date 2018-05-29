import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import {connect} from 'dva'
const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row pt10 pb10 pl0 pr0 zb-b-b">
      <div className="col">
        <div className="fs14 color-black-2">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-1 text-wrap">{value}</div>
      </div>
    </div>
  )
}
const SignItem = (props) => {
  const {title, description,icon} = props
  return (
    <div className="text-center">
      { icon && <div className=""><i className={`fs24 icon-${icon}`}></i></div> }
      { title && <div className="fs14 color-black-1 text-wrap">{title}</div> }
      { description && <div className="fs12 color-black-3">{description}</div> }
    </div>
  )
}

const PlaceOrderSteps = ({
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
      <div className="pb10 fs18 color-black-1 zb-b-b">提交订单</div>
      {
        false &&
        <Steps current={0} className="mt20 mb20">
            {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
        </Steps>
      }
      <div className="mb15"></div>
      <div>
        <OrderMetaItem label="订单类型" value="P2P订单" />
        <OrderMetaItem label="订单价格" value="0.00015 ETH" />
        <OrderMetaItem label="订单数量" value="10000 LRC" />
        <OrderMetaItem label="订单总额" value="15 ETH" />
        <OrderMetaItem label="矿工撮合费" value="2.2 LRC" />
        <OrderMetaItem label="分润比例" value="50%" />
        <OrderMetaItem label="订单生效时间" value="2018年5月29日 10:38" />
        <OrderMetaItem label="订单失效时间" value="2018年5月30日 10:38" />
        <div className="mb15"></div>
        <div className="mt20 d-block w-100">
          <div className="mb15"></div>
          <Alert type="info" title={<div className="color-black-1">您的钱包还没有解锁 <a>解锁钱包<Icon type="right" /></a></div>} theme="light" size="small"/>
          <div className="mb15"></div>
          <Alert type="info" title={<div className="color-black-1">您的订单还没有完成签名 <a>订单签名<Icon type="right" /></a></div>} theme="light" size="small" />
          <div className="mb15"></div>
          <Button onClick={handleReset} type="primary" size="large" disabled className="d-block w-100">提交订单</Button>
        </div>
        <div className="mb15"></div>
        {
          false &&
          <Card title="选择签名方式" >
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="metamaskwallet" title="MetaMask" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="ledgerwallet" title="Ledger" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="trezorwallet" title="TREZOR" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="json" title="KeyStore" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="mnemonic" title="Mnemonic" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="key" title="PrivateKey" />
            </Card.Grid>
            <Card.Grid style={{width:'25%'}}>
              <SignItem icon="qrcode" title="Qrcode" />
            </Card.Grid>
          </Card>
        }
      </div>

    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(PlaceOrderSteps));


