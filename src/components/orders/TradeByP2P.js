import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import {connect} from 'dva'
const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row pt10 pb10 pl0 pr0 zb-b-b">
      <div className="col">
        <div className="fs14 color-black-2">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-1 text-wrap">{value}</div>
      </div>
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
  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b mb15">Privacy P2P Trade</div>
      <Form.Item label={null} colon={false}>
        <Input placeholder="" size="large"
               prefix={`Price`}
               suffix={<span className="fs14 color-black-2">LRC</span>}

        />
      </Form.Item>
      <Form.Item label={null} colon={false}>
        <Input placeholder="" size="large"
               prefix={`Amount`}
               suffix={<span className="fs14 color-black-2">ZRX</span>}
        />
      </Form.Item>
    </div>
  );
};


export default Form.create()(connect()(TradeByP2P));


