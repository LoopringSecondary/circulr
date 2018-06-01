import React from 'react';
import { Button, Card, Form, Icon, Input, Popover, Select, Slider, Switch } from 'antd';
import intl from 'react-intl-universal';
import config from 'common/config'
import * as datas from 'common/config/data'
import * as fm from 'LoopringJS/common/formatter'
import {calculateGas} from 'LoopringJS/common/utils'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import contracts from 'LoopringJS/ethereum/contracts/Contracts'
import Currency from 'modules/settings/CurrencyContainer'
import * as orderFormatter from 'modules/orders/formatters'
import GasFee from '../setting/GasFee1'
import {Containers} from 'modules'
import {getLastGas, getEstimateGas} from 'modules/settings/formatters'

function TransferForm(props) {
  const {transfer, balance, wallet, marketcap, form, gas, dispatch} = props
  const { TextArea } = Input;

  let tokenSelected = {}
  if(transfer.assignedToken) {
    tokenSelected = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:transfer.assignedToken, toUnit:true})
  } else if(transfer.token) {
    tokenSelected = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:transfer.token, toUnit:true})
  }

  let gasLimit = config.getGasLimitByType('eth_transfer').gasLimit
  if(transfer.token && transfer.token !== "ETH") {
    gasLimit = config.getGasLimitByType('token_transfer').gasLimit
  }
  const gasResult = getLastGas(gas)
  const totalGas = gasResult.gas
  const gasPrice = gasResult.gasPrice

  const gasWorth = (
    <span className="">
      {totalGas && totalGas.gt(0) ? ` ≈ $${orderFormatter.calculateWorthInLegalCurrency(marketcap.items, 'ETH', totalGas).toFixed(2)}` : ''}
    </span>
  )

  function validateTokenSelect(value) {
    const result = form.validateFields(["amount"], {force:true});
    if(value) {
      return true
    } else {
      return false
    }
  }

  function validateAmount(value) {
    if(transfer.token && tokenFormatter.isValidNumber(value)) {
      const token = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:transfer.token, toUnit:true})
      const v = fm.toBig(value)
      return !v.lt(fm.toBig('0')) && !v.gt(token.balance)
    } else {
      return false
    }
  }

  function validateHex(value) {
    if(value === undefined || value === ''){
      return true
    }
    try {
      fm.toHex(value)
      return true
    } catch (e) {
      return false
    }
  }

  function handleChange(v) {
    if(v) {
      transfer.tokenChange({token:v})
      let gasLimit = config.getGasLimitByType('eth_transfer').gasLimit
      if(v !== "ETH") {
        gasLimit = config.getGasLimitByType('token_transfer').gasLimit
      }
      dispatch({type:"gas/fixedGasLimitChange",payload:{fixedGasLimit:gasLimit}})
    }
  }

  function amountChange(e) {
    if(e.target.value) {
      const v = fm.toNumber(e.target.value)
      transfer.setAmount({amount:v})
    }
  }

  function toContinue(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleSubmit()
    }
  }

  function handleSubmit() {
    form.validateFields((err, values) => {
      if (!err) {
        if(wallet.address) {
          const tx = {};
          tx.chainId = datas.configs.chainId
          tx.gasPrice = fm.toHex(fm.toBig(gasPrice).times(1e9))
          tx.gasLimit = fm.toHex(gasLimit)
          if(tokenSelected.symbol === "ETH") {
            tx.to = values.to;
            tx.value = fm.toHex(fm.toBig(values.amount).times(1e18))
            tx.data = fm.toHex(values.data || '0x');
          } else {
            const tokenConfig = config.getTokenBySymbol(tokenSelected.symbol)
            tx.to = tokenConfig.address;
            tx.value = "0x0";
            let amount = fm.toHex(fm.toBig(values.amount).times("1e"+tokenConfig.digits))
            tx.data = contracts.ERC20Token.encodeInputs('transfer', {_to:values.to, _value:amount});
          }
          const extraData = {from:wallet.address, to:values.to, tokenSymbol:tokenSelected.symbol, amount:values.amount, gas:totalGas.toString(10)}
          dispatch({type: 'layers/showLayer', payload: {id:'transferConfirm', tx, extraData}})
          dispatch({type:'gas/selectedGasChange', payload:{gasPrice}})
        } else {
          //TODO show unlock modal
          dispatch({type: 'layers/hideLayer', payload: {id:'transfer',}})
        }
      }
    });
  }

  function selectMax(e) {
    e.preventDefault();
    transfer.setIsMax({isMax:true})
  }

  function gasSettingChange(e) {
    e.preventDefault();
    transfer.setGasPopularSetting({gasPopularSetting:!transfer.gasPopularSetting})
  }

  function setGas(v) {
    setTimeout(()=>{
      transfer.setSliderGasPrice({sliderGasPrice:v})
    },0)
  }

  function gasLimitChange(e) {
    if(e.target.value){
      transfer.setSelectedGasLimit({selectedGasLimit:fm.toNumber(e.target.value)})
    }
  }

  function gasPriceChange(e) {
    transfer.setSelectedGasPrice({selectedGasPrice:fm.toNumber(e)})
  }

  function setAdvance() {
    transfer.setAdvance({advance:!transfer.advance})
  }

  function selectedGas(value) {
    console.log(value)
  }

  if(transfer.token && form.getFieldValue('amount') !== undefined && form.getFieldValue('amount') !== '') {
    let tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:transfer.token, toUnit:true}).balance
    const formBalance = form.getFieldValue('amount') ? fm.toBig(form.getFieldValue('amount')) : fm.toBig(0)
    if(transfer.token === 'ETH') {
      if(transfer.isMax) {
        tokenBalance = tokenBalance.gt(totalGas) ?  tokenBalance.minus(totalGas) : fm.toBig(0);
      } else {
        tokenBalance = formBalance.plus(totalGas).gt(tokenBalance) ? tokenBalance.minus(totalGas) : formBalance
      }
      if(!formBalance.isEqualTo(tokenBalance)) {
        form.setFieldsValue({"amount": tokenBalance.toString(10)})
      }
    } else {
      if(transfer.isMax && !formBalance.isEqualTo(tokenBalance)) {
        form.setFieldsValue({"amount": tokenBalance.toString(10)})
      }
    }
  }

  const assetsSorted = balance.items.map((token,index) => {
    return tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:token.symbol, toUnit:true})
  })
  assetsSorted.sort(tokenFormatter.sorter);

  const amountAfter = (<a href="" onClick={selectMax.bind(this)}>{intl.get('transfer.send_max')}</a>)

  const formatGas = (value) => {
    const gas = fm.toBig(value).times(fm.toNumber(gasLimit)).div(1e9).toString()
    return gas + " ETH";
  }
  const setGas = ()=>{
    dispatch({type:"gas/fixedGasLimitChange",payload:{fixedGasLimit:gasLimit}})
    dispatch({type:"layers/showLayer",payload:{id:'gasFee', advanced:true}})
  }
  return (
    <div className="form-dark pd-lg">
        <div className="sidebar-header">
          <h3>{intl.get('common.send')} {tokenSelected && tokenSelected.symbol}</h3>
        </div>
        <div className="">
            <Form>
              {
                !transfer.assignedToken &&
                <Form.Item colon={false} label={intl.get('common.token')}>
                  {form.getFieldDecorator('token', {
                    initialValue: '',
                    rules: [
                      {message: intl.get("common.token_not_select"),
                        validator: (rule, value, cb) => validateTokenSelect(value) ? cb() : cb(true)
                      }
                    ]
                  })(
                    <Select
                      size="large"
                      showSearch={false}
                      allowClear
                      placeholder={intl.get('transfer.token_selector_placeholder')}
                      optionFilterProp="children"
                      onChange={handleChange.bind(this)}
                      onFocus={()=>{}}
                      onBlur={()=>{}}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {assetsSorted.map((token,index) => {
                        const tokenBalance = tokenFormatter.getBalanceBySymbol({balances:balance.items, symbol:token.symbol, toUnit:true})
                        return <Select.Option value={token.symbol} key={index}>
                          <div className="row mr0">
                            <div className="col color-black-2">{token.symbol}</div>
                            <div className="col-atuo color-black-3 pl5">{tokenBalance.balance.gt(0) ? tokenBalance.balance.toString(10) : ''}</div>
                          </div>
                        </Select.Option>}
                      )}
                    </Select>
                  )}
                </Form.Item>
              }
              <Form.Item label={intl.get('common.recipient')} colon={false}>
                {form.getFieldDecorator('to', {
                  initialValue: '',
                  rules: [
                    {message: intl.get("common.invalid_eth_address"),
                      validator: (rule, value, cb) => tokenFormatter.validateEthAddress(value) ? cb() : cb(true)
                    }
                  ]
                })(
                  <Input placeholder="" size="large" onKeyDown={toContinue.bind(this)}/>
                )}
              </Form.Item>
              <Form.Item label={intl.get('common.amount')} colon={false} className="prefix">
                {form.getFieldDecorator('amount', {
                  initialValue: 0,
                  rules: [
                    {
                      message: intl.get('common.invalid_number'),
                      validator: (rule, value, cb) => validateAmount.call(this, value) ? cb() : cb(true)
                    }
                  ]
                })(
                  <Input className="d-block w-100" placeholder="" size="large"
                         suffix={amountAfter}
                         onChange={amountChange.bind(this)} onKeyDown={toContinue.bind(this)}
                         onFocus={() => {
                           const amount = form.getFieldValue("amount")
                           if (amount === 0) {
                             form.setFieldsValue({"amount": ''})
                           }
                         }}
                         onBlur={() => {
                           const amount = form.getFieldValue("amount")
                           if(amount === '') {
                             form.setFieldsValue({"amount": 0})
                           }
                         }}/>
                )}
              </Form.Item>

              {transfer.token === "ETH" && transfer.advance &&
                <Form.Item className="mb0" label={intl.get('transfer.data')} colon={false}>
                  {form.getFieldDecorator('data', {
                    initialValue: '',
                    rules: [
                      {message: intl.get("common.token_not_select"),
                        validator: (rule, value, cb) => validateHex(value) ? cb() : cb(true)
                      }
                    ]
                  })(
                    <TextArea autosize={{ minRows: 4, maxRows: 8 }} />
                  )}
                </Form.Item>
              }
            </Form>
            <div className="form-control-static d-flex justify-content-between mr-0 mt20 mb15 align-items-center">
              <span className="fs14 color-white-2">{intl.get('gas_setting.gas_fee')}</span>
              <span className="font-bold cursor-pointer" onClick={setGas}>
                  {totalGas.toString(10)} ETH {gasWorth}
                  <Icon type="right" />
              </span>
            </div>
            {transfer.token === "ETH" &&
              <div className="form-control-static d-flex justify-content-between mr-0 mt15 mb15 align-items-center">
                <span className="fs14 color-white-2">{intl.get('transfer.advanced')}</span>
                <span className="font-bold cursor-pointer">
                    {!transfer.advance &&
                      <Switch size="small" onChange={setAdvance.bind(this)}/>
                    }
                    {transfer.advance &&
                      <Switch size="small" defaultChecked onChange={setAdvance.bind(this)}/>
                    }
                </span>
              </div>
            }
            <Button className="btn btn-o-dark btn-block btn-xlg" onClick={handleSubmit}>{intl.get('actions.continue')}</Button>
        </div>

    </div>
  )
}
export default Form.create()(TransferForm);
