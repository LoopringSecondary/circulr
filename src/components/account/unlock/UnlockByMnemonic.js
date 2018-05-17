import React from 'react';
import {Form,Input, Button, Select} from 'antd';
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
      <div id="mnemonic" className="form-dark">
        <h2 className="text-center text-primary">Paste Your Mnemonic Here</h2>
        <div className="blk-md"></div>
          <Form.Item>
              <Select defaultValue='0' dropdownMatchSelectWidth={false} size="large" onChange={handleWalletType} className="d-block">
                {wallets.map((wallet, index) => {
                  return <Option key={index}>{wallet.name}</Option>
                })}
              </Select>
          </Form.Item>
          <Form.Item colon={false}>
              <Input.TextArea placeholder="Paste Your Mnemonic Here" size="large" autosize={{minRows: 3, maxRows: 6}} value={mnemonic} onChange={handleMnemonic} className="mnemonic" />
          </Form.Item>

        <Form.Item colon={false}>
            {passRequired && <div>
              Password:<Input value={password} onChange={handlePass}/>
        </div>}
        </Form.Item>
        <Form.Item label="Default Address:">
            <Input value={address} disabled/>
        </Form.Item>
        <div className="blk"></div>
        <Button className="btn btn-primary btn-block btn-xxlg" disabled={!address} onClick={unlock}>Unlock</Button>
        <div className="blk"></div>
        <div className="text-center">
            <a className="text-link" disabled={!address} onClick={moreAddress}>Select Other Address</a>
        </div>
      </div>
    </div>
  )
}

export default Mnemonic
