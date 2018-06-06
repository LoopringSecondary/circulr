import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'

const PlaceOrderResult = ({
  }) => {
  return (
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
  );
};


export default PlaceOrderResult;


