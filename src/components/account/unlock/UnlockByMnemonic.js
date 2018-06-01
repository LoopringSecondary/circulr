import React from 'react';
import {Input, Button, Select, Form} from 'antd';
import {wallets} from "../../../common/config/data";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import {isValidateMnemonic} from "LoopringJS/ethereum/mnemonic";
import intl from 'react-intl-universal'

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
      Notification.open({type: 'success', message: intl.get('notifications.title.unlock_suc')});
      mnemonicModel.reset();
      props.dispatch({type: 'sockets/unlocked'});
      routeActions.gotoPath('/wallet');
      props.dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
    } else {
      if (!(mnemonic && isValidateMnemonic(mnemonic))) {
        if(!mnemonic){
          Notification.open({type: 'error', message: intl.get('notifications.title.unlock_fail'), description: intl.get('mnemonic.mnemonic_tip_lack')})
        }else{
          Notification.open({type: 'error', message: intl.get('notifications.title.unlock_fail'), description: intl.get('mnemonic.error_mnemonic_tip')})
        }
      } else if (passRequired && !password) {
        Notification.open({type: 'error', message:intl.get('notifications.title.unlock_fail'), description: intl.get('password.password_tips_lack')})
      }
    }
  };

  const moreAddress = () => {
    if (mnemonic && dpath && isValidateMnemonic(mnemonic)) {
      props.dispatch({type: 'determineWallet/setMnemonicWallet', payload: {mnemonic, dpath}});
      mnemonicModel.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    } else {
      if(!mnemonic){
        Notification.open({type: 'error', message: intl.get('unlock.error_invalid_tip'), description: intl.get('mnemonic.mnemonic_tip_lack')})
      }else{
        Notification.open({type: 'error', message: intl.get('unlock.error_invalid_tip'), description: intl.get('mnemonic.error_mnemonic_tip')})
      }
    }
  };

  return (
    <div>
      <div id="mnemonic" className="form-dark">
        <h2 className="text-center text-primary">{intl.get('mnemonic.actions_paste_mnemonic')}</h2>
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
              message: intl.get('mnemonic.error_mnemonic_tip'),
              validator: (rule, value, cb) => isValidateMnemonic(value) ? cb() : cb(true)
            }]
          })(
            <Input.TextArea placeholder={intl.get('mnemonic.actions_paste_mnemonic')} size="large" autosize={{minRows: 4, maxRows: 6}}
                            onChange={handleMnemonic} className="mnemonic"/>
          )}
        </Form.Item>
        {passRequired && <Form.Item colon={false} label={`${intl.get('common.password')}:`}>
           <div className="text-muted">
            <Input value={password} onChange={handlePass}/>
          </div>
        </Form.Item>}
        <Form.Item label={`${intl.get('wallet_determine.default_address')}:`}>
          <Input value={address} disabled/>
        </Form.Item>
        <div className="blk"/>
        <Button className="btn btn-primary btn-block btn-xxlg" onClick={unlock}>{intl.get('unlock.actions_unlock')}</Button>
        <div className="blk"/>
        <div className="text-center">
          <a className="text-link" onClick={moreAddress}>{intl.get('wallet_determine.actions_other_address')}</a>
        </div>
      </div>
    </div>
  )
}

export default Form.create()(Mnemonic)
