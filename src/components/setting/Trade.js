import React from 'react';
import { Input,Button,Form,Select } from 'antd';
function Trade(props) {
  const Option = Select.Option;
  return (
    <div>
        <Form.Item label="Order Time-To-Live">
        	<Input.Group compact  className="d-flex">
	        	<Input style={{ width: '100%' }} defaultValue="" />
	        	<Select defaultValue="Second" dropdownMatchSelectWidth={false}>
		        	<Option value="Second">Second</Option>
		        	<Option value="Minute">Minute</Option>
		        	<Option value="Hour">Hour</Option>
		        	<Option value="Day">Day</Option>
	        	</Select>
        	</Input.Group>
        </Form.Item>
        <Form.Item label="Trading Fee (LRC)">
       		<Input defaultValue="2" suffix="‰" />
        </Form.Item>
        <Form.Item label="Default Margin Split">
            <Input defaultValue="50%" suffix="%" />
        </Form.Item>
		<Button type="primary" className="btn-block btn-xlg">Reset</Button>
    </div>
  )
}
export default Trade
