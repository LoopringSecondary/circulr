import React from 'react';
import {Button, Form, Icon, Input} from 'antd';
import TokenFormatter, {getBalanceBySymbol, getWorthBySymbol, isValidNumber} from "../../modules/tokens/TokenFm";
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {toBig, toHex} from "../../common/loopringjs/src/common/formatter";
import config from '../../common/config'
import Currency from 'modules/settings/CurrencyContainer'
import {connect} from "dva";
import {Containers} from 'modules'
import GasFee from '../setting/GasFee1'
import intl from 'react-intl-universal';
import {getLastGas} from "../../modules/settings/formatters";



const WETH = Contracts.WETH;
function ConvertForm(props) {
  const {address, convert,convertToken, balances, prices,form,gas,dispatch} = props;
  const gasPrice = getLastGas(gas).gasPrice
  const {amount,isMax,loading} = convert;
  const {token} = convertToken;
  if(!token){console.error('token is required');return null}
  const type = token.toLowerCase() === 'eth' ? 'deposit': 'withdraw';
  const gasLimit = config.getGasLimitByType(type).gasLimit;
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
    form.validateFields(async (err,values) => {
      if(!err){
        convert.setLoading({loading:true});
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
          nonce: toHex((await window.RELAY.account.getNonce(address)).result)
      };

        dispatch({type:'convertConfirm/init',payload:{tx,amount,token}});
        dispatch({type:'convert/reset',payload:{}});
        dispatch({type: 'layers/hideLayer', payload: {id: 'convertToken'}});
        dispatch({type: 'layers/showLayer', payload: {id: 'convertConfirm'}});
    }})
  };
  const getGas = () =>{
    return tf.toPricisionFixed(toBig(gasPrice).times(gasLimit).div(1e9))
  }
  const setGas = ()=>{
    dispatch({type:"layers/showLayer",payload:{id:'gasFee'}})
  }
  const onGasChange = ({gasPrice}) => {
    let amount  = amount;
    if (isMax && token.toLowerCase() === 'eth') {
      const gas = toBig(gasPrice).times(gasLimit).div(1e9);
      amount = assets.balance.minus(gas).minus(0.1).isPositive() ? assets.balance.minus(gas).minus(0.1) : toBig(0);
      convert.setAmount({amount});
    }
    form.setFieldsValue({amount})
  };

  return (
    <div className="pd-lg">
      <div className="sidebar-header">
        <h3>{token.toLowerCase() === 'eth' ? intl.get('convert.convert_eth_title'):intl.get('convert.convert_weth_title')}</h3>
      </div>
      <div className="divider solid"/>
      <div className="row align-items-center justify-content-center mt25 mb25">
        <div className="col-auto text-center pr30">
          <div className="fs18">{amount.toString() ? amount.toString() : 0}</div>
          <div className="fs16">{token}</div>
        </div>
        <div className="col-auto">
          <i className="loopring-icon loopring-icon-convert fs32"/>
        </div>
        <div className="col-auto text-center pl30">
          <div className="fs18">{amount.toString() ? amount.toString() : 0}</div>
          <div className="fs16">{token.toLowerCase() === 'eth' ? 'WETH' : 'ETH'}</div>
        </div>
      </div>
      <Form>
        <Form.Item className="prefix">
          {form.getFieldDecorator('amount', {
            initialValue: amount,
            rules: [{
              required: true,
              message: 'invalid number',
              validator: (rule, value, cb) => isValidNumber(value) && toBig(value).lt(assets.balance)  ? cb() : cb(true)
            }]
          })(
            <Input  suffix={<div>
              <a onClick={setMax} className="text-primary mr5">
                <small>{intl.get('convert.actions_max')}</small>
              </a>
              <span className="color-black-2">{token}</span>
            </div>} onChange={handleAmountChange}/>
          )}
        </Form.Item>
      </Form>
      <div  className="text-color-dark-1">
        {
          false &&
          <div className="form-control-static d-flex justify-content-between mr-0">
            <span>Gas Fee</span>
            <span className="font-bold">
              <Containers.Gas initState={{gasLimit}}>
                <GasFee onGasChange={onGasChange}/><span className="offset-md"> {getGas()} ETH ≈ <Currency/> {getWorthBySymbol({prices, symbol: 'ETH', amount:getGas()})}</span>
              </Containers.Gas>
            </span>
          </div>
        }
        {
          false &&
          <div className="form-control-static d-flex justify-content-between mr-0 mt15 mb15 align-items-center">
            <span className="fs14 color-white-2">Balance</span>
            <span className="font-bold fs12">
              {assets.balance.toString()} {token}
              <Icon hidden type="right" className="ml5" />
            </span>
          </div>
        }
        <div className="form-control-static d-flex justify-content-between mr-0 mt15 mb15 align-items-center">
          <span className="fs14 color-white-2">{intl.get('common.gas')}</span>
          <span className="font-bold cursor-pointer fs12" onClick={setGas}>
              <Currency/> {getWorthBySymbol({prices, symbol: 'ETH', amount:getGas()})} ≈ {getGas()} ETH
              <Icon type="right" className="ml5" />
          </span>
        </div>
      </div>
      <Button className="btn-block btn-xlg btn-o-dark" onClick={toConvert}  loading={loading} disabled={loading}>{intl.get('convert.actions_confirm_convert')}</Button>
      {false && token.toLowerCase() === 'eth' && <p className="text-color-dark-1 mt15">{intl.get('convert.convert_eth_tip')}</p>}
    </div>
  )
}

function mapToProps(state) {
  return {
    address:state.wallet.address,
    balances:state.sockets.balance.items,
    prices:state.sockets.marketcap.items,
    gas:state.gas
  }

}

export default connect(mapToProps)(Form.create()(ConvertForm))
