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
      const owner = window.WALLET.address;
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
    if(symbol){
      const {balance} = this.props;
      const asset = getBalanceBySymbol({balances: balance.items, symbol, toUnit: true});
     return  toFixed(toBig(amount).minus(asset.balance).isPositive() ? toBig(amount).minus(asset.balance) : toBig(0),8,true);
    }
    return toFixed(toBig(0),8);
  };


  render(){
    const address =  window.WALLET.address;
    const {symbol,amount} = this.state;
    const copyAddress = () => {
      copy(address) ? Notification.open({
        message: intl.get('navbar.subs.copy_success'),
        type: 'success', size: 'small'
      }) : Notification.open({message: intl.get('navbar.subs.copy_failed'), type: "error", size: 'small'})
    };
    return (
      <div>
        <div className="modal-header text-dark"><h3>我的以太坊地址</h3></div>
        <div className="Receive-qrcode"><QRCode value={address} size={240}/></div>
        {symbol && toBig(amount).isPositive() && toBig(this.getNeeded()).isPositive() && <div className='fs3 color-black-1 mt10'>
          {intl.get('token.recommended_value')} {this.getNeeded()} {symbol.toUpperCase()}
        </div>}
        <Input.Group compact  className="d-flex form-dark">
          <Input style={{ width: '100%' }} defaultValue={address} disabled />
          <Button className="btn-xlg" onClick={copyAddress}>Copy</Button>
        </Input.Group>
      </div>
    )
  }
}

