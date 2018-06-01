import React from 'react';
import { Input,Button,Form,Select} from 'antd';
import {locales, timezoneArray} from 'common/config/data'
import intl from 'react-intl-universal';

function Preference(props) {
  const {form, settings} = props

  const localesOptions = locales.map(locale => <Select.Option value={locale.value} key={locale.value}>  <div className="d-flex justify-content-between">
    <div>{locale.name}</div>
    <div>{false && locale.logo}</div>
  </div></Select.Option>)

  const handleChange = (type, value) => {
    if(type === 'language'){
      props.dispatch({
        type:'locales/setLocale',
        payload:{
          locale:value
        }
      });
    }
    settings.preferenceChange({[type]: value})
  };

  const handleReset = () => {
    form.setFieldsValue({language:'en-US', currency:'USD', timezone:'UTC+00:00'})
    handleChange('language', 'en-US')
    handleChange('currency', 'USD')
    handleChange('timezone', 'UTC+00:00')
  }

  return (
  	<div className="form-dark">
        <Form.Item label={intl.get('settings.language')} colon={false}>
          {form.getFieldDecorator('language', {
            initialValue:settings.preference.language,
            rules:[]
          })(
            <Select
              dropdownMatchSelectWidth={false}
              className="d-block"
              placeholder={intl.get('settings.select_placeholder')}
              size="large"
              onChange={handleChange.bind(this, "language")}
            >
              {localesOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item  label={intl.get('settings.currency')} colon={false}>
          {form.getFieldDecorator('currency', {
            initialValue:settings.preference.currency,
            rules:[]
          })(
            <Select
              dropdownMatchSelectWidth={false}
              className="d-block"
              placeholder={intl.get('settings.select_placeholder')}
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "currency")}
            >
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="CNY">CNY</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get('settings.timezone')} colon={false}>
          {form.getFieldDecorator('timezone', {
            initialValue:settings.preference.timezone,
            rules:[]
          })(
            <Select
              dropdownMatchSelectWidth={false}
              className="d-block"
              placeholder={intl.get('settings.select_placeholder')}
              optionFilterProp="children"
              size="large"
              onChange={handleChange.bind(this, "timezone")}
            >
              {timezoneArray && timezoneArray.map((item, index)=>
                <Select.Option key={index} value={item.timezone} title={"("+item.timezone+") "+item.principal}>({item.timezone}) {item.principal}</Select.Option>
              )}
            </Select>
          )}
        </Form.Item>
        <div className="blk"></div>
        <Button className="btn btn-o-dark btn-block btn-xlg" onClick={handleReset}>{intl.get('actions.reset')}</Button>
    </div>
  )
}
export default Form.create()(Preference);
