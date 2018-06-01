import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Alert from 'LoopringUI/components/Alert'

const LRCFeeForm = ({
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
    <Card title={<div className="pl15 pr15">{intl.get('setting_lrcfee.title')}</div>} className="rs">
      <Tabs defaultActiveKey={'basic'} tabBarStyle={{marginBottom:"0px"}}>
        <Tabs.TabPane tab={intl.get('setting_lrcfee.tabs_basic')} key="basic">
          <div className="">
            <Radio.Group defaultValue={1} className="d-block w-100">
                <Radio value={1} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        最小值：5LRC
                      </div>
                      <div className="fs12 color-black-3">
                      矿工撮合所需要的最低费用（当前网络）
                      </div>
                  </div>
                </Radio>
                <Radio value={2} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                       最高值：45LRC
                      </div>
                      <div className="fs12 color-black-3" >
                       用户支出的最高LRC Fee（当前网络）
                      </div>
                  </div>
                </Radio>
                <Radio value={3} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10 pb10">
                      <div className="fs14 color-black-1">
                        推荐值：15 LRC
                      </div>
                      <div className="fs12 color-black-3">
                        订单金额 × LRC Fee 平均值（当前网络）
                      </div>
                  </div>
                </Radio>
                <Radio value={4} className="d-flex align-items-center mb0 w-100 zb-b-b pl15 pr15">
                  <div className="ml5 pt10">
                      <div className="fs14 color-black-1">
                        自定义值
                      </div>
                      <div>
                        <Form.Item label={null} colon={false} className="mb0">
                          {form.getFieldDecorator('gasPrice', {
                            initialValue:Number([]),
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
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={intl.get('setting_lrcfee.tabs_advanced')} key="advance">
          <div className="p15">
            <Alert type="info" title={<div className="color-black-1">如何科学的设置 LRC Fee ？<a>常见问题<Icon type="right" /></a></div>} theme="light" size="small" />
            <div className="pt15 pb15 color-black-3">
              TODO
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Form.create()(connect()(LRCFeeForm));


