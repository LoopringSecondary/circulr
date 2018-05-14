import React from 'react';
import {Input, Progress} from 'antd';


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

  };

  render(){
    const {visible,pass} = this.state;
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
        <div>
          <h2 classNameName="text-center text-primary">Generate Wallet</h2>
          <Input type={visible ? 'text':'password'} addonAfter={visibleIcon} onChange={this.passChange} value={pass}/>
          <div classNameName="d-flex justify-content-start align-items-center password-strong">
            <div>Password Strength</div>
            <Progress percent={50} status="active" />
            <div><span classNameName="offset-md">average</span></div>
          </div>
          <button className="btn btn-primary btn-block btn-xlg" onClick={this.generate}>Generate Now</button>
        </div>
      </div>
    )
  }
}
export default GenerateWallet
