import React from 'react';
import { Input,Button, } from 'antd';
function AirdropList(props) {
  return (
    <div>
	    <div>
	        <div>AirdropList</div>
		    <div className="listgroup">
			    <div className="item">
				    	<div>
					    	<i className="icon-LRC"></i>
					    	<div>
					    	<h4>LRN</h4>
					    	<p>No bound address found</p>	
					    	</div>
				    	</div>
				    <div><span class="text-primary"></span><i className="icon-chevron-right"></i></div>
			    </div>
			    <div className="item">
				    	<div>
					    	<i className="icon-LRC"></i>
					    	<div>
					    	<h4>LRN</h4>
					    	<p>No bound address found</p>	
					    	</div>
				    	</div>
				    <div><span class="text-primary"></span>bind <i className="icon-chevron-right"></i></div>
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
