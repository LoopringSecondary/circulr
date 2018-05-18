import React from 'react';
import { Input,Button } from 'antd';
import {toBig, toHex} from 'LoopringJS/common/formatter'
import config from 'common/config'
import intl from 'react-intl-universal';
//import {create} from 'LoopringJS/ethereum/account';

function PlaceOrderConfirm(props) {
  const {placeOrderConfirm, settings, wallet} = props
  const {side, pair, verifiedAddress} = placeOrderConfirm
  let {amount, total, validSince, validUntil, marginSplit, lrcFee} = placeOrderConfirm.tradeInfo;
  const token = pair.split('-')[0];
  const token2 = pair.split('-')[1];
  marginSplit = marginSplit === undefined ? settings.trading.marginSplit : marginSplit;
  let order = {};
  order.delegateAddress = config.getDelegateAddress();
  order.protocol = settings.trading.contract.address;
  //TODO mock address
  order.owner = wallet.address || '0x23bD9CAfe75610C3185b85BC59f760f400bd89b5';
  const tokenB = side.toLowerCase() === "buy" ? config.getTokenBySymbol(token) : config.getTokenBySymbol(token2);
  const tokenS = side.toLowerCase() === "sell" ? config.getTokenBySymbol(token) : config.getTokenBySymbol(token2);
  order.tokenB = tokenB.address;
  order.tokenS = tokenS.address;
  order.amountB = toHex(toBig(side.toLowerCase() === "buy" ? amount : total).times('1e' + tokenB.digits));
  order.amountS = toHex(toBig(side.toLowerCase() === "sell" ? amount : total).times('1e' + tokenS.digits));
  order.lrcFee = toHex(toBig(lrcFee).times(1e18));
  order.validSince = toHex(validSince);
  order.validUntil = toHex(validUntil);
  order.marginSplitPercentage = Number(marginSplit);
  order.buyNoMoreThanAmountB = side.toLowerCase() === "buy";
  order.walletAddress = config.getWalletAddress();
  const authAccount = {}
  //TODO create('');
  order.authAddr = authAccount.address;
  order.authPrivateKey = authAccount.privateKey;

  return (
    <div>
        <div className="modal-header text-dark"><h3>{intl.get(`order.${side}`)} {token}</h3></div>
        <div className="pd-lg text-center text-color-dark">
	        <h5>您正在{intl.get(`order.${side === 'sell' ? 'selling' : 'buying'}`)}</h5>
	        <h2>{intl.get('global.amount', {amount})} {token}</h2>
	        <small className="text-color-dark-1">0.0015 × 100 =0.15WETH</small>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>0.5LRC</span></li>
            <li><span>分润比例</span><span>{`${marginSplit} %`}</span></li>
            <li><span>订单生效时间</span><span>2018年5月14日 16:28</span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
            <li className="d-block">
                <b><i className="icon-chevron-up"></i>签名信息</b>
                <div className="blk"></div>
                <div className="col-row form-dark">
                    <div className="col2-2 d-flex justify-space-between">
                    	<div className="item">
                    	    <p className="text-color-dark-2">未签名的订单</p>
                    		<Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} value={JSON.stringify(order)}/>
                    	</div>
                    	<div className="item">
                    	    <p className="text-color-dark-2">签名的订单</p>
                    		<Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} />
                    	</div>
                    </div>
                    <div className="blk"></div>
                    <div className="text-center text-color-dark-3">提交订单是免费的，不需要消耗Gas</div>
                </div>
            </li>
        </ul>
        <Button className="btn-block btn-o-dark btn-xlg">提交订单</Button>
    </div>
  )
}
export default PlaceOrderConfirm
