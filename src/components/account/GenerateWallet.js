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
          <div className="blk-lg"></div>
          <div className="eye-switch">
            <Input type={visible ? 'text':'password'} addonAfter={visibleIcon} onChange={this.passChange} value={pass} />
          </div>
          <div className="d-flex justify-content-start align-items-center password-strong" style={{width:"300px"}}>
            <b className="password-label">Password Strength</b>
            <Progress percent={50}  />
            <div><span className="offset-md text-up">average</span></div>
          </div>
          <button className="btn btn-primary btn-block btn-xxlg" onClick={this.generate}>Generate Now</button>
        </div>
      </div>
    )
  }
}
export default GenerateWallet
