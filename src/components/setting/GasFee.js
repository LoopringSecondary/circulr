import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'

const GasFeeForm = ({
    settings,form
  }) => {
  const {trading} = settings
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
    <Card title={<div className="pl15">Set Gas Fee</div>} className="rs">
      <Tabs defaultActiveKey="1" >
        <Tabs.TabPane tab={<div className="pb5">Recommended</div>} key="1">
          <Radio.Group value={1} className="d-block w-100">
              <Radio value={1} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                <div className="ml5 pt10 pb10">
                    <div className="fs14 color-black-1">
                      上一次：0.000055ETH
                    </div>
                    <div className="fs12 color-black-3">
                    Gas(200000) * Gas Price(10 Gwei)
                    </div>
                </div>
              </Radio>
              <Radio value={2} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                <div className="ml5 pt10 pb10">
                    <div className="fs14 color-black-1">
                      推荐值：0.000015ETH
                    </div>
                    <div className="fs12 color-black-3" >
                      Gas(200000) * Gas Price(10 Gwei)
                    </div>
                </div>
              </Radio>
              <Radio value={4} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                <div className="ml5 pt10 pb10">
                    <div className="fs14 color-black-1">
                      自定义值：0.000015ETH
                    </div>
                    <div className="fs12 color-black-3" >
                      Gas(200000) * Gas Price(10 Gwei)
                    </div>
                    <div>
                      <Form.Item label={null} colon={false} className="mb0">
                        {form.getFieldDecorator('gasPrice', {
                          initialValue:Number([trading.gasPrice]),
                          rules:[]
                        })(
                          <Slider min={1} max={99} step={1}
                            marks={{
                              1: intl.get('settings.slow') ,
                              99: intl.get('settings.fast') ,
                            }}
                          />
                        )}
                      </Form.Item>
                    </div>
                </div>
              </Radio>
          </Radio.Group>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<div className="">Advanced</div>} key="3">
          <div className="fs12 color-black-3" hidden>
          { intl.get('settings.gasPrice')+':  '+ trading.gasPrice+" Gwei" }
          </div>
          <div className="fs14 color-black-1 pl10 pr10" style={{minWidth:'300px'}}>
              <div className="">
                <Input className="" addonBefore="Gas Limit" />
              </div>
              <div className="">
                <Input className="" addonBefore="Gas Price" />
              </div>
              <div className="text-left">
                <Input className="" addonBefore="Gas Fee" style={{paddingLeft:'0px'}} value="0.005 ETH" suffix={<span className="color-black-3">Gas Price x Gas Fee</span>}/>
              </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
      <div className="p15">
        <Button onClick={()=>{}} type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </Card>
  );
};

/*<Containers.Gas initState={{gasLimit}}>*/
    // <GasFee advanced={transfer.token.toLowerCase() === 'eth'}/>
// </Containers.Gas>

export default Form.create()(connect(({settings})=>({settings}))(GasFeeForm));




