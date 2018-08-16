import React from 'react';
import {Upload, Button, Input, Icon, Form} from 'antd';
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import {isKeystorePassRequired} from "LoopringJS/ethereum/keystore";
import intl from 'react-intl-universal'


class Keystore extends React.Component {

  state = {
    fileList: [],
    visible: false
  };

  beforeUpload = (file) => {
    const keyStoreModel = this.props.keystore;
    const {form} = this.props;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const keystore = fileReader.result;
      keyStoreModel.setKeystore({keystore});
      form.setFieldsValue({keystore: keystore.toString()})
    };
    fileReader.readAsText(file, "utf-8");
    this.setState({fileList: []});
    return false;
  };

  handleStoreChange = (e) => {
    const keyStoreModel = this.props.keystore;
    const keystore = e.target.value;
    keyStoreModel.setKeystore({keystore});
  };

  unlock = () => {
    const keyStoreModel = this.props.keystore;
    const {keystore, isPasswordRequired, password} = keyStoreModel;
    if (this.isValidKeystore(keystore)) {
      if ((isPasswordRequired && password) || !isPasswordRequired) {
        this.props.dispatch({
          type: 'wallet/unlockKeyStoreWallet', payload: {
            keystore, password, cb: (e) => {
              if (!e) {
                Notification.open({type: 'success', message: intl.get('notifications.title.unlock_suc')});
                keyStoreModel.reset();
                this.props.dispatch({type: 'sockets/unlocked'});
                routeActions.gotoPath('/wallet');
                this.props.dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
              } else {
                Notification.open({type: 'error', message: intl.get('notifications.title.unlock_fail'), description: e.message});
              }
            }
          }
        });
      }else{
        Notification.open({type: 'error', message: intl.get('notifications.title.unlock_fail'), description: intl.get('password.password_tips_lack')});
      }
    }
  };

  handlePassChange = (e) => {
    const password = e.target.value;
    const keyStoreModel = this.props.keystore;
    keyStoreModel.setPassword({password})
  };
  togglePassword = () => {
    const {visible} = this.state;
    this.setState({visible: !visible})
  };

  isValidKeystore = (keystore) => {
    try {
      isKeystorePassRequired(keystore);
      return true;
    } catch (e) {
      console.log('ERROR:', e.message);
      return false;
    }
  };

  render() {
    const keyStoreModel = this.props.keystore;
    const {isPasswordRequired, password} = keyStoreModel;
    const {fileList, visible} = this.state;
    const {form} = this.props;
    const uploadProps = {
      action: '',
      beforeUpload: this.beforeUpload,
      fileList
    };

    const visibleIcon = (
      <div>
        {visible &&
        <i className="icon-wallet" onClick={this.togglePassword}/>
        }
        {!visible &&
        <i className="icon-wallet-slash" onClick={this.togglePassword}/>
        }
      </div>
    );

    return (
      <div>
        <h2 className="text-center text-primary">{intl.get('json.title_json')}</h2>
        <div className="blk-md"></div>
         <Form className="form-dark eye-switch">
           <Form.Item>
              <Upload className='btn btn-block btn-upload' {...uploadProps}>
              <Button className="d-block"><Icon type="folder" />{intl.get('json.title_json')}</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('keystore', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: intl.get('json.error_json_tip'),
                  validator: (rule, value, cb) => this.isValidKeystore(value) ? cb() : cb(true)
                }]
              })(
                <Input.TextArea autosize={{minRows: 5, maxRows: 8}} size="large" className='d-block' onChange={this.handleStoreChange}/>
              )}
            </Form.Item>
          {isPasswordRequired &&
          <Input type={visible ? 'text' : 'password'} placeholder={intl.get('common.password')} addonAfter={visibleIcon} value={password} onChange={this.handlePassChange}/>}
        </Form>
        <div className="blk"/>
        <Button type="primary" className="btn btn-primary btn-block btn-xxlg" onClick={this.unlock}>{intl.get('unlock.actions_unlock')}</Button>
      </div>
    )
  }
}

export default Form.create()(Keystore)






