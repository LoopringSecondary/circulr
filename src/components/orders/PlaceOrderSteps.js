import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row pt5 pb5 pl0 pr0 ">
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
        <Card title="确认订单信息">
          <OrderMetaItem label="订单类型" value="P2P订单" />
          <OrderMetaItem label="订单价格" value="0.00015 ETH" />
          <OrderMetaItem label="订单数量" value="10000 LRC" />
          <OrderMetaItem label="订单总额" value="15 ETH" />
          <OrderMetaItem label="矿工撮合费" value="2.2 LRC" />
          <OrderMetaItem label="分润比例" value="50%" />
          <OrderMetaItem label="订单生效时间" value="2018年5月29日 10:38" />
          <OrderMetaItem label="订单失效时间" value="2018年5月30日 10:38" />
        </Card>
        <div className="mb15"></div>
        <div className="mt20 text-right d-block w-100">
          <Button onClick={handleReset} type="primary" size="large" className="d-block w-100">签名并提交</Button>
        </div>
        <div className="mb15"></div>
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
        <div className="mb15"></div>
        <Card title="交易签名（）" >

        </Card>
      </div>

    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(PlaceOrderSteps));


