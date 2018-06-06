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

const PlaceOrderSteps = ({
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
  return (
    <Card className="rs" title={<div className="pl10 ">订单提交</div>}>
      <div className="p15">
        <div className="zb-b">
          <div className="fs16 color-black-1 p10 zb-b-b">订单详情</div>
          <OrderMetaItem label="订单类型" value="P2P订单" />
          <OrderMetaItem label="订单价格" value="0.00015 ETH" />
          <OrderMetaItem label="订单数量" value="10000 LRC" />
          <OrderMetaItem label="订单总额" value="15 ETH" />
          <OrderMetaItem label="矿工撮合费" value="2.2 LRC" />
          <OrderMetaItem label="订单有效期" value="2018-05-29 10:38 ~ 2018-05-30 10:38" />
        </div>

        <div className="zb-b mt15">
          <div className="fs16 color-black-1 p10 zb-b-b">选择支付钱包</div>
          <div className="row ml0 mr0">
            <div className="col-4 zb-b-r">
              <WalletItem icon="json" title="Loopr Wallet" />
            </div>
            <div className="col-4 zb-b-r">
              <WalletItem icon="metamaskwallet" title="MetaMask" />
            </div>
            <div className="col-4">
              <WalletItem icon="ledgerwallet" title="Ledger" />
            </div>
            <div className="col-4 zb-b-r">
              <WalletItem icon="trezorwallet" title="TREZOR" />
            </div>
            <div className="col-4 zb-b-r">
              <WalletItem icon="key" title="imToken" />
            </div>
          </div>
        </div>

        {
          false &&
          <div className="mt20 d-block w-100">
            <div className="mb15"></div>
            <div className="mb15"></div>
            <Alert type="info" title={<div className="color-black-1">您的钱包还没有解锁 <a>解锁钱包<Icon type="right" /></a></div>} theme="light" size="small"/>
            <div className="mb15"></div>
            <Alert type="info" title={<div className="color-black-1">您的订单还没有完成签名 <a>订单签名<Icon type="right" /></a></div>} theme="light" size="small" />
            <div className="mb15"></div>
            <Button onClick={handleReset} type="primary" size="large" disabled className="d-block w-100">提交订单</Button>
            <div className="mb15"></div>
          </div>
        }
      </div>
    </Card>
  );
};


export default Form.create()(connect()(PlaceOrderSteps));


