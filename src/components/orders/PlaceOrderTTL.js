import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'

const GasFeeForm = ({
    settings,form
  }) => {
  const {trading} = settings
  function handleReset() {
  }
  function resetForm(){
    form.resetFields()
  }
  return (
    <div>
      <div className="pb10 fs16 color-black-1 zb-b-b">TTL Fee</div>
      <div className="zb-b">
        <Tabs defaultActiveKey="1" >
          <Tabs.TabPane tab={<div className="pb5"></div>} key="1">
            持续时间+快速选项
          </Tabs.TabPane>
          <Tabs.TabPane tab={<div className="pb5">Advanced</div>} key="3">
             起止时间
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className="mt20 text-right d-block w-100">
        <Button onClick={handleReset} type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </div>
  );
};
export default Form.create()(connect(({settings})=>({settings}))(GasFeeForm));


