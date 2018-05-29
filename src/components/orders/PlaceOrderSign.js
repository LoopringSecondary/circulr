import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Collapse} from 'antd'
import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'

const PlaceOrderSteps = ({
    settings,form
  }) => {
  const TxHeader = ({tx,index})=>{
    return (
      <div className="row pl0 pr0 pt10 pb10 align-items-center">
        <div className="col">
          <div className="fs18 color-black-1">
            <Button type="primary" shape="circle" className="mr10">{index+1}</Button>
            {tx.title}
          </div>
        </div>
        <div className="col-auto pr20">
          {tx.isSigned &&
            <div className="text-up">
               Signed <Icon className="ml5" type="check-circle"  />
            </div>
          }
          {!tx.isSigned &&
            <div className="color-black-3">
              <a href="">Sign<Icon className="ml5" type="right"  /></a>
            </div>
          }
        </div>
      </div>
    )
  }
  const TxContent = ({tx,key})=>{
    return (
      <div className="row pl0 pr0 ">
        <div className="col-6 pr5">
          <Input.TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} value={""}/>
        </div>
        <div className="col-6 pl5">
          <Input.TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} value={""}/>
        </div>
      </div>
    )
  }
  const txs = [
    {
      title:'Sign tx to enable LRC',
      isSigned:true,
    },
    {
      title:'Sign tx to enable EOS',
      isSigned:false,
    },
    {
      title:'Sign tx to submit order',
      isSigned:false,
    },
  ]
  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b">交易签名</div>

      <div className="mb15"></div>
      <Alert type="info" title="您需要通过 Metamask 完成下面 3 个交易的签名：" theme="light" size="small" />
      <div className="mb15"></div>
      <Collapse defaultActiveKey={[]}>
        {
          txs.map((item,index)=>
            <Collapse.Panel header={<TxHeader tx={item} index={index} />} key={index} showArrow={false}>
              <TxContent tx={item} />
            </Collapse.Panel>
          )
        }
      </Collapse>
    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(PlaceOrderSteps));


