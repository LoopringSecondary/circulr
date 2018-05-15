import React from 'react'
import {Tabs,Button,Input} from 'antd'
import copy from 'copy-to-clipboard';
import {getFileName} from "LoopringJS/ethereum/keystore";

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
    copy(value)
  };

  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible:!visible})
  };
  render(){
    const {visible,url,fileName} = this.state;
    const {mnemonic,keystore,privateKey} = this.props.backup;
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
    return(
      <div>
        <h2 className="text-center text-primary" style={{marginBottom: "20px" }}>Backup Wallet</h2>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Keystore" key="1">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>Loopring wallet never keeps your private key/keystore file/ mnemonic words, It is strongly recommended that you back up these information offline (with USB or physical paper). Once your private key/keystore file/mnemonic words get lost, it can never be recovered.</p>
                </div>
              </div>
            </div>

            <a href={url}
               download={fileName}
               className="ant-btn ant-btn-primary ant-btn-lg d-flex justify-content-center w-100 mt15 align-items-center">
              I Understand,Download Keystore</a>
          </TabPane>
          <TabPane tab="MMnemonick" key="2">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>Secure it like the millions of dollars it may one day be worth..</p>
                </div>
              </div>
            </div>
            <div className="mnemonic-content text-primary">{mnemonic}</div>
            <Button type="primary" className="btn-block btn-xlg btn-token" onClick={() => this.handleCopy(mnemonic)}>I Understand, Copy Mnemonic</Button>
          </TabPane>
          <TabPane tab="Private Key" key="3">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"/></div>
                <div>
                  <p>Secure it like the millions of dollars it may one day be worth..</p>
                </div>
              </div>
            </div>
            <div className="form-group form-group-lg iconic-input iconic-input-lg right">
              <Input type={visible ? 'text':'password'} addonAfter={visibleIcon} disabled value={privateKey}/>
            </div>
            <Button type="primary" className="btn-block btn-xlg btn-token" onClick={() => this.handleCopy(privateKey)}>I Understand, Copy Private Key</Button>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
