import React from 'react';
import { Input,Button} from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';
import {toBig,toFixed} from "LoopringJS/common/formatter";
import {getBalanceBySymbol} from "../../modules/tokens/TokenFm";
import TokenFormatter from '../../modules/tokens/TokenFm';
import config from '../../common/config'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import storage from 'modules/storage/'

export default class Receive extends React.Component {
  state = {
    symbol: null,
    amount: toBig(0)
  };
  componentDidMount() {
    const {receiveToken} = this.props;
    const {symbol} = receiveToken;
    if (symbol) {
      const _this = this;
      const tf = new TokenFormatter({symbol});
      const owner = storage.wallet.getUnlockedAddress();
      window.RELAY.account.getEstimatedAllocatedAllowance({owner,token:symbol.toUpperCase(),delegateAddress:config.getDelegateAddress()}).then(res => {
        if (!res.error) {
          const orderAmount = res.result;
          if (symbol.toUpperCase() === "LRC") {
            window.RELAY.account.getFrozenLrcFee(owner).then(response => {
              let amount;
              if (!response.error) {
                const lrcFee = response.result;
                amount = tf.getUnitAmount(toBig(orderAmount).plus(toBig(lrcFee)));
              } else {
                amount = tf.getUnitAmount(toBig(orderAmount));
              }
              _this.setState({symbol, amount});
            })
          } else {
            const amount = tf.getUnitAmount(toBig(orderAmount));
            _this.setState({symbol, amount});
          }
        }
      });
    }
  }

  getNeeded = () => {
    const {symbol,amount} = this.state;

    if(symbol && storage.wallet.getUnlockedAddress()){
      const {balance} = this.props;
      const asset = getBalanceBySymbol({balances: balance.items, symbol, toUnit: true});
      if(!asset){ return toFixed(toBig(0),8) }
      return  toFixed(toBig(amount).minus(asset.balance).isPositive() ? toBig(amount).minus(asset.balance) : toBig(0),8,true);
    }
    return toFixed(toBig(0),8);
  };


  render(){
    const address = storage.wallet.getUnlockedAddress();
    const {receiveToken} = this.props;
    if(!address){
      Notification.open({message: intl.get('unlock.has_not_unlocked'), type: "error", size: 'small'});
      receiveToken.hideLayer();
      routeActions.gotoPath('/unlock');
      return null;
    }
    const {symbol,amount} = this.state;
    const copyAddress = () => {
      copy(address) ? Notification.open({
        message: intl.get('notifications.title.copy_suc'),
        type: 'success', size: 'small'
      }) : Notification.open({message: intl.get('notifications.title.copy_fail'), type: "error", size: 'small'})
    };
    return (
      <div className="pd-lg">
          <div className="sidebar-header">
            <h3 className="text-center">{intl.get('receive.receive_title')}</h3>
          </div>
        <div className="Receive-qrcode"><QRCode value={address} size={240} level='H'/></div>
        {symbol && toBig(amount).gt(0) && toBig(this.getNeeded()).gt(0) && <div className='fs3 color-black-1 text-center mt10 mb10'>
          {intl.get('receive.receive_value_tip')} {this.getNeeded()}  {symbol.toUpperCase()}
        </div>}
        <div className="form-dark">
        <Input.Group compact  className="d-flex">
          <Input style={{ width: '100%' }} defaultValue={address} disabled />
          <Button onClick={copyAddress}>{intl.get('common.copy')}</Button>
        </Input.Group>
        </div>
      </div>
    )
  }
}

