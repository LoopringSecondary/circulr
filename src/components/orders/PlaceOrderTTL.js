import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Popover,Collapse,DatePicker} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from 'moment'

const TTLForm = ({
    form
  }) => {
  function handleReset() {
  }
  function resetForm(){
    form.resetFields()
  }
  const customPanelStyle = {
    background: '#fff',
    borderRadius: 4,
    border: 'none',
    overflow: 'hidden',
  }
  const timeToLiveValueChange = ()=>{}
  const timeToLivePatternChanged = ()=>{}
  const timeToLiveTimeSelected = ()=>{}
  const placeOrder = {}

  const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
    initialValue: "minute",
    rules: []
  })(
    <Select style={{width: 90}} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={timeToLiveValueChange.bind(this, 'moreUnit')}>
      <Select.Option value="minute">{intl.get('trade.minute')}</Select.Option>
      <Select.Option value="hour">{intl.get('trade.hour')}</Select.Option>
      <Select.Option value="day">{intl.get('trade.day')}</Select.Option>
    </Select>
  )
  return (
    <Card title={<div className="pl15 pr15">Time To Live Of Order</div>} className="rs">
      <div className="zb-b m15">
          <Collapse accordion style={customPanelStyle} defaultActiveKey={['easy']} onChange={timeToLivePatternChanged}>
            <Collapse.Panel header={intl.get('trade.order_ttl_expire_in')} key="easy">
              <div className="pt5 pb5">
                <Form.Item className="ttl mb0" colon={false} label={null}>
                  {form.getFieldDecorator('timeToLivePopularSetting')(
                    <Radio.Group onChange={timeToLiveValueChange.bind(this, 'popular')}>
                      <Radio className="mb5" value="1hour">1 {intl.get('trade.hour')}</Radio>
                      <Radio className="mb5" value="1day">1 {intl.get('trade.day')}</Radio>
                      <Radio className="mb5" value="1week">1 {intl.get('trade.week')}</Radio>
                      <Radio className="mb5" value="1month">1 {intl.get('trade.month')}</Radio>
                      <Radio className="mb5" value="more">{intl.get('trade.more')}</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                {!placeOrder.timeToLivePopularSetting &&
                <Form.Item className="mb0 d-block ttl" colon={false} label={null}>
                  {form.getFieldDecorator('timeToLive', {
                    rules: [{
                      message: intl.get('trade.integer_verification_message'),
                      // validator: (rule, value, cb) => orderFormatter.validateOptionInteger(value) ? cb() : cb(true)
                    }]
                  })(
                    <Input className="d-block w-100" placeholder={intl.get('trade.time_to_live_input_place_holder')} size="large" addonAfter={timeToLiveSelectAfter}
                           onChange={timeToLiveValueChange.bind(this, 'moreValue')}/>
                  )}
                </Form.Item>}
              </div>
            </Collapse.Panel>
            <Collapse.Panel header={intl.get('trade.order_ttl_from_to')} key="advance">
              <Form.Item className="mb5 ttl" colon={false} label={null}>
                {form.getFieldDecorator('timeToLiveTimeSelector', {
                  initialValue:[moment(), moment().add(1, 'days')]
                })(
                  <DatePicker.RangePicker
                    locale={'en-US'}
                    getCalendarContainer={trigger =>{
                      // return ReactDOM.findDOMNode(this.refs.popover);
                    }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['Start Time', 'End Time']}
                    onChange={timeToLiveTimeSelected}
                  />
                )}
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
      </div>
      <div className="d-block w-100 p15">
        <Button type="primary" size="large" className="d-block w-100">确认</Button>
      </div>
    </Card>
  );
};
export default Form.create()(connect()(TTLForm));


