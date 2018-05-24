import React from 'react'
import {Alert, Button, Card, Icon} from 'antd'
import {getDisplaySymbol, toBig, toHex, toNumber} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
import Notification from '../../common/loopringui/components/Notification'
import moment from 'moment'
import config from '../../common/config'
import Contracts from "LoopringJS/ethereum/contracts/Contracts"
import comFormatter from 'modules/formatter/common'
import {getLastGas} from 'modules/settings/formatters'
import GasFee from '../setting/GasFee1'
import {Containers} from 'modules'

const LoopringProtocol = Contracts.LoopringProtocol;

class CancelOrderConfirm extends React.Component {
  state = {
    loading: false,
    now:Math.floor(moment().valueOf() / 1e3)
  };

  componentDidMount(){
    setInterval(() => {this.setState({now:Math.floor(moment().valueOf() / 1e3)})},1000)
  }

  cancel = () => {
    const {cancelOrderConfirm} = this.props;
    cancelOrderConfirm.hideModal({id:'cancelOrderConfirm'});
  };

  ConfirmCancel = async () => {

    const {cancelOrderConfirm,settings,wallet} = this.props;
    const {type, market,order} = cancelOrderConfirm;
    const {now} =  this.state;
    const _this = this;
    const tx = {
      value:'0x0',
      chainId:config.getChainId(),
      to:settings.trading.contract.address
    };
    tx.gasLimit = config.getGasLimitByType(type).gasLimit;
    tx.gasPrice = toHex(toBig(getLastGas(this.props.gas).gasPrice).times(1e9));
    tx.nonce = toHex(await window.STORAGE.wallet.getNonce(window.WALLET.address));
    switch (type){
      case 'cancelOrder':
        const originalOrder ={...order};
        originalOrder.owner = order.address;
        originalOrder.tokenS = config.getTokenBySymbol(order.tokenS).address;
        originalOrder.tokenB = config.getTokenBySymbol(order.tokenB).address;
        tx.data  = LoopringProtocol.encodeCancelOrder(originalOrder);
        break;
      case 'cancelAllOrder':
        tx.data = LoopringProtocol.encodeInputs('cancelAllOrders',{cutoff:toHex(toBig(now))});
        break;
      case "cancelOrderByTokenPair":
        const tokenA = market.split('-')[0];
        const tokenB = market.split('-')[1];
        const token1 = config.getTokenBySymbol(tokenA).address;
        const token2 = config.getTokenBySymbol(tokenB).address;
        tx.data = LoopringProtocol.encodeInputs('cancelAllOrdersByTradingPair',{cutoff:toHex(toBig(now)),token1,token2});
        break;
      default:
        throw new Error('Wrong cancel order type ')
    }
    const account = wallet.account || window.account;
   this.setState({loading: true});
    const signedTx = await account.signEthereumTx(tx);
    window.ETH.sendRawTransaction(signedTx).then(({response, rawTx}) => {
      _this.cancel();
      _this.setState({loading: false});
      if (!response.error) {
        // window.STORAGE.transactions.addTx({hash: response.result, owner: account.address});
        window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
        window.RELAY.account.notifyTransactionSubmitted({txHash: response.result, rawTx, from: window.WALLET.getAddress()})
        Notification.open({
          message: type === 'cancelOrder' ? intl.get('order.cancel_order_success') : intl.get('order.cancel_all_success', {pair: market}),
          type: "success",
          description: (<Button className="alert-btn mr5"
                                onClick={() => window.open(`https://etherscan.io/tx/${response.result}`, '_blank')}> {intl.get('token.transfer_result_etherscan')}</Button> )
        });
      } else {
        Notification.open({
          message: type === 'cancelOrder' ? intl.get('order.cancel_order_failed') : intl.get('order.cancel_all_failed', {pair: market}),
          type: "error",
          description: response.error.message
        })
      }
    })
  };

  computeTime = (until) => {
    const {now} = this.state;
    const days = Math.floor((until - now)/(3600*24));
    const hours = Math.floor(((until-now) % (3600 *24)) / 3600);
    const minutes = Math.ceil(((until -now) % 3600)/60);
    const seconds =  Math.ceil((until-now) % 60);
    return {days,hours,minutes,seconds}
  };

  render() {
    const {cancelOrderConfirm} = this.props;
    const {loading,now} = this.state;
    const { type,market,order} = cancelOrderConfirm;
    const title = type === 'cancelOrder' ? intl.get('order.confirm_cancel_order') : intl.get('order.confirm_cancel_all', {pair: market || ''})
    return (
      <Card title={title}>
        {type === 'cancelOrder' &&
        <div>
          <div className="p15 pb25 text-center">
            {toNumber(order.validUntil) > toNumber(now) && <div> <div className="fs12 pt5 color-black-2">{intl.get('orders.order_will_expire')}</div>
            <div className="fs30 color-black-1">
              {intl.get("orders.expire_duration", this.computeTime(toNumber(order.validUntil)))}
            </div>
            </div>}
            {toNumber(order.validUntil) < toNumber(now) &&
            <div className="fs30 color-black-1">
              This order is already expired
            </div>}
            <div
              className="fs12 pt5 pb5 color-black-2">{intl.get('orders.order_validity')}：{comFormatter.getFormatTime(toNumber(order.validSince) * 1e3)} ~ {comFormatter.getFormatTime(toNumber(order.validUntil) * 1e3)}</div>
          </div>

        </div>}
        <Alert className="mb10" type="info" showIcon message={
          <div className="row align-items-center">
            <div className="col">
              <div className="color-black-2 fs14">{intl.get('orders.auto_cancel_not_cost_gas')}</div>
            </div>
            {toNumber(order.validUntil) > toNumber(now) && <div className="col-auto">
              {!loading &&
                <a onClick={this.cancel} className="color-primary-1 fs12 cursor-pointer">
                  {intl.get('orders.wait_expire')}
                  <Icon type="right"/>
                </a>
              }
              {loading &&
                <a className="color-black-3 fs12 cursor-pointer">
                  {intl.get('orders.wait_expire')}
                </a>
              }
            </div>}
            {toNumber(order.validUntil) <= toNumber(now) &&  <div className="col-auto">
              <a onClick={this.cancel} className="color-primary-1 fs12 cursor-pointer">
                return
                <Icon type="right"/>
              </a>
            </div>}
          </div>
        }/>
        {toNumber(order.validUntil) > toNumber(now) &&  <Alert className="mb10" type="info" showIcon message={
          <div className="row align-items-center">
            <div className="col">
              <div className="color-black-2 fs14">{intl.get('orders.manual_cancel_cost_gas')}</div>
            </div>
            <div className="col-auto">
              {!loading && <div>
                <a onClick={this.ConfirmCancel} className="color-primary-1 fs12 cursor-pointer">
                  {intl.get('orders.confirm_to_cancel')}
                  <Icon type="right"/>
                </a>
                  <Containers.Gas initState={{}}>
                    <GasFee gasLimit={200000}/>
                  </Containers.Gas>
              </div>
              }
              {loading &&
                <a className="color-black-3 fs12 cursor-pointer">
                  {intl.get('orders.canceling')}
                </a>
              }
            </div>
          </div>
        }/>}
      </Card>
    )
  }
}



export default CancelOrderConfirm
