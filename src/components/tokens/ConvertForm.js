import React from 'react';
import {Form, Input, Button} from 'antd';

function ConvertForm(props) {
  console.log(props);
  const {wallet, convert, dispatch,balance,marketcap} = props;
  const gasPrice = 10;
  const gasLimit = 200000;
  const symbol = 'ETH'

  const {amount} = convert;

  const handleAmountChange = (e) =>{
    convert.setAmount({amount:e.target.value})
  }
  return (
    <div>
      <div className="modal-header text-dark"><h3>转换</h3></div>
      <div className="pd-md text-center text-color-dark-1">
        <span><i className="icon-ETH icon-token-md"/><b>{symbol}</b></span>
        <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"/></span>
        <span className="offset-lg"><b>{symbol.toLowerCase() === 'eth' ? 'WETH' : 'ETH'} </b><i
          className="icon-WETH icon-token-md"/></span>
      </div>
      <div className="divider solid"/>
      <Form.Item className="form-dark prefix">
        <Input placeholder="0" suffix={symbol.toLowerCase() === 'eth' ? 'WETH' : 'ETH'} onChange={handleAmountChange} value={amount}/>
      </Form.Item>
      <div className="d-flex justify-content-between text-color-dark-2">
        <small>≈￥0.00</small>
        <small>最大数量</small>
      </div>
      <div className="blk"/>
      <p className="text-color-dark-1">我们为您保留0.1 ETH作为油费以保证后续可以发送交易</p>
      <Button className="btn-block btn-xlg btn-o-dark">是的，马上转换</Button>
    </div>
  )
}

export default ConvertForm
