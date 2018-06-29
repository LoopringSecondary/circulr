import React from 'react'
import {connect} from 'dva';
import {Card, Steps,Icon,Alert} from 'antd';
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';
import CountDown from 'LoopringUI/components/CountDown';

class SignByLoopr extends React.Component {

  state = {
    step: 0,
    result: 0
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.auth !== nextProps.auth) {
      if (nextProps.auth && nextProps.auth.hash === this.props.hash) {
        const status = nextProps.auth.status
        if (!status || status === 'init') {
          this.setState({step: 0});
          return;
        }
        if (status && status === 'received') {
          this.setState({step: 1});
          return;
        }
        this.setState({step: 2, result: status === 'accept' ? 1 : 2})
      }
    }
  }

  render() {
    const {type, from, hash, validity, expired, dispatch, auth} = this.props;
    const {step, result} = this.state;
    const overdue = () => {
      dispatch({type: 'signByLoopr', payload: {expired: true}})
    };

    const steps = [
      {title: intl.get('loopr_sign.steps.qrcode')},
      {title: intl.get('loopr_sign.steps.sign')},
      {title: intl.get('loopr_sign.steps.result')}];

    return (
      <Card title={<div className="pl10 ">{intl.get('loopr_sign.title')}</div>} className="rs">
        <div className="p15">
          <div className="mb20 mt15">
            <Steps current={step}>
              {steps.map((item, index) => <Steps.Step key={index} title={item.title}/>)}
            </Steps>
          </div>
        </div>
        {step === 0 && <div className="text-center p15">
          {!expired &&
          <div><QRCode value={JSON.stringify({type, value: hash})} size={320} level='H'/></div>}
          {expired && <div><p className='p15'>{intl.get('common.expired')}</p></div>}
          <div><CountDown style={{fontSize: 20}} target={from + validity} onEnd={overdue}/></div>
          <div className="pt10 pb10 color-black-2 text-left fs12 " style={{width: '320px', margin: '0 auto'}}>
            1. {intl.get('loopr_sign.tips.download')}
            <br/>
            2. {intl.get('loopr_sign.tips.scan')}
            <br/>
            3. {intl.get('loopr_sign.tips.warn')}
          </div>
        </div>}
        {
          step === 1 &&
          <div className="mt15">
            <div className="zb-b">
              <div className="text-center p35">
                <Icon type="clock-circle" className="fs36 text-warning" />
                <div className="mt15">{intl.get('place_order_by_loopr.waiting_sign')}</div>
              </div>
            </div>
          </div>
        }
        {step === 2 && <div className="zb-b">
          {
            result === 1 &&
            <div className="text-center p35">
              <i className={`fs50 icon-success`}></i>
              <div className="fs18 color-black-1">{intl.get('notifications.title.sub_suc')}</div>
            </div>
          }
          {
            result === 2 &&
            <div className="text-center p35">
              <Icon type="close-circle" className="fs50 text-error" />
              <div className="fs18 color-black-1 mt15 mb10">{intl.get('notifications.title.sub_failed')}</div>
            </div>
          }
        </div>}
      </Card>
    )
  }


}

function mapStateToProps(state) {
  return {
    from: state.signByLoopr.from,
    type: state.signByLoopr.type,
    hash: state.signByLoopr.hash,
    validity: state.signByLoopr.validity,
    expired: state.signByLoopr.expired,
    auth: state.sockets.circulrNotify.item,
  }
}

export default connect(mapStateToProps)(SignByLoopr)
