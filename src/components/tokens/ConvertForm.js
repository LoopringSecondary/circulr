import React from 'react';
import {Form, Input, Button} from 'antd';
import {getBalanceBySymbol, getWorthBySymbol,isValidNumber} from "../../modules/tokens/TokenFm";
import TokenFormatter from '../../modules/tokens/TokenFm';
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {toBig, toHex} from "../../common/loopringjs/src/common/formatter";
import config from '../../common/config'
import Currency from 'modules/settings/CurrencyContainer'
import {connect} from "dva";
import {Containers} from 'modules'
import GasFee from '../setting/GasFee1'

const WETH = Contracts.WETH;

function ConvertForm(props) {

  const {wallet, convert,convertToken, balances, prices,form,gasPrice} = props;
  const {amount} = convert;
  const {token} = convertToken;
  const type = token.toLowerCase() === 'eth' ? 'deposit': 'withdraw';
  const gasLimit = config.getGasLimitByType(type).gasLimit;
  const {address} = wallet;
  const account = wallet.account || window.account;
  const assets = getBalanceBySymbol({balances, symbol: token, toUnit: true});
  const tf = new TokenFormatter({symbol:token});

  const handleAmountChange = (e) => {
    convert.setAmount({amount: e.target.value});
  };
  const setMax = () => {
    const gas = toBig(gasPrice).times(gasLimit).div(1e9);
    let max = assets.balance;
    if (token === 'ETH') {
      max = toBig(assets.balance).minus(gas).minus(0.1).isPositive() ? toBig(assets.balance).minus(gas).minus(0.1) : toBig(0)
    }
    convert.setMax({amount: max});
    form.setFieldsValue({amount:max})
  };
  const toConvert =  async () => {
    form.validateFields(async  (err,values) => {
      if(err){
        let data = '';
        let value = '';
        if (token.toLowerCase() === 'Eth') {
          data = WETH.encodeInputs('deposit');
          value = toHex(tf.getDecimalsAmount(amount));
        } else {
          data = WETH.encodeInputs('withdraw', {wad: toHex(tf.getDecimalsAmount(amount))});
          value = '0x0'
        }
        const to = config.getTokenBySymbol('WETH').address;
        const tx = {
          gasLimit: toHex(gasLimit),
          data,
          to,
          gasPrice: toHex(toBig(gasPrice).times(1e9)),
          chainId: config.getChainId(),
          value,
          nonce: toHex(await window.STORAGE.wallet.getNonce(address))
      };

        const signTx = await account.signEthereumTx(tx);
        //  const res = await window.ETH.sendRawTransaction(signTx);
        console.log(signTx)
     }
    });

  };

  const getGas = () =>{
    return tf.toPricisionFixed(toBig(gasPrice).times(gasLimit).div(1e9))
  };

  const onGasChange = ({gasPrice}) => {
    convert.gasPriceChange({gasPrice,token,gasLimit})
  };

  return (
    <div>
      <div className="modal-header text-dark"><h3>转换</h3></div>
      <div className="pd-md text-center text-color-dark-1">
        <span><i className="icon-ETH icon-token-md"/><b>{token}</b></span>
        <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"/></span>
        <span className="offset-lg"><b>{token.toLowerCase() === 'eth' ? 'WETH' : 'ETH'} </b><i
          className="icon-WETH icon-token-md"/></span>
      </div>
      <div className="divider solid"/>
      <Form>
        <Form.Item>
          {form.getFieldDecorator('amount', {
            initialValue: amount,
            rules: [{
              required: true,
              message: 'invalid number',
              validator: (rule, value, cb) => isValidNumber(value) && toBig(value).lt(assets.balance)  ? cb() : cb(true)
            }]
          })(
            <Input  suffix={token.toLowerCase() === 'eth' ? 'WETH' : 'ETH'} onChange={handleAmountChange}/>
          )}
        </Form.Item>
      </Form>

      <div className="d-flex justify-content-between text-color-dark-2">
        <small>
          {amount && prices && isValidNumber(amount) &&
            <span>
              <Currency/>
              {getWorthBySymbol({prices, symbol: 'ETH', amount})}
            </span>
          }
        </small>
        <a onClick={setMax}>
          <small>最大数量</small>
        </a>
      </div>
      <div className="blk"/>
      <p className="text-color-dark-1">我们为您保留0.1 ETH作为油费以保证后续可以发送交易</p>
      <div className="text-color-dark-1">
        <div className="form-control-static d-flex justify-content-between mr-0">
          <span>Gas Fee</span>
          <span className="font-bold">
                  <Containers.Gas initState={{gasLimit}}>
                    <GasFee onGasChange={onGasChange}/>
                  </Containers.Gas>
            <span>{getGas()}</span>n
                    <span className="offset-md"> ETH ≈ <Currency/> {getWorthBySymbol({prices, symbol: 'ETH', amount:getGas()})}</span>
                  </span>
        </div>
      </div>
      <Button className="btn-block btn-xlg btn-o-dark" onClick={toConvert}>是的，马上转换</Button>
    </div>
  )
}

function mapToProps(state) {
  return {
    balances:state.sockets.balance.items,
    prices:state.sockets.marketcap.items,
    gasPrice:state.gas.gasPrice.last
  }

}

export default connect(mapToProps)(Form.create()(ConvertForm))
