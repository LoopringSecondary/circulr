import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'

const PlaceOrderResult = (props) => {
  const {placeOrder, placeOrderByLedger, placeOrderByMetaMask, placeOrderByLoopr} = props
  let orderState = 0
  switch(placeOrder.payWith) {
    case 'ledger':
      orderState = placeOrderByLedger.orderState
      break;
    case 'metaMask':
      orderState = placeOrderByMetaMask.orderState
      break;
    case 'loopr':
      orderState = placeOrderByLoopr.orderState
      break;
  }
  return (
    <div className="zb-b">
        {
          orderState === 1 &&
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
          orderState === 2 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 text-error" />
            <div className="fs18 color-black-1 mt15">提交失败</div>
            <div className="mt10">
              <Button className="m5" type="default"> 返回上级 </Button>
              <Button className="m5" type="default"> 返回交易页 </Button>
            </div>
          </div>
        }
    </div>
  );
};

function mapToProps(state) {
  return {
    wallet:state.wallet,
    placeOrder:state.placeOrder,
    placeOrderByMetaMask:state.placeOrderByMetaMask,
    placeOrderByLoopr:state.placeOrderByLoopr,
    placeOrderByLedger:state.placeOrderByLedger
  }
}

export default connect(mapToProps) (PlaceOrderResult);



