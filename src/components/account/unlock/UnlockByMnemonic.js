import React from 'react';
import {Input, Button, Select} from 'antd';
import {wallets} from "../../../common/config/data";
import routeActions from 'common/utils/routeActions'
const Option = Select.Option;

function Mnemonic(props) {
  const mnemonicModel = props.mnemonic;
  const {mnemonic, password, isValidMnemonic, dpath, address,passRequired} = mnemonicModel;

  const handleWalletType = (option) => {
    const wallet = wallets[option];
    mnemonicModel.setDpath({dpath: wallet.dpath, passRequired: (option === "1")})
  };

  const handleMnemonic = (e) => {
    mnemonicModel.setMnemonic({mnemonic: e.target.value})
  };

  const handlePass = (e) => {
    mnemonicModel.setPassword({password: e.target.value})
  };

  const unlock = () => {
    if(address){
      props.dispatch({type:'wallet/unlockMnemonicWallet',payload:{mnemonic,dpath:`${dpath}/0`,password}});
      mnemonicModel.reset();
      routeActions.gotoPath('/wallet');
    }
  };

  const moreAddress = () => {
    props.dispatch({type:'determineWallet/setMnemonicWallet',payload:{mnemonic,dpath}});
    mnemonicModel.reset();
    routeActions.gotoPath('/unlock/determineWallet');
  };

  return (
    <div>
      <div className="tab-pane text-inverse active" id="mnemonic">
        <h2 className="text-center text-primary">Select Your Wallet</h2>
        <div className="form-group form-group-lg">
          <Select defaultValue='0' dropdownMatchSelectWidth={false} onChange={handleWalletType}>
            {wallets.map((wallet, index) => {
              return <Option key={index}>{wallet.name}</Option>
            })}
          </Select>
        </div>
        <h2 className="text-center text-primary">Paste Your Mnemonic Here</h2>
        <div className="form-group form-group-lg">
          <Input.TextArea placeholder="" autosize={{minRows: 3, maxRows: 6}} value={mnemonic}
                          onChange={handleMnemonic}/>
        </div>
        {passRequired && <div className="form-group form-group-lg">
          Password:<Input value={password} onChange={handlePass}/>
        </div>}
        <div className="form-group form-group-lg">
          Default Address:<Input value={address} disabled/>
        </div>
        <Button type="primary" className="btn-block btn-xlg btn-token" disabled={!address} onClick={unlock}>Unlock</Button>
        <Button type="primary" className="btn-block btn-xlg btn-token" disabled={!address} onClick={moreAddress}>Select Other Address</Button>
      </div>
    </div>
  )
}

export default Mnemonic
