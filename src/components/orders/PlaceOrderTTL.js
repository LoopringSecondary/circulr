import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Popover,Collapse,DatePicker} from 'antd'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import moment from 'moment'

class TTLForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { form,ttl:ttlModel } = this.props
    function handleReset() {
    }
    function resetForm(){
      form.resetFields()
    }
    function timeToLivePatternChanged(value) {
      if(value === 'advance') {
        const timeToLiveTimeSelector = form.getFieldValue('timeToLiveTimeSelector')
        if(timeToLiveTimeSelector.length === 2) {
          ttlModel.timeToLivePatternChangeEffects({timeToLivePatternSelect:value, timeToLiveStart: timeToLiveTimeSelector[0], timeToLiveEnd: timeToLiveTimeSelector[1]})
        }
      } else {
        ttlModel.timeToLivePatternChangeEffects({timeToLivePatternSelect:value})
      }
    }
    function timeToLiveValueChange(type, e) {
      if(type === 'popular') {
        const ttl = e.target.value
        let timeToLivePopularSetting = true, timeToLive = 1, timeToLiveUnit = ''
        switch (ttl) {
          case '1hour':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'hour'
            break;
          case '1day':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'day'
            break;
          case '1week':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'week'
            break;
          case '1month':
            timeToLivePopularSetting = true
            timeToLiveUnit = 'month'
            break;
          case 'more':
            timeToLivePopularSetting = false
            break;
        }
        ttlModel.timeToLiveEasyTypeChangeEffects({type, timeToLivePopularSetting, timeToLive, timeToLiveUnit})
      } else {
        if (type === 'moreUnit') {
          const ttl = form.getFieldValue('timeToLive')
          const unit = e
          ttlModel.timeToLiveEasyTypeChangeEffects({type, timeToLive: ttl, timeToLiveUnit: unit})
        }
        if (type === 'moreValue') {
          const ttl = e.target.value
          const unit = form.getFieldValue('timeToLiveUnit')
          ttlModel.timeToLiveEasyTypeChangeEffects({type, timeToLive: ttl, timeToLiveUnit: unit})
        }
      }
    }

    function timeToLiveTimeSelected(value) {
      if(value.length === 2) {
        ttlModel.timeToLivePatternChangeEffects({timeToLivePatternSelect:'advance', timeToLiveStart: value[0], timeToLiveEnd: value[1]})
      }
    }

    const placeOrder = {}
    const timeToLiveSelectAfter = form.getFieldDecorator('timeToLiveUnit', {
      initialValue: "minute",
      rules: []
    })(
      <Select style={{width: 90}} getPopupContainer={triggerNode => triggerNode.parentNode} onChange={timeToLiveValueChange.bind(this, 'moreUnit')}>
        <Select.Option value="minute">{intl.get('common.minute')}</Select.Option>
        <Select.Option value="hour">{intl.get('common.hour')}</Select.Option>
        <Select.Option value="day">{intl.get('common.day')}</Select.Option>
      </Select>
    )
    return (
      <Card title={<div className="pl15 pr15 ">{intl.get('setting_ttl.title')}</div>} className="rs" ref="root">
        <div className="zb-b-t">
            <Tabs defaultActiveKey={'easy'} onChange={timeToLivePatternChanged} tabBarStyle={{marginBottom:"0px"}}>
              <Tabs.TabPane tab={intl.get('setting_ttl.tabs_basic')} key="easy">
                <div className="">
                  <Form.Item className="ttl mb0" colon={false} label={null}>
                    {form.getFieldDecorator('timeToLivePopularSetting')(
                      <Radio.Group className="w-100" onChange={timeToLiveValueChange.bind(this, 'popular')}>
                        <Radio className="p10 d-flex w-100 zb-b-b align-items-center" value="1hour">1 {intl.get('common.hour')}</Radio>
                        <Radio className="p10 d-flex w-100 zb-b-b align-items-center" value="1day">1 {intl.get('common.day')}</Radio>
                        <Radio className="p10 d-flex w-100 zb-b-b align-items-center" value="1week">1 {intl.get('common.week')}</Radio>
                        <Radio className="p10 d-flex w-100 zb-b-b align-items-center" value="1month">1 {intl.get('common.month')}</Radio>
                        <Radio className="p10 d-flex w-100 zb-b-b align-items-center" value="more">
                          <div>
                            {intl.get('setting_ttl.more')}
                            {!ttlModel.timeToLivePopularSetting&&
                            <Form.Item className="mb0 mt5 d-block ttl" colon={false} label={null}>
                              {form.getFieldDecorator('timeToLive', {
                                rules: [{
                                  message: intl.get('common.invalid_integer'),
                                  // validator: (rule, value, cb) => orderFormatter.validateOptionInteger(value) ? cb() : cb(true)
                                }]
                              })(
                                <Input className="d-block w-100" placeholder={intl.get('setting_ttl.input_place_holder')} size="large" addonAfter={timeToLiveSelectAfter}
                                       onChange={timeToLiveValueChange.bind(this, 'moreValue')}/>
                              )}
                              </Form.Item>}
                          </div>
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={intl.get('setting_ttl.tabs_advanced')} key="advance">
                <Form.Item className="m15 mb30 ttl" colon={false} label={null}>
                  {form.getFieldDecorator('timeToLiveTimeSelector', {
                    initialValue:[moment(), moment().add(1, 'days')]
                  })(
                    <DatePicker.RangePicker
                      className="d-block w-100"
                      locale={'en-US'}
                      getCalendarContainer={trigger =>{
                        return ReactDOM.findDOMNode(this.refs.root);
                      }}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['Start Time', 'End Time']}
                      onChange={timeToLiveTimeSelected}
                    />
                  )}
                </Form.Item>
              </Tabs.TabPane>
            </Tabs>
        </div>
      </Card>
    );
  }
}
export default Form.create()(connect()(TTLForm));


