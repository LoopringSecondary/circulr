import React from 'react';

function Detail(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>撮合环路信息</h3></div>
    	<ul className="list list-label list-dark list-justify-space-between divided">
    	    <li><span>环路</span><span>253</span></li>
    	    <li>
                <span>环路哈希</span>
    	        <div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
    	    </li>
    	    <li>
                <span>矿工</span>
    	        <div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div>
    	    </li>
    	    <li><span>交易Hash</span><div className="text-lg-control break-word text-right">0x46b9ab33d6904718fc2d16ad1a133a35ae23045</div></li>
    	    <li><span>块高度</span><span>5,550,001</span></li>
    	    <li><span>费用接收地址</span><div className="text-lg-control break-word text-right">0x3ACDF3e3D8eC52a768083f718e763727b02106</div></li>
    	    <li><span>总共的LRC费用</span><span>0.165617 LRC</span></li>
    	    <li><span>总分的分润费用</span><span>0.36 LRC</span></li>
    	    <li><span>时间</span><span>2018年5月4日 00:17</span></li>
    	    <li><span>环路中订单个数</span><span>2</span></li>
    	</ul>
    </div>
  )
}
export default Detail
