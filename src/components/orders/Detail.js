import React from 'react';
import { Tabs } from 'antd';

function Detail(props) {
  const TabPane = Tabs.TabPane;
  function callback(key) {
    console.log(key);
  }
   return (
    <div>
        <Tabs defaultActiveKey="1" onChange={callback}>
	        <TabPane tab="基础详情" key="1">
	            <div className="text-center">
	    	        <span><i className="icon-ETH icon-token"></i><small>WEH</small></span>
	    	        <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"></i></span>
	    	        <span><small>WETH</small><i className="icon-WETH icon-token"></i></span>
	            </div>
	            <div className="divider solid"></div>
	            <ul className="list list-label hover list-justify-flex-start divided">
	                <li><span>Order Hash</span>
	                    <div className="text-lg-control break-word">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
	                </li>
	                <li><span>Status</span><span className="text-success"><i className="icon-success"></i></span></li>
	                <li><span>Sell Amount</span><span>300LRC</span></li>
	                <li><span>Buy Amount</span><span>0.25999WETH</span></li>
	                <li><span>Price</span><span>0.00086663 WETH/LRC</span></li>
	                <li><span>LRC Fee</span><span>0.58LRC</span></li>
	                <li><span>Margin Split</span><span>50%</span></li>
	                <li><span>Filled</span><span>100.0%</span></li>
	                <li><span>Valid Since</span><span>March 27, 2018 5:51 PM</span></li>
	                <li><span>Valid Until</span><span>April 26, 2018 5:51 PM</span></li>
	            </ul>
	        </TabPane>
	        <TabPane tab="撮合详情" key="2">
	        		<table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2">
	        		  <thead>
	        		      <tr>
	        		          <th>环路</th>
	        		          <th>数量</th>
	        		          <th>价格</th>
	        		          <th>金额</th>
	        		          <th>LRC撮合费</th>
	        		          <th>LRC撮合奖励</th>
	        		          <th>时间</th>
	        		      </tr>
	        		  </thead>
	        		  <tbody>
	        		      <tr>
	        		          <td>253</td>
	        		          <td>80 LRC</td>
	        		          <td>0.00135</td>
	        		          <td>0.108 WETH</td>
	        		          <td>0 LRC</td>
	        		          <td>0 LRC</td>
	        		          <td>2018年5月4日 00:17</td>
	        		      </tr>
	        		  </tbody>
	        		</table>
	        </TabPane>
        </Tabs>
    </div>
  )
}
export default Detail
