import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import {connect} from 'dva'

const MenuItem = (prop)=>{
  return (
    <div className="row pt10 pb10 pl10 pr10 zb-b-b align-items-center">
      <div className="col">
        <span className="fs14 color-black-1 pr10">{prop.label}</span>
      </div>
      {prop.value &&
        <div className="col-auto text-right">
          {prop.value}
        </div>
      }
      {prop.action &&
        <div className="col-auto text-right">
          {prop.action}
        </div>
      }
    </div>
  )
}
const TradeByP2P = ({
    form
  }) => {
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleReset() {

  }
  function resetForm(){
    form.resetFields()
  }
  const select = (
    <Select
      placeholder={"LRC"}
      dropdownMatchSelectWidth={false}
      value={"LRC"}
      size="small"
      style={{width:'80px',paddingLeft:'10px'}}
    >
      <Select.Option value="LRC">LRC</Select.Option>
      <Select.Option value="ETH">ETH</Select.Option>
    </Select>
  )
  const TokenItem = ({token})=>{
    return (
      <div className="row">
        <div className="col color-black-1 fs16">{token.symbol}</div>
        <div className="col-atuo color-black-3 fs14 pl5">{token.balance}</div>
      </div>
    )
  }
  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b mb25">Privacy P2P Trade</div>
      <div className="row pl0 pr0 pt10 pb10 align-items-center">
        <div className="col pl0 pr0">
          <Select
            placeholder={"LRC"}
            dropdownMatchSelectWidth={false}
            size="small"
            defaultValue="LRC"
            className="d-block"
          >
            <Select.Option value="LRC"><TokenItem token={{symbol:'LRC',balance:'100.00'}} /></Select.Option>
            <Select.Option value="ETH"><TokenItem token={{symbol:'WETH',balance:'15.00'}} /></Select.Option>
          </Select>
          { false && <Input placeholder="" size="large" className="d-block mt5"/> }
        </div>
        <div className="col-auto pl15 pr15">
          <i className="loopring-icon loopring-icon-convert fs24"></i>
        </div>
        <div className="col pl0 pr0">
          <Select
            placeholder={"LRC"}
            dropdownMatchSelectWidth={false}
            size="small"
            defaultValue="ETH"
            className="d-block"
          >
            <Select.Option value="LRC"><TokenItem token={{symbol:'LRC',balance:'100.00'}} /></Select.Option>
            <Select.Option value="ETH"><TokenItem token={{symbol:'WETH',balance:'15.00'}} /></Select.Option>
          </Select>
          { false && <Input placeholder="" size="large" className="d-block mt5"/> }
        </div>
      </div>
      <div className="row pl0 pr0 pt10 pb10 align-items-center">
        <div className="col pl0 pr0">
          <Input placeholder="" size="large" className="d-block mt5"/>
        </div>
        <div className="col-auto pl15 pr15">
          <i className="loopring-icon loopring-icon-convert fs24"></i>
        </div>
        <div className="col pl0 pr0">
          <Input placeholder="" size="large" className="d-block mt5"/>
        </div>
      </div>
      <div className="row pl0 pr0 pt10 pb10">
        <div className="col pl0 pr0">
          <Input placeholder="1.00" size="large"
                 addonAfter={<div style={{width:'50px'}}>LRC</div>}
          />
        </div>
      </div>
      <div className="row pl0 pr0 pt10 pb10">
        <div className="col pl0 pr0">
          <Input placeholder="1.00" size="large"
                 addonAfter={<div style={{width:'50px'}}>WETH</div>}
          />
        </div>
      </div>
      <div className="mt10 zb-b">
        <MenuItem label="Price" value="0.00015 LRC/WETH" />
        <MenuItem label="LRC Fee" value="0 LRC" />
        <MenuItem label="ETH Gas" action={<span className="">0.000052 ETH<Icon type="right" className="ml5" /></span>} />
        <MenuItem label="Time to Live" action={<span className="">06-10 10:22<Icon type="right" className="ml5" /></span>} />
      </div>
      <div className="mb15"></div>
      <Button type="primary" size="large" className="d-block w-100">Generate Order</Button>
      <div className="mb15"></div>
      { false && <Alert type="info" title={<div className="color-black-1">分享给指定的人</div>} theme="light" size="small"/> }
      <div className="mb15"></div>
    </div>
  );
};


export default Form.create()(connect()(TradeByP2P));


