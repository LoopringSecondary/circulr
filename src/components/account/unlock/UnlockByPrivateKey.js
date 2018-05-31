import React from 'react';
import { Input,Button,Form } from 'antd';
import {connect} from 'dva';
import routeActions from 'common/utils/routeActions';
import Notification from '../../../common/loopringui/components/Notification'
import validator from 'LoopringJS/ethereum/validator'
import intl from 'react-intl-universal'


class PrivateKey extends React.Component {

  state={
    visible:false,
    privateKey:''
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  keyChange = (e) => {
    const privateKey = e.target.value;
    this.setState({privateKey})
  };

  unlock = () => {
    const {privateKey} = this.state;
    if(this.isValidPrivateKey(privateKey)){
      this.props.dispatch({type:"wallet/unlockPrivateKeyWallet",payload:{privateKey}});
      Notification.open({type:'success',message:'解锁成功',description:'unlock'});
      this.props.dispatch({type: 'sockets/unlocked'})
      routeActions.gotoPath('/wallet');
    }else{
      Notification.open({type:'error',message:'unlock failed ',description:'Invalid privateKey'})
    }
  };

  isValidPrivateKey = (key) => {
    try {
      validator.validate({value: key, type: 'ETH_KEY'});
      return true;
    } catch (e) {
      return false;
    }
  };

  render(){
    const {visible,privateKey} = this.state;
    const {form}  = this.props;
    const visibleIcon = (
      <div className="fs14 pl5 pr5">
        {visible &&
        <i className="icon-eye" onClick={this.togglePassword}/>
        }
        {!visible &&
        <i className="icon-eye-slash" onClick={this.togglePassword}/>
        }
      </div>
    );
    return (
      <div>
        <div id="privateKey">
          <h2 className="text-center text-primary">Paste Your PrivateKey Here</h2>
          <div className="blk-md" />
          <Form>
            <Form.Item className="eye-switch form-dark">
              {form.getFieldDecorator('privateKey', {
                initialValue: privateKey,
                rules: [{
                  required: true,
                  message: intl.get('wallet.error_private_tip'),
                  validator: (rule, value, cb) => this.isValidPrivateKey(value) ? cb() : cb(true)
                }]
              })(
                  <Input type={visible ? 'text' : 'password'} addonAfter={visibleIcon} onChange={this.keyChange}/>
              )}
            </Form.Item>
          </Form>
          <div className="blk-md"/>
          <Button className="btn btn-primary btn-block btn-xxlg" onClick={this.unlock}>{intl.get('wallet.actions_unlock')}</Button>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(PrivateKey))
