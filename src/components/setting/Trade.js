import React from 'react';
import { Input,Button,Form,Select,Slider } from 'antd';
function Trade(props) {
  const Option = Select.Option;
  return (
    <div className="form-dark">
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
        <Form.Item label="Trading Fee (LRC)" className="prefix">
       	    <Input defaultValue="2" suffix="‰" />
        </Form.Item>
        <Form.Item label="Default Margin Split" className="prefix">
            <Input defaultValue="50%" suffix="%" />
        </Form.Item>
        <div className="blk"></div>
        <b>Default Gas Price: 21 Gwei</b>
        <div className="range-inverse">
           <Slider marks={{ 0: 'Slower', 100: 'Faster' }} defaultValue={37} />
        </div>
		    <Button className="btn-o-dark btn-block btn-xlg">Reset</Button>
  </div>
  )
}
export default Trade
