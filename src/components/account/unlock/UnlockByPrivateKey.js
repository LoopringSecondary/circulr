import React from 'react';
import {Form,Input,Button } from 'antd';
import {connect} from 'dva';
import routeActions from 'common/utils/routeActions';

class PrivateKey extends React.Component {

  state={
    visible:false
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  keyChange = (e) => {
    const privateKey = e.target.value;
    const privateKeyModel = this.props.privateKey;
    privateKeyModel.setPrivatekey({privateKey})
  };

  unlock = () => {
    const privateKeyModel = this.props.privateKey;
    const {privateKey,isValid} = privateKeyModel;
    if(isValid){
      this.props.dispatch({type:"wallet/unlockPrivateKeyWallet",payload:{privateKey}});
      privateKeyModel.reset();
      routeActions.gotoPath('/wallet');
    }
  };

  render(){
    const privateKeyModel = this.props.privateKey;
    const {privateKey,isValid} = privateKeyModel;
    const {visible} = this.state;

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
          <div className="blk-md"></div>
          <Form.Item className="eye-switch form-dark">
            <Input type={visible ? 'text' : 'password'} addonAfter={visibleIcon} onChange={this.keyChange} value={privateKey}/>
          </Form.Item>
          <div className="blk-md"></div>
          <Button className="btn btn-primary btn-block btn-xxlg" onClick={this.unlock}>Unlock</Button>
        </div>
      </div>
    )
  }
}
export default PrivateKey
