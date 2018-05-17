import React from 'react';
import {Input, Progress} from 'antd';
import routeActions from 'common/utils/routeActions'

class  GenerateWallet extends React.Component {

  state = {
    visible:false,
    pass:''
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };

  passChange = (e) => {
    this.setState({pass:e.target.value})
  };

  generate =  () => {
    const {pass} = this.state;
    const {wallet,dispatch} = this.props;
    wallet.createWallet({password: pass,cb:(res) => {
      if(!res.error){
        const {address,mnemonic,keystore,privateKey} = res;
        dispatch({type:'backup/set',payload:{address,mnemonic,keystore,privateKey}});
        routeActions.gotoPath(`/unlock/backup`)
      }
    }});
  };

  render(){
    const {visible,pass} = this.state;
    const visibleIcon = (
      <div>
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
        <div className="form-dark">
          <h2 className="text-center text-primary">Generate Wallet</h2>
          <Input type={visible ? 'text':'password'} addonAfter={visibleIcon} onChange={this.passChange} value={pass}/>
          <div className="d-flex justify-content-start align-items-center password-strong">
            <div>Password Strength</div>
            <Progress percent={50} status="active" />
            <div><span className="offset-md">average</span></div>
          </div>
          <button className="btn btn-primary btn-block btn-xlg" onClick={this.generate}>Generate Now</button>
        </div>
      </div>
    )
  }
}
export default GenerateWallet
