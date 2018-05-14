import React from 'react';
import { Input,Button,Select } from 'antd';
function Trezor(props) {
  return (
    <div>
		<div class="card bg-white">
		    <div class="card-body notice">
		        <div><i class="icon-warning"></i></div>
		        <div>
		            <p>Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS</p>
		        </div>
		    </div>
		</div>
    </div>
  )
}
export default Trezor