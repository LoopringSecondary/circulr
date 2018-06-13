import React from 'react'
import {connect} from 'dva';
import {Card, Steps} from 'antd';
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';
import CountDown from 'LoopringUI/components/CountDown';

class SignByLoopr extends React.Component {


  state = {
    step: 0,
    result:''
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.auth !== nextProps.auth) {
      if(nextProps.auth && nextProps.auth.hash === this.props.hash){
        const status = nextProps.auth.status
        if(!status || status === 'init'){
          this.setState({step:0});
          return;
        }
        if(status && status === 'received'){
          this.setState({step:1});
          return;
        }
        this.setState({step:3,result:status === 'accept' ? '成功':'失败'})
      }
    }
  }

  render() {
    const {type, from,hash, validity, expired, dispatch, auth} = this.props;
    const {step,result} = this.state;
    const overdue = () => {
      dispatch({type: 'signByLoopr', payload: {expired: true}})
    };

    const steps = [
      {title: intl.get('loopr_sign.steps.qrcode')},
      {title: intl.get('loopr_sign.steps.sign')},
      {title:intl.get('loopr_sign.steps.result')}];

    return (
      <Card title={<div className="pl10 ">{intl.get('loopr_sign.title')}</div>} className="rs">
        <div className="p15">
          <div className="mb20 mt15">
            <Steps current={step}>
              {steps.map((item, index) => <Steps.Step key={index} title={item.title}/>)}
            </Steps>
          </div>
        </div>
        {step===0 && <div className="text-center p15">
          {!expired && <div><QRCode value={JSON.stringify({type: 'cancelOrder', value: hash})} size={320} level='H'/></div>}
          {expired && <div><p className='p15'>已失效</p></div>}
          <div><CountDown style={{fontSize: 20}} target={from+validity} onEnd={overdue}/></div>
        </div>}
        {step ===1 && <div className="text-center p15">
          <p className='p15'>扫码成功</p>
        </div>}
        {step ===2 && <div className="text-center p15">
          <p className='p15'>{result}</p>
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
