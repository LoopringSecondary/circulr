import { Tabs } from 'antd';
import { Containers } from 'modules'
import { Card,Icon,Button } from 'antd'
import Account from './index';

const TabPane = Tabs.TabPane;

const SignItem = (props) => {
  const {title, description,icon} = props
  return (
    <div className="row pt10 pb10 pl0 pr0 align-items-center zb-b-b">
      <div className="col-auto text-right text-primary">
        <i className={`fs20 icon-${icon}`}></i>
      </div>
      <div className="col pl10">
        <div className="fs16 color-black-1 text-wrap">{title}</div>
        <div className="fs12 color-black-3">{description}</div>
      </div>
      <div className="col-auto text-right">
        <Icon type="right" />
      </div>
    </div>
   )
}
const SignItemCol = (props) => {
  const {title, description,icon} = props
  return (
    <div className="mt5 mb5">
      <div className="text-center">
        <i className={`fs24 icon-${icon}`}></i>
      </div>
      <div className="">
        <div className="fs14">{title}</div>
      </div>
    </div>
   )
}

function UnlockWallet(props) {
  return (
    <div>
      <Card title={<div className="pl15 pr15">Unlock Wallet</div>} className="rs">
        <Tabs className="rs-flex">
          <TabPane tab={<SignItemCol icon="metamaskwallet" title="MetaMask" />} key="7">
            <div className="p15">
              <Containers.MetaMask>
                <Account.UnlockByMetaMask/>
              </Containers.MetaMask>
            </div>
          </TabPane>
          <TabPane tab={<SignItemCol icon="ledgerwallet" title="Ledger" />} key="6">
            <div className="p15">
              <Containers.HardwareWallet>
                <Account.UnlockByLedger/>
              </Containers.HardwareWallet>
            </div>
          </TabPane>
          <TabPane tab={<SignItemCol icon="trezorwallet" title="TREZOR" />} key="5">
            <div className="p15">
              <Containers.HardwareWallet>
                <Account.UnlockByTrezor/>
              </Containers.HardwareWallet>
            </div>
          </TabPane>
          <TabPane tab={<SignItemCol icon="json" title="KeyStore" />} key="2">
            <div className="p15">
              <Containers.Keystore>
                <Account.UnlockByKeystore/>
              </Containers.Keystore>
            </div>
          </TabPane>
          <TabPane tab={<SignItemCol icon="mnemonic" title="Mnemonic" />} key="3">
            <div className="p15">
              <Containers.Mnemonic>
                <Account.UnlockByMnemonic/>
              </Containers.Mnemonic>
            </div>
          </TabPane>
          <TabPane tab={<SignItemCol icon="key" title="PrivateKey" />} key="4">
            <div className="p15">
              <Account.UnlockByPrivateKey/>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
export default UnlockWallet
