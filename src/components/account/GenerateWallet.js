import React from 'react';
import {Input, Progress} from 'antd';
import routeActions from 'common/utils/routeActions'
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal'



class  GenerateWallet extends React.Component {

  state = {
    visible:false,
    pass:'',
    strength:'weak'
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };

  passChange = (e) => {
    const strength = this.getStrength(e.target.value);
    this.setState({pass:e.target.value,strength});
  };

  generate =  () => {
    const {pass} = this.state;
    if(pass.length >6){
      const {wallet,dispatch} = this.props;
      const _this = this;
      wallet.createWallet({password: pass,cb:(res) => {
        if(!res.error){
          const {address,mnemonic,keystore,privateKey} = res;
          dispatch({type:'backup/set',payload:{address,mnemonic,keystore,privateKey}});
          routeActions.gotoPath(`/unlock/backup`);
          _this.setState({visible:false, pass:'', strength:'weak'})
        }
      }});
    }else{
      Notification.open({type:'warning',message:intl.get('wallet.password_tips_weak')})
    }
  };

  getStrength(value) {
    if (value.length <= 6) {
      return 'weak'
    }
    if (value.length > 10) {
      return 'strong'
    }
    if (6 < value.length <= 10) {
      return 'average'
    }
  }

  render(){
    const {visible,pass,strength} = this.state;
    const visibleIcon = (
      <div>
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
        <div className="form-dark">
          <h2 className="text-center text-primary">{intl.get('wallet_generate.title_generate')}</h2>
          <div className="blk-lg"/>
          <div className="eye-switch">
            <Input type={visible ? 'text':'password'} placeholder={intl.get('common.password')} addonAfter={visibleIcon} onChange={this.passChange} value={pass} />
          </div>
          <div className="d-flex justify-content-start align-items-center password-strong" style={{width:"300px"}}>
            <b className="password-label">{intl.get('password.password_strength_title')}</b>
            {strength === 'weak' && <Progress percent={30}  />}
            {strength === 'average' && <Progress percent={50}  />}
            {strength === 'strong' && <Progress percent={90}  />}
            <div><span className="offset-md text-up">{intl.get(`password.password_strength.${strength}`)}</span></div>
          </div>
          <button className="btn btn-primary btn-block btn-xxlg" onClick={this.generate}>{intl.get('wallet_generate.actions_generate')}</button>
        </div>
      </div>
    )
  }
}
export default GenerateWallet
