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

        <Form>
          <Form.Item>
            {props.form.getFieldDecorator('mnemonic', {
              initialValue: '',
              rules: [{
                required: true,
                message: 'invalid mnemonic',
                validator: (rule, value, cb) => isValidateMnemonic(value) ? cb() : cb(true)
              }]
            })(
              <Input.TextArea placeholder="" autosize={{minRows: 3, maxRows: 6}} onChange={handleMnemonic}/>
            )}
          </Form.Item>
        </Form>
        {passRequired &&
        <div className="form-group form-group-lg">
          Password:<Input value={password} onChange={handlePass}/>
        </div>
        }
        {address &&
        <div className="form-group form-group-lg">
          Default Address:<Input value={address} disabled/>
        </div>
        }
        <Button type="primary" className="btn-block btn-xlg btn-token" onClick={unlock}>Unlock</Button>
        <Button type="primary" className="btn-block btn-xlg btn-token" onClick={moreAddress}>Select Other
          Address</Button>
      </div>
    </div>
  )
}

export default Form.create()(Mnemonic)
