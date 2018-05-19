import React from 'react'
import {Tabs} from 'antd'
import {Link} from 'dva/router'
import CoinIcon from 'LoopringUI/components/CoinIcon'
import {toNumber,toBig} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';
import {renders} from './ListMyOrders';
import {OrderFm} from 'modules/orders/OrderFm';

const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <li>
      <span>
        {label}
      </span>
      <div className="text-lg-control break-word text-right">
        {render ? render(value) : value}
      </div>
    </li>
  )
}
function Detail(props) {
  const order = {}
  const orderFm = new OrderFm(order)
   return (
    <div>
        <div className="modal-header text-dark"><h3>订单详情</h3></div>
        <Tabs defaultActiveKey="1" className="tabs-dark">
	        <Tabs.TabPane tab="基础详情" key="1" className="text-color-dark">
	            <div className="pd-md text-center">
	    	        <span><i className="icon-ETH icon-token-md"></i><b>WEH</b></span>
	    	        <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"></i></span>
	    	        <span className="offset-lg"><b>WETH </b><i className="icon-WETH icon-token-md"></i></span>
	            </div>
	            <div className="divider-dark solid"></div>
	            <ul className="list list-label list-dark list-justify-space-between divided">
                  <MetaItem label={intl.get('orders.hash')} value={orderFm.getOrderHash()}/>
                  <MetaItem label={intl.get('orders.status')} value={renders.status(order)}/>
                  <MetaItem label={intl.get('orders.price')} value={orderFm.getPrice()}/>
                  <MetaItem label={intl.get('orders.amount')} value={orderFm.getAmount()}/>
                  <MetaItem label={intl.get('orders.total')} value={orderFm.getTotal()}/>
                  <MetaItem label={intl.get('orders.LRCFee')} value={orderFm.getLRCFee()}/>
                  <MetaItem label={intl.get('orders.marginSpilt')} value={orderFm.getMarginSpilt()}/>
                  <MetaItem label={intl.get('orders.filled')} value={orderFm.getFilledPercent()}/>
                  <MetaItem label={intl.get('orders.validSince')} value={orderFm.getCreateTime()}/>
                  <MetaItem label={intl.get('orders.validUntil')} value={orderFm.getExpiredTime()}/>
	            </ul>
	        </Tabs.TabPane>
	        <Tabs.TabPane tab="撮合详情" key="2">
	        		<table style={{overflow:'auto'}} className="table table-dark table-striped text-left">
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
	        </Tabs.TabPane>
        </Tabs>
    </div>
  )
}
export default Detail





function DetailBlock({modal = {}}) {
  const item = modal.item;
  const tokenS = item.originalOrder.tokenS;
  const tokenB = item.originalOrder.tokenB;
  const amountB = item.originalOrder.amountB;
  const amountS = item.originalOrder.amountS;
  const amountLrc = item.originalOrder.lrcFee;
  const fm = window.uiFormatter.TokenFormatter;
  const fmLrc = new fm({symbol: 'LRC'});
  const fmS = new fm({symbol:tokenS});
  const fmB = new fm({symbol:tokenB});
  const tokensConfig = window.CONFIG.getTokenBySymbol(tokenS);
  const tokenbConfig = window.CONFIG.getTokenBySymbol(tokenB);
  const market = window.CONFIG.getMarketBySymbol(tokenS,tokenB);

  const getPrice = () => {

    if (item.originalOrder.side.toLowerCase() === 'buy') {
      return (<div>
        <span className="mr5">{window.uiFormatter.getFormatNum(toBig(amountS).div('1e'+tokensConfig.digits).div(toBig(amountB).div('1e'+tokenbConfig.digits)).toFixed(market.pricePrecision))} </span>
        {tokenS}/{tokenB}
      </div>)
    } else {
      return (<div>
        <span className="mr5">{window.uiFormatter.getFormatNum(toBig(amountB).div('1e'+tokenbConfig.digits).div(toBig(amountS).div('1e'+tokensConfig.digits)).toFixed(market.pricePrecision))} </span>
        {tokenB}/{tokenS}
      </div>)
    }

  };

  const getFilledPercent = () => {
    let percent = 0;
    if (item.originalOrder.side.toLowerCase() === 'sell') {
      percent = (item.dealtAmountS / item.originalOrder.amountS * 100).toFixed(1)
    } else {
      percent = (item.dealtAmountB / item.originalOrder.amountB * 100).toFixed(1)
    }
    return percent.toString().concat('%')
  };

  return (
    <div>
      <div className="row flex-nowrap zb-b-b pb40 justify-content-center align-items-center">
        <div className="col-auto">
          <div className="text-center position-relative">
            <CoinIcon size="50" symbol={tokenS}/>
            <div  className="fs12 color-grey-900 text-wrap position-absolute mx-auto" style={{left:'0',right:'0'}}>
              {tokenS}
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="text-center ">
            <i className="icon-loopring icon-loopring-arrow-right color-black-1 "></i>
          </div>
        </div>
        <div className="col-auto">
          <div className="text-center position-relative">
            <CoinIcon size="50" symbol={tokenB}/>
            <div className="fs12 color-grey-900 text-wrap position-absolute mx-auto" style={{left:'0',right:'0'}}>
              {tokenB}
            </div>
          </div>
        </div>
      </div>
      <MetaItem label={intl.get('orders.order')} value={item.originalOrder.hash}/>
      <MetaItem label={intl.get('orders.status')} value={renders.status(null, item)}/>
      <MetaItem label={intl.get('orders.sell_amount')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmS.getAmount(amountS))}</span>
          {tokenS}
        </div>
      }/>
      <MetaItem label={intl.get('orders.buy_amount')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmB.getAmount(amountB))}</span>
          {tokenB}
        </div>
      }/>
      <MetaItem label={intl.get('orders.price')} value={
        getPrice()
      }/>
      <MetaItem label={intl.get('orders.LrcFee')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatNum(fmLrc.getAmount(amountLrc))}</span>
          {'LRC'}
        </div>
      }/>
      <MetaItem label={intl.get('order.margin')} value={
        <div>
          <span className="mr5">{toNumber(item.originalOrder.marginSplitPercentage)}%</span>
        </div>
      }/>
      <MetaItem label={intl.get('orders.filled')} value={
        <div>
          <span className="mr5">{getFilledPercent()}</span>
        </div>
      }/>
      <MetaItem label={intl.get('order.since')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatTime(toNumber(item.originalOrder.validSince)*1e3)}</span>
        </div>
      }/>
      <MetaItem label={intl.get('order.till')} value={
        <div>
          <span className="mr5">{window.uiFormatter.getFormatTime(toNumber(item.originalOrder.validUntil)*1e3)}</span>
        </div>
      }/>
    </div>
  );
}


