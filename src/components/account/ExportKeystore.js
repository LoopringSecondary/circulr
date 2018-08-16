import React from 'react';
import { Input,Button, Tabs,Alert} from 'antd';
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';
import {connect} from "dva";
import {getFileName} from "LoopringJS/ethereum/keystore";
import copy from 'copy-to-clipboard';
import Notification from '../../common/loopringui/components/Notification'
import storage from 'modules/storage/'

class ExportKeyStore extends React.Component{

  state={
    visible:false,
    password:'',
    ready:false,
    keystore:'',
    url:'',
    fileName:''
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible: !visible})
  };
  handlePass = (e) =>{
    this.setState({password:e.target.value})
  };

  getKeystore = () => {
    const address = storage.wallet.getUnlockedAddress()
    const unlockType = storage.wallet.getUnlockedType()
    if(address && unlockType && (unlockType === 'keystore' || unlockType === 'mnemonic' || unlockType ==='privateKey')){
      const {wallet} =  this.props;
      const {password} = this.state;
      const keystore = wallet.toV3Keystore(password);
      const blob = new Blob([JSON.stringify(keystore)], {type: 'text/json;charset=UTF-8'});
      const url =  window.URL.createObjectURL(blob);
      const fileName = getFileName(address);
      this.setState({url,fileName,keystore})
    }
  };

  handleCopy = (value) => {
    copy(value) ? Notification.open({type:'success',message:intl.get('notifications.title.copy_suc')}) : Notification.open({type:'error',message:intl.get('notifications.title.copy_fail')})
  };

  render(){
    const {visible,password,keystore,url,fileName} = this.state;
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

    const tip = (
      <div className="text-left">
        {/*<img hidden src={icon} className="mt25 mb25" style={{width: '100px'}}/>*/}
        <Alert
          description={intl.get('export_keystore.tip')}
          type="error"
          iconType="exclamation-circle"
          showIcon
          className="mb15"
        />
      </div>
    );

    return (
      <div>
        <div>{intl.get('export_keystore.title')}</div>
        {!keystore && <Input.Group compact  className="d-flex">
          <Input type={visible ? 'text' :'password'} style={{ width: '100%' }} placehold={intl.get('common.password')} onChange={this.handlePass}  addonAfter={visibleIcon}/>
          <Button onClick={this.getKeystore}>{intl.get('export_keystore.actions.get')}</Button>
        </Input.Group>}
        {keystore && <Tabs defaultActiveKey="file" tabPosition="" animated={true} className="layout-center layout-col" style={{marginTop:"-15px"}}>
          <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('export_keystore.types.file')}</div>} key="file">
            {tip}
            <a href={url}
               download={fileName}
               className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
              {intl.get('export_keystore.actions.download')}
            </a>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('export_keystore.types.text')}</div>} key="Text">
            {tip}
            <Input.TextArea
              value={JSON.stringify(keystore)}
              size="large"
              rows={4}
            />
            <Button size="large" type="primary" className="d-block w-100 mt25" onClick={() => this.handleCopy(JSON.stringify(keystore))}>
              {intl.get('export_keystore.actions.copy')}
            </Button>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="fs16 text-center">{intl.get('export_keystore.types.qr')}</div>} key="qrcode">
            {tip}
            <QRCode value={JSON.stringify(keystore)} size={240}/>
          </Tabs.TabPane>
        </Tabs>}
      </div>
    )
  }
}

function mapStateToProps(state) {
return {
  wallet:state.wallet.account
}
}

export default connect(mapStateToProps)(ExportKeyStore)
