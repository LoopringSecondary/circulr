import React from 'react';
import Account from '../account';
import Layout from '../../layout';
import { Tabs } from 'antd';

function Unlock(props) {
  const TabPane = Tabs.TabPane;
  function callback(key) {
    console.log(key);
  }
  return (
        <Layout.LayoutHome className="h-full">
                <div className="body home">
                    <div className="home-content d-flex align-items-center justify-content-center open">
                        <div>
                            <h1>Generate Wallet  &  Unlock Wallet</h1>
                            <ul className="tab tab-card d-flex justify-content-center inup">
                                <li className="item">
                                    <a href="#generatewallet" data-toggle="tab"><i className="icon-plus"></i><h4>Generate Wallet</h4></a>
                                </li>
                                <li className="item">
                                    <a href="#metamask" data-toggle="tab"><i className="icon-metamaskwallet"></i><h4>MetaMask</h4></a>
                                </li>
                                <li className="item">
                                    <a href="https://connect.trezor.io/4/popup/popup.html?v=1523254722813"><i className="icon-trezorwallet"></i><h4>Trezor</h4></a>
                                </li>
                                <li className="item">
                                    <a href="#error" data-toggle="tab"><i className="icon-ledgerwallet"></i><h4>Ledger</h4></a>
                                </li>
                                <li className="item">
                                    <a href="#json" data-toggle="tab"><i className="icon-json"></i><h4>JSON</h4></a>
                                </li>
                                <li className="item">
                                    <a href="#mnemonic" data-toggle="tab"><i className="icon-mnemonic"></i><h4>Mnemonic</h4></a>
                                </li>
                                <li className="item">
                                    <a href="#privateKey" data-toggle="tab"><i className="icon-key"></i><h4>Private Key</h4></a>
                                </li>
                                <li className="item remove" id="inupRemove">
                                    <a href="#"><i className="icon-remove"></i></a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content">
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="Generate Wallet" key="1"><Account.GenerateWallet /></TabPane>
                                <TabPane tab="MetaMask" key="2"><Account.UnlockByMetaMask /></TabPane>
                                <TabPane tab="Trezor" key="3"><Account.UnlockByTrezor /></TabPane>
                                <TabPane tab="Ledger" key="4"><Account.UnlockByLedger /></TabPane>
                                <TabPane tab="JSON" key="5"><Account.UnlockByKeystore /></TabPane>
                                <TabPane tab="Mnemonic" key="6"><Account.UnlockByMnemonic /></TabPane>
                                <TabPane tab="Private Key" key="7"><Account.UnlockByPrivateKey /></TabPane>
                                <TabPane tab={<span><i className="icon-remove"></i></span>} ></TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="overlay" data-overlay="54"></div>
        </Layout.LayoutHome>      
  )
}
export default Unlock