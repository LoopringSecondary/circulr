import React from 'react';
import {connect} from 'dva';
import {Card, Input, Button} from 'antd'

class WalletTest extends React.Component {


  handleStoreChange = (e) => {
    const keystore = e.target.value;
    this.props.dispatch({type: 'keystore/setKeystore', payload: {keystore}})
  };

  handlePasswordChange = (e) => {
    const password = e.target.value;
    this.props.dispatch({type: 'keystore/setPassword', payload: {password}})
  };

  descrypt = () => {
    const {keystore, isPasswordRequired, password, isValid} = this.props;

    this.props.dispatch({type:'wallet/unlockKeyStoreWallet',payload:{keystore,password}})
  };
  render() {
    const {keystore, isPasswordRequired, password, isValid,address,unlockType} = this.props;
    return (
      <Card title='解锁钱包'>

        <div> Keystore</div>
        <div className='mb20'>
          <Input.TextArea autosize={{minRows: 3, maxRows: 8}} size="large" className='d-block fs12' value={keystore}
                          onChange={this.handleStoreChange}/>
        </div>
        {isPasswordRequired &&
        <div>
          <div className='mb20'> 密码:
          </div>
          <div>
            <Input value={password} onChange={this.handlePasswordChange}/>
          </div>
        </div>}
        <div>
          IsValid: {isValid ? '有效' : "无效"}
        </div>
        <div>
          isPasswordRequired : {isPasswordRequired ? "需要密码" : "不需要密码"}
        </div>
        <div>
          address:{address}
        </div>
        <div>
          unlockType:{unlockType}
        </div>
        <Button  onClick={this.descrypt} disabled={!isValid} >解锁keystore </Button>

        <div>助记词</div>
        <div className='mb20'>
          <Input.TextArea autosize={{minRows: 3, maxRows: 8}} size="large" className='d-block fs12' value={keystore}
                          onChange={this.handleStoreChange}/>
        </div>

      </Card>
    )
  }
}

function mapStateToProps(state) {
  return {
    keystore: state.keystore.keystore,
    isPasswordRequired: state.keystore.isPasswordRequired,
    password: state.keystore.password,
    isValid: state.keystore.isValid,
    address:state.wallet.address,
    unlockType:state.wallet.unlockType
  }
}

export default connect(mapStateToProps)(WalletTest)
