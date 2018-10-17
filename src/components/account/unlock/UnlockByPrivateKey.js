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
      Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
      this.props.dispatch({type: 'sockets/unlocked'})
      routeActions.gotoPath('/wallet');
      this.props.dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
    }else if(privateKey){
      Notification.open({type:'error',message:intl.get('notifications.title.unlock_fail'),description:intl.get('key.error_private_tip')})
    }else{
      Notification.open({type:'error',message:intl.get('notifications.title.unlock_fail'),description:intl.get('key.lack_private_tip')})
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
        <i className="icon-wallet" onClick={this.togglePassword}/>
        }
        {!visible &&
        <i className="icon-wallet-slash" onClick={this.togglePassword}/>
        }
      </div>
    );
    return (
      <div>
        <div id="privateKey">
          <h2 className="text-center text-primary">{intl.get('key.paste_private_title')}</h2>
          <div className="blk-md" />
          <Form>
            <Form.Item className="eye-switch form-dark">
              {form.getFieldDecorator('privateKey', {
                initialValue: privateKey,
                rules: [{
                  required: true,
                  message: intl.get('key.error_private_tip'),
                  validator: (rule, value, cb) => this.isValidPrivateKey(value) ? cb() : cb(true)
                }]
              })(
                  <Input type={visible ? 'text' : 'password'} placeholder={intl.get('key.placeholder')} addonAfter={visibleIcon} onChange={this.keyChange}/>
              )}
            </Form.Item>
          </Form>
          <div className="blk-md"/>
          <Button className="btn btn-primary btn-block btn-xxlg" onClick={this.unlock}>{intl.get('unlock.actions_unlock')}</Button>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(PrivateKey))
