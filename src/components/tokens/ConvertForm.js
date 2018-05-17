import React from 'react';
import {Form, Input, Button} from 'antd';
import {getBalanceBySymbol} from "../../modules/tokens/TokenFm";
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import {toBig, toHex} from "../../common/loopringjs/src/common/formatter";
import config from '../../common/config'


const WETH = Contracts.WETH;

function ConvertForm(props) {

  const {wallet, convert, dispatch, balance, marketcap} = props;
  const {amount, token, gasPrice, gasLimit} = convert;
  const assets = getBalanceBySymbol({balances: balance.items, symbol: token, toUnit: true});

  const handleAmountChange = (e) => {
    convert.setAmount({amount: e.target.value})
  };
  const setMax = () => {
    convert.setMax({balance: assets.balance})
  };
  const toConvert = () => {
    let data = '';
    let value = '';
    if (token.toLowerCase() === 'Eth') {
      data = WETH.encodeInputs('deposit');
      value = toHex(toBig(amount).times('1e18'));
    } else {
      data = WETH.encodeInputs('withdraw', {wad: toHex(toBig(amount).times('1e18'))});
      value = '0x0'
    }
    const to = config.getTokenBySymbol('WETh').address;
    const tx = {
      gasLimit: toHex(gasLimit),
      data,
      to,
      gasPrice: toHex(toBig(gasPrice).times(1e9)),
      chainId: 1,
      value,
      nonce:"0x11"
    };
    const {account} = wallet;
    const signTx = account.signEthereumTx(tx);
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
      <Form.Item className="form-dark prefix">
        <Input placeholder="0" suffix={token.toLowerCase() === 'eth' ? 'WETH' : 'ETH'} onChange={handleAmountChange}
               value={amount.toString()}/>
      </Form.Item>
      <div className="d-flex justify-content-between text-color-dark-2">
        <small>≈￥0.00</small>
        <a onClick={setMax}>
          <small>最大数量</small>
        </a>
      </div>
      <div className="blk"/>
      <p className="text-color-dark-1">我们为您保留0.1 ETH作为油费以保证后续可以发送交易</p>
      <Button className="btn-block btn-xlg btn-o-dark" onClick={toConvert}>是的，马上转换</Button>
    </div>
  )
}

export default ConvertForm
