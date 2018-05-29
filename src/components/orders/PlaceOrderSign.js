import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Collapse} from 'antd'
import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'
const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row pt5 pb5 pl0 pr0 ">
      <div className="col">
        <div className="fs14 color-black-2">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-1 text-wrap">{value}</div>
      </div>
    </div>
  )
}
const SignItem = (props) => {
  const {title, description,icon} = props
  return (
    <div className="text-center">
      { icon && <div className=""><i className={`fs24 icon-${icon}`}></i></div> }
      { title && <div className="fs14 color-black-1 text-wrap">{title}</div> }
      { description && <div className="fs12 color-black-3">{description}</div> }
    </div>
  )
}

const PlaceOrderSteps = ({
    settings,form
  }) => {
  const TxHeader = ({tx,key})=>{
    return (
      <div className="row pl0 pr0 align-items-center">
        <div className="col">
          <div className="fs16 color-black-1">{tx.title}</div>
        </div>
        <div className="col-auto pr20">
          {tx.isSigned &&
            <div className="text-up">
               Signed <Icon className="ml5" type="check-circle"  />
            </div>
          }
          {!tx.isSigned &&
            <div className="color-black-3">
              UnSigned <Icon className="ml5" type="check-circle-o"  />
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
          <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} value={""}/>
        </div>
        <div className="col-6 pl5">
          <Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} value={""}/>
        </div>
      </div>
    )
  }
  const txs = [
    {
      title:'Sign tx for enable LRC',
      isSigned:true,
    },
    {
      title:'Sign tx for enable EOS',
      isSigned:false,
    },
    {
      title:'Sign tx for submitting order',
      isSigned:false,
    },
  ]
  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b">交易签名</div>
      <div className="mb15"></div>
      <div>
        <Alert title="您一共需要签名 3 次" theme="light" />
        <div className="mb15"></div>
        <Alert title="请在 Metamask 中完成签名操作" theme="light" />
        <div className="mb15"></div>
        <Collapse defaultActiveKey={[]}>
          {
            txs.map((item,index)=>
              <Collapse.Panel header={<TxHeader tx={item} />} key={index}>
                <TxContent tx={item} />
              </Collapse.Panel>
            )
          }
        </Collapse>
      </div>

    </div>
  );
};


export default Form.create()(connect(({settings})=>({settings}))(PlaceOrderSteps));


