import React from 'react';
import { Input,Button,Form } from 'antd';
function AirdropList(props) {
  return (
    <div>
	    <div>
	        <div>AirdropList</div>
		    <div className="listgroup prefix">
			    <div className="item">
				    	<div>
					    	<i class="icon-ETH icon-token"></i>
					    	<div>
						    	<h3>LRN</h3>
						    	<p>No bound address found</p>	
					    	</div>
				    	</div>
				    <div><span class="text-primary">bind</span><i className="icon-chevron-right"></i></div>
			    </div>
			    <div className="item">
				    	<div>
					    	<i class="icon-ETH icon-token"></i>
						    	<div>
						    	<h3>LRN</h3>
						    	<p>No bound address found</p>	
					    	</div>
				    	</div>
				    <div><span class="text-primary">bind</span><i className="icon-chevron-right"></i></div>
			    </div>
		    </div>
	    </div>
        <div>
            <div>Airdrop Binding</div>
            <Form.Item label="ETH Address">
            	<Input defaultValue="0x750ad4351bb728cec7d639a9511f9d6488f1e259" disabled />
            </Form.Item>
            <Form.Item label="NEO Address">
                <Input defaultValue="" placehold="NEO address" suffix={<i className="icon-info"></i>} />
            </Form.Item>
            <div class="warning"><i class="icon-info"></i>Binding address takes one Ethereum transaction.</div>
            <Button type="primary" className="btn-block">Bind</Button>
            <Button type="primary" className="btn-secondary btn-block">Back</Button>
	    </div>
    </div>
  )
}
export default AirdropList
