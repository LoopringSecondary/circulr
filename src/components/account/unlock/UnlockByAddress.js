import React from 'react';
import {Button, Form, Input} from 'antd';
import intl from 'react-intl-universal';
import Notification from 'LoopringUI/components/Notification'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import routeActions from 'common/utils/routeActions';
import {connect} from 'dva';

function UnlockByAddress(props) {
  const {form} = props
  const  validateAddress = (address) => {
    return tokenFormatter.validateEthAddress(address)
  };

  const unlocked = () => {
    form.validateFields((err, values) => {
      if (!err) {
        const address = form.getFieldValue('address')
        props.dispatch({type:"wallet/unlockAddressWallet",payload:{address}});
        Notification.open({type:'success',message:'解锁成功',description:'unlock'});
        props.dispatch({type: 'sockets/unlocked'})
        routeActions.gotoPath('/wallet');
      }
    })
  };
  return (
    <div className="text-left">
      <h2 className="text-center text-primary">{intl.get('wallet.paste_address_title')}</h2>
      <div className="blk-md"></div>
      <Form layout="horizontal">
        <Form.Item colon={false}>
          {form.getFieldDecorator('address', {
            rules: [{
              message: intl.get('wallet.error_address_tip'),
              validator: (rule, value, cb) => validateAddress(value) ? cb() : cb(true)
            }]
          })(
            <Input className="d-block w-100" size="large" />
          )}
        </Form.Item>
      </Form>
      <Button className="btn btn-primary btn-block btn-xxlg" onClick={unlocked}>{intl.get('wallet.actions_unlock')}</Button>
    </div>
  )
}

export default connect()(Form.create()(UnlockByAddress))
