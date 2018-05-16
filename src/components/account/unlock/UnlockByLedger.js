import React from 'react';
import {Input, Button, Select} from 'antd';
import routeActions from 'common/utils/routeActions'
import {connect} from "LoopringJS/ethereum/ledger";

function Ledgers(props) {

  const {hardwareWallet, dispatch} = props;
  const {address, dpath, publicKey, chainCode,walletType} = hardwareWallet;

  const unlock = () => {
    connect().then(res => {
      if(!res.error){
        const ledger = res.result;
        dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger,dpath: `${dpath}/0`}});
        hardwareWallet.reset();
        routeActions.gotoPath('/wallet')
      }
    });

  };

  const moreAddress = () => {
    props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey,chainCode, dpath,walletType}});
    hardwareWallet.reset();
    routeActions.gotoPath('/unlock/determineWallet');
  };
  return (
    <div>
      <div>Default Address: {address}</div>
      <Button onClick={unlock}>解锁</Button>
      <Button onClick={moreAddress}>More Addresses</Button>
    </div>
  )
}

export default Ledgers
