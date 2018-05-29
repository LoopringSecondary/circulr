import { Tabs } from 'antd';
import { Containers } from 'modules'
import Account from '../index';

const TabPane = Tabs.TabPane;

function UnlockWallet(props) {
  return (
    <div>
      <Tabs type="card">
        <TabPane tab="Tab 1" key="1">
          <div className="tab-content">
            <Containers.Wallet>
              <Account.GenerateWallet/>
            </Containers.Wallet>
          </div>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <div className="tab-content">
            <Containers.Keystore>
              <Account.UnlockByKeystore/>
            </Containers.Keystore>
          </div>
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <div className="tab-content">
            <Containers.Mnemonic>
              <Account.UnlockByMnemonic/>
            </Containers.Mnemonic>
          </div>
        </TabPane>
        <TabPane tab="Tab 4" key="4">
          <div className="tab-content">
            <Account.UnlockByPrivateKey/>
          </div>
        </TabPane>
        <TabPane tab="Tab 5" key="5">
          <div className="tab-content">
            <Containers.HardwareWallet>
              <Account.UnlockByTrezor/>
            </Containers.HardwareWallet>
          </div>
        </TabPane>
        <TabPane tab="Tab 6" key="6">
          <div className="tab-content">
            <Containers.HardwareWallet>
              <Account.UnlockByLedger/>
            </Containers.HardwareWallet>
          </div>
        </TabPane>
        <TabPane tab="Tab 7" key="7">
          <div className="tab-content">
            <Containers.MetaMask>
              <Account.UnlockByMetaMask/>
            </Containers.MetaMask>
          </div>
        </TabPane>
        <TabPane tab="Tab 8" key="8">
          <div className="tab-content">
            <Containers.Backup>
              <Account.BackupWallet/>
            </Containers.Backup>
          </div>
        </TabPane>
        <TabPane tab="Tab 9" key="9">
          <div className="tab-content">
            <Containers.DetermineWallet>
              <Account.DetermineWallet/>
            </Containers.DetermineWallet>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}
export default UnlockWallet
