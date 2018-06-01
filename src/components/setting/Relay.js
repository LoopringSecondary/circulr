import React from 'react';
import { Input,Button,Form,Radio,Select,Col} from 'antd';
import intl from 'react-intl-universal';

function Relay(props) {
  const {form, settings} = props
	const InputGroup = Input.Group;
	const Option = Select.Option;
	const {relay} = settings
  const relayConfig = relay.nodes.find(item=>item.value === relay.selected) || {}

  function handleChange(e) {
    settings.relayChange({selected:e.target.value})
  }

  return (
  	<div className="form-dark">
      <span>{intl.get('settings.choose_relay')}</span>
      <Radio.Group className="d-block" onChange={handleChange} value={relayConfig.value}>
        {
          relay.nodes.map((item,index)=>
            <div key={index}>
              <Radio className="d-flex align-items-center" value={item.value} key={index}>
                <Input.Group size="large" className="d-flex justify-content-between" style={{width:"100%"}}>
                  <Col span={12}>
                    <Input value={item.name} disabled />
                  </Col>
                  <Col span={12}>
                    <Input value={item.value} disabled />
                  </Col>
                </Input.Group>
              </Radio>
              <div className="blk"></div>
            </div>
          )
        }
      </Radio.Group>
      <div className="blk"></div>
  	</div>
  )
}
export default Form.create()(Relay);
