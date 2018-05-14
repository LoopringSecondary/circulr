import React from 'react';
import { Input,Button,Select } from 'antd';
function Mnemonic(props) {
  return (
    <div>
        <div className="tab-pane text-inverse active" id="mnemonic">
            <h2 className="text-center text-primary">Paste Your Mnemonic Here</h2>
            <div className="form-group form-group-lg">
                <Select defaultValue="Select Your Wallet Type" dropdownMatchSelectWidth={false} >
                    <option value="Select Your Wallet Type">Select Your Wallet Type</option>
                    <option value="Loopring wallet">Loopring Wallet</option>
                    <option value="Imtoken">Imtoken</option>
                    <option value="MeteMask">MeteMask</option>
                    <option value="TREZOR(ETH)">TREZOR(ETH)</option>
                    <option value="Digtial Bitbox">Digtial Bitbox</option>
                    <option value="Exodus">Exodus</option>
                    <option value="Jaxx">Jaxx</option>
                    <option value="ledger(ETH)">ledger(ETH)</option>
                </Select>
            </div>
            <div className="form-group form-group-lg">
                <Input.TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} />
            </div>
            <div className="form-group form-group-lg">
                <Input value="" />
            </div>
            <Button type="primary" className="btn-block btn-xlg btn-token">Unlock</Button>
        </div>
    </div>
  )
}
export default Mnemonic