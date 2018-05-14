import React from 'react';

function Detail(props) {
  return (
    <div>
        <ul className="list list-label hover list-justify-flex-start divided">
            <li><span>交易Hash</span>
                <div className="text-lg-control break-word">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div>
            </li>
            <li><span>接收地址</span>
                <div className="text-lg-control break-word">0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00</div>
            </li>
            <li><span>块高度</span><span>5550001</span></li>
            <li><span>状态</span><span>成功</span></li>
            <li><span>确认时间</span><span>2018年5月4日 00:17</span></li>
            <li><span>类型</span><span>接收 LRC</span></li>
            <li><span>油费</span><span>0.005 ETH<p>Gas(500000) * Gas Price(10 Gwei)</p></span></li>
            <li><span>随机数</span><span>866</span></li>
            <li><span>金额</span><span>0 ETH</span></li>
        </ul>
    </div>
  )
}
export default Detail
