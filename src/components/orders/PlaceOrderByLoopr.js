import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'
import QRCode from 'qrcode.react';
import moment from 'moment'
import CountDown from 'LoopringUI/components/CountDown';
import {keccakHash} from 'LoopringJS/common/utils'
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'

const PlaceOrderByLoopr = (props) => {
  const {placeOrderByLoopr, circulrNotify, dispatch} = props
  let targetTime = moment().valueOf();
  if(placeOrderByLoopr.generateTime) {
    targetTime = placeOrderByLoopr.generateTime + 86400000;
  } else {
    targetTime = moment().valueOf() + 86400000;
  }
  const hashItem = getSocketAuthorizationByHash(placeOrderByLoopr.hash, circulrNotify)
  let step = 0
  if(hashItem) {
    switch (hashItem.status) { //init received accept reject
      case 'received':
        step = 1
        break;
      case 'accept':
        step = 2
        break;
      case 'reject':
        step = 2
        break;
      case 'txFailed':
        step = 2
        break;
    }
  }

  const overdue = () => {
    dispatch({type:'placeOrderByLoopr/overdueChange', payload:{overdue:true}})
  };

  const steps = [{
    title: intl.get('place_order_by_loopr.step_qrcode'),
    content: 'First-content',
  }, {
    title: intl.get('place_order_by_loopr.step_sign'),
    content: 'Second-content',
  }, {
    title: intl.get('place_order_by_loopr.step_result'),
    content: 'Last-content',
  }];

  return (
    <Card className="rs" title={<div className="pl10 ">{intl.get('place_order_by_loopr.title')}</div>}>
      <div className="p15">
        <div className="mb20 mt15">
          <Steps current={step}>
           {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        {
          step === 0 &&
          <div className="mt15">
            <div className="zb-b">
              <div className="text-center p15">
                {
                  placeOrderByLoopr.overdue &&
                  <div>{intl.get('place_order_by_loopr.qrcode_overdue')}</div>
                }
                {
                  !placeOrderByLoopr.overdue && placeOrderByLoopr.qrcode &&
                  <div>
                    <div><QRCode value={placeOrderByLoopr.qrcode} size={320} level='H'/></div>
                    <div><CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={overdue}/></div>
                  </div>
                }
                <div className="pt10 pb10 color-black-2 text-left fs12 " style={{width:'320px',margin:'0 auto'}}>
                  1. {intl.get('place_order_by_loopr.instruction_download')}
                  <br />
                  2. {intl.get('place_order_by_loopr.instruction_scan')}
                  <br />
                  {intl.get('place_order_by_loopr.instruction_warn')}
                </div>
              </div>
            </div>
          </div>
        }
        {
          step === 1 &&
          <div className="mt15">
            <div className="zb-b">
                <div className="text-center p35">
                  <Icon type="clock-circle" className="fs36 text-warning" />
                  <div className="mt15">{intl.get('place_order_by_loopr.waiting_sign')}</div>
                  {false && <Button className="mt15" type="default"> 返回上一级 </Button>}
                </div>
            </div>
          </div>
        }
        {
          step === 2 &&
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
    placeOrderByLoopr:state.placeOrderByLoopr,
    circulrNotify:state.sockets.circulrNotify
  }
}
export default connect(mapToProps)(PlaceOrderByLoopr);


