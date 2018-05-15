import React from 'react';
import { Input,Button,Form,Radio,Select,Col} from 'antd';

function Relay(props) {
  const {form, settings} = props
	const InputGroup = Input.Group;
	const Option = Select.Option;
	const {relay} = settings
  const relayConfig = relay.nodes.find(item=>item.value === relay.selected) || {}
  // const gotoEdit = (relayId, e)=>{
  //   e.preventDefault();
  //   modal.showModal({id:'settings/relay/edit', relayId:relayId})
  // }
  // const gotoAdd = ()=>{
  //   modal.showModal({id:'settings/relay/add'})
  // }
  function handleChange(e) {
    settings.relayChange({selected:e.target.value})
  }
  return (
  	<div className="form-dark">
        <span>Choose Relay</span>
        <Radio.Group className="d-block" onChange={handleChange} value={relayConfig.value}>
          {
            relay.nodes.map((item,index)=>
              <div>
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
export default Form.create()(Relay);
