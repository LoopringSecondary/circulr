import React from 'react'
import {Tabs,Button,Input} from 'antd'
import copy from 'copy-to-clipboard';
import {getFileName} from "LoopringJS/ethereum/keystore";
import intl from 'react-intl-universal'
import Notification from '../../../common/loopringui/components/Notification'

const TabPane = Tabs.TabPane;

export  default class BackupWallet extends React.Component {

  state = {
    visible:false,
    url:null,
    fileName:''
  };


  componentDidMount(){
    const {backup} = this.props;
    const {address,keystore} = backup;
    const blob = new Blob([JSON.stringify(keystore)], {type: 'text/json;charset=UTF-8'});
    const url =  window.URL.createObjectURL(blob);
    const fileName = getFileName(address);
    this.setState({url,fileName});
  }

  handleCopy = (value) => {
    copy(value) ? Notification.open({type:'success',message:intl.get('copy_suc')}) : Notification.open({type:'error',message:intl.get('wallet.copy_fail')})
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  render(){
    const {visible,url,fileName} = this.state;
    const {mnemonic,privateKey} = this.props.backup;
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
    return(
      <div>
        <h2 className="text-center text-primary" style={{marginBottom: "20px" }}>{intl.get('wallet_generate.backup_title')}</h2>
        <Tabs defaultActiveKey="1" className="tabs-dark">
          <TabPane tab="Keystore" key="1" style={{textAlign:"tect-center"}}>
              <div className="notice text-warning">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>{intl.get('wallet_generate.backup_tip')}</p>
                </div>
            </div>
            <a href={url}
               download={fileName}
               className="btn btn-block btn-primary btn-xxlg">
              {intl.get('wallet_generate.actions_backup_json')}</a>
          </TabPane>
          <TabPane tab={intl.get('wallet_type.mnemonic')} key="2">
              <div className="notice text-warning">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>{intl.get('wallet_generate.backup_tip')}</p>
                </div>
              </div>
            <div className="mnemonic-content text-primary">{mnemonic}</div>
            <Button className="btn btn-block btn-primary btn-xxlg" onClick={() => this.handleCopy(mnemonic)}>{intl.get('wallet_generate.actions_backup_mnemonic')}</Button>
          </TabPane>
          <TabPane tab={intl.get('wallet_type.private_key')} key="3">
              <div className="notice text-warning">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>{intl.get('wallet_generate.backup_tip')}</p>
                </div>
              </div>
            <div className="form-group form-group-lg iconic-input iconic-input-lg right eye-switch">
              <Input type={visible ? 'text':'password'} addonAfter={visibleIcon} disabled value={privateKey}/>
            </div>
            <div className="blk"></div>
            <Button className="btn btn-block btn-primary btn-xxlg" onClick={() => this.handleCopy(privateKey)}>{intl.get('wallet_generate.actions_backup_private')}</Button>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
