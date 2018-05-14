import React from 'react'
import {Tabs} from 'antd'

const TabPane = Tabs.TabPane;


class BackupWallet extends React.Commponent {

  render(){
    return(
      <div>
        <h2 className="text-center text-primary" style={{marginBottom: "20px" }}>Backup Wallet</h2>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Keystore" key="1">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"></i></div>
                <div>
                  <p>Loopring wallet never keeps your private key/keystore file/ mnemonic words, It is strongly recommended that you back up these information offline (with USB or physical paper). Once your private key/keystore file/mnemonic words get lost, it can never be recovered.</p>
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-xlg">I Understand, Copy Mnemonic</button>
          </TabPane>
          <TabPane tab="MMnemonick" key="2">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"></i></div>
                <div>
                  <p>Secure it like the millions of dollars it may one day be worth..</p>
                </div>
              </div>
            </div>
            <div className="mnemonic-content text-primary">polar road below sick roof ceiling mirror thought gorilla snow law reward inform cement hospital suffer effort check detect rule viable gadget edge rule </div>
            <Button type="primary" className="btn-block btn-xlg btn-token">I Understand, Copy Mnemonic</Button>
          </TabPane>
          <TabPane tab="Private Key" key="3">
            <div className="card bg-white">
              <div className="card-body notice">
                <div><i className="icon-warning"></i></div>
                <div>
                  <p>Secure it like the millions of dollars it may one day be worth..</p>
                </div>
              </div>
            </div>
            <div className="form-group form-group-lg iconic-input iconic-input-lg right">
              <Input suffix={<i className="icon-eye"></i>} placeholder="Set A Strong Password" value="ee54ba95c5fca27b8901d88fb5671d07c29cc5fe323b567661181e761c5e117d" />
            </div>
            <Button type="primary" className="btn-block btn-xlg btn-token">I Understand, Copy Private Key</Button>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
