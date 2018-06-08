import React from 'react';
import {Button, Modal, Steps} from 'antd';
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';

function UnlockByLoopr(props) {
  return (
    <div className="text-center">
      <div style={{width:"320px"}} className="m-auto bg-white text-center p10">
        <img style={{width:"300px"}}src="http://sta.36krcnd.com/common-module/common-header/images/2017/QR_36k@2x-c4e8e.png" />
      </div>
      <div style={{width:"320px"}} className="pt15 pb15 text-left m-auto" >
        1. 下载 Loopr IOS 版
        <br />
        2. xxx
      </div>
    </div>
  )
}
export default connect()(UnlockByLoopr)
