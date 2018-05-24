import React from 'react';
import {Input, Button, Select, Form} from 'antd';
import {wallets} from "../../../common/config/data";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import {isValidateMnemonic} from "LoopringJS/ethereum/mnemonic";

const Option = Select.Option;

function Mnemonic(props) {
  const mnemonicModel = props.mnemonic;
  const {mnemonic, password, dpath, address, passRequired} = mnemonicModel;

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
    if (address) {
      props.dispatch({type: 'wallet/unlockMnemonicWallet', payload: {mnemonic, dpath: `${dpath}/0`, password}});
      Notification.open({type: 'success', message: '解锁成功', description: 'unlock'});
      mnemonicModel.reset();
      props.dispatch({type: 'sockets/unlocked'})
      routeActions.gotoPath('/wallet');
    } else {
      if (!(mnemonic && isValidateMnemonic(mnemonic))) {
        Notification.open({type: 'error', message: 'incomplete formation', description: 'please input valid mnemonic'})
      } else if (passRequired && !password) {
        Notification.open({type: 'error', message: 'incomplete formation', description: 'please input valid password'})
      }
    }
  };

  const moreAddress = () => {
    if (mnemonic && dpath && isValidateMnemonic(mnemonic)) {
      props.dispatch({type: 'determineWallet/setMnemonicWallet', payload: {mnemonic, dpath}});
      mnemonicModel.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    } else {
      Notification.open({type: 'error', message: 'invalid information', description: 'please input valid mnemonic'})
    }
  };

  return (
    <div>
      <div id="mnemonic" className="form-dark">
        <h2 className="text-center text-primary">Paste Your Mnemonic Here</h2>
        <div className="blk-md"/>
        <Form.Item>
          <Select defaultValue='0' dropdownMatchSelectWidth={false} size="large" onChange={handleWalletType}
                  className="d-block">
            {wallets.map((wallet, index) => {
              return <Option key={index}>{wallet.name}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item colon={false}>
          {props.form.getFieldDecorator('mnemonic', {
            initialValue: '',
            rules: [{
              required: true,
              message: 'invalid mnemonic',
              validator: (rule, value, cb) => isValidateMnemonic(value) ? cb() : cb(true)
            }]
          })(
            <Input.TextArea placeholder="Paste Your Mnemonic Here" size="large" autosize={{minRows: 4, maxRows: 6}}
                            value={mnemonic} onChange={handleMnemonic} className="mnemonic"/>
          )}
        </Form.Item>
        {passRequired && <Form.Item colon={false} label="Password:">
           <div className="text-muted">
            <Input value={password} onChange={handlePass}/>
          </div>
        </Form.Item>}
        <Form.Item label="Default Address:">
          <Input value={address} disabled/>
        </Form.Item>
        <div className="blk"/>
        <Button className="btn btn-primary btn-block btn-xxlg" onClick={unlock}>Unlock</Button>
        <div className="blk"/>
        <div className="text-center">
          <a className="text-link" onClick={moreAddress}>Select Other Address</a>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(Mnemonic)
