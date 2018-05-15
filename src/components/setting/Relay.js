import React from 'react';
import { Input,Button,Form,Radio,Select,Col} from 'antd';

function Relay(props) {
	const InputGroup = Input.Group;
	const Option = Select.Option;
  return (
  	<div className="form-dark">
        <span>Choose Relay</span>
        <Radio.Group className="d-block">
	        <Radio value={1}  className="d-flex align-items-center">
			    <Input.Group size="large" className="d-flex justify-content-between" style={{width:"100%"}}>
			        <Col span={12}>
			          <Input defaultValue="Default Loopring Relay" disabled />
			        </Col>
			        <Col span={12}>
			          <Input defaultValue="//relay1.loopring.io" disabled />
			        </Col>					
		        </Input.Group>
	        </Radio>
	        <div className="blk"></div>
	        <Radio value={2}  className="d-flex align-items-center">
			    <Input.Group size="large" className="d-flex justify-content-between" style={{width:"100%"}}>
	    	        <Col span={12}>
	    	          <Input defaultValue="Pre-Production Relay" disabled />
	    	        </Col>
	    	        <Col span={12}>
	    	          <Input defaultValue="//pre-relay1.loopring.io" disabled />
	    	        </Col>					
	            </Input.Group>
	        </Radio>
	        <div className="blk"></div>
	        <Radio value={3}  className="d-flex align-items-center">
			    <Input.Group size="large" className="d-flex justify-content-between" style={{width:"100%"}}>
        	        <Col span={12}>
        	          <Input defaultValue="Test" disabled />
        	        </Col>
        	        <Col span={12}>
        	          <Input defaultValue="//13.112.62.24" disabled />
	        	        </Col>					
	            </Input.Group>
	        </Radio>
        </Radio.Group>
        <div className="blk"></div>
        <Button className="btn-o-dark btn-block btn-xlg">Add Custom Relay</Button>
        <div className="form-inverse">
			<Form.Item label="Relay Name">
	                <Input value="" />
			</Form.Item>
			<Form.Item label="Relay URL">
	                <Input value="" />
			</Form.Item>
	        <div className="blk"></div>
        </div>
		<Button className="btn-o-dark btn-block btn-xlg">Save</Button>
  	</div>
  )
}
export default Relay