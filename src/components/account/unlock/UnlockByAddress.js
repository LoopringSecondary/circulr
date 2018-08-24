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
        Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
        props.dispatch({type: 'sockets/unlocked'});
        routeActions.gotoPath('/trade');
        props.dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
        window.location.reload();
      }else {
        Notification.open({type:'error',message:intl.get('notifications.title.unlock_fail'),description:intl.get('wallet.invalid_address_tip')});
      }
    })
  };
  return (
    <div style={{width:"520px"}}>
      <h2 className="text-center text-primary">{intl.get('address.paste_address_title')}</h2>
      <div className="blk-md"></div>
      <Form layout="horizontal">
        <Form.Item colon={false}>
          {form.getFieldDecorator('address', {
            rules: [{
              message: intl.get('address.invalid_address_tip'),
              validator: (rule, value, cb) => validateAddress(value) ? cb() : cb(true)
            }]
          })(
            <Input className="d-block w-100" size="large" placeholder={intl.get('address.placeholder_tip')} />
          )}
        </Form.Item>
      </Form>
      <Button className="btn btn-primary btn-block btn-xxlg" onClick={unlocked}>{intl.get('unlock.actions_unlock')}</Button>
    </div>
  )
}

export default connect()(Form.create()(UnlockByAddress))
