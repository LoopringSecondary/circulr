import React from 'react';

function Detail(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>订单详情</h3></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>交易Hash</span>
                <div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
            </li>
            <li><span>接收地址</span>
                <div className="text-lg-control break-word text-right">0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00</div>
            </li>
            <li><span>块高度</span><span>5550001</span></li>
            <li><span>状态</span><span>成功</span></li>
            <li><span>确认时间</span><span>2018年5月4日 00:17</span></li>
            <li><span>类型</span><span>接收 LRC</span></li>
            <li><span>油费</span><span className="text-right">0.005 ETH<br /><small className="text-color-dark-2">Gas(500000) * Gas Price(10 Gwei)</small></span></li>
            <li><span>随机数</span><span>866</span></li>
            <li><span>金额</span><span>0 ETH</span></li>
        </ul>
    </div>
  )
}
export default Detail
