import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'
import QRCode from 'qrcode.react';

const PlaceOrderByLoopr = (props) => {
  const {placeOrderByLoopr,dispatch} = props

  const steps = [{
    title: 'Qrcode',
    content: 'First-content',
  }, {
    title: 'Sign Order',
    content: 'Second-content',
  }, {
    title: 'Result',
    content: 'Last-content',
  }];

  const test = (value) => {
    if(value === 1) {
      dispatch({type:'placeOrderByLoopr/scanned', payload:{hash:placeOrderByLoopr.hash}})
    } else if(value === 2) {
      dispatch({type:'placeOrderByLoopr/submitSuccessfully', payload:{hash:placeOrderByLoopr.hash}})
    } else {
      dispatch({type:'placeOrderByLoopr/submitFailed', payload:{hash:placeOrderByLoopr.hash}})
    }
  }

  return (
    <Card className="rs" title={<div className="pl10 ">Place Order By Loopr Wallet</div>}>
      <div className="p15">
        <div className="mb20 mt15">
          <Steps current={placeOrderByLoopr.step}>
           {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        {
          placeOrderByLoopr.step === 0 &&
          <div className="mt15">
            <div className="zb-b">
              <div className="text-center p15">
                {placeOrderByLoopr.qrcode && <QRCode value={placeOrderByLoopr.qrcode} size={320} level='H'/>}
                <div className="pt10 pb10 color-black-2 text-left fs12 " style={{width:'320px',margin:'0 auto'}}>
                  1. 下载 Loopr-IOS
                  <br />
                  2. 打开 Loopr Wallet，点击扫码
                  <br />
                  * 二维码有效时间24小时，请尽快完成扫码操作，过期后请重新下单生成二维码
                  <Button className="mt15" type="default" onClick={test.bind(this, 1)}> scan </Button>
                  <Button className="mt15" type="default" onClick={test.bind(this, 2)}> success </Button>
                  <Button className="mt15" type="default" onClick={test.bind(this, 3)}> failed </Button>
                </div>
              </div>
            </div>

          </div>
        }
        {
          placeOrderByLoopr.step === 1 &&
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
          placeOrderByLoopr.step === 2 &&
          <div className="mt15">
            <PlaceOrderResult />
          </div>
        }
      </div>
    </Card>
  );
};

function mapToProps(state) {
  return {
    placeOrderByLoopr:state.placeOrderByLoopr
  }
}
export default connect(mapToProps)(PlaceOrderByLoopr);


