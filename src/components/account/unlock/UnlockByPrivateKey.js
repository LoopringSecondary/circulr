import React from 'react';
import { Input,Button } from 'antd';
function PrivateKey(props) {
  return (
    <div>
        <div className="tab-pane text-inverse active" id="privateKey">
            <h2 className="text-center text-primary">Paste Your PrivateKey Here</h2>
            <div className="form-group form-group-lg iconic-input iconic-input-lg right">
                <Input.TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
            </div>
            <Button type="primary" className="btn-block btn-xlg btn-token">Unlock</Button>
        </div>
    </div>
  )
}
export default PrivateKey