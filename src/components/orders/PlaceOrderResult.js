import React from 'react';
import {Button, Icon, Alert} from 'antd'
// import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions';
import {getSocketAuthorizationByHash} from 'modules/orders/formatters'

const PlaceOrderResult = (props) => {
  const {placeOrder, placeOrderByLedger, placeOrderByMetaMask, placeOrderByLoopr, circulrNotify, dispatch} = props
  let orderState = 0
  switch(placeOrder.payWith) {
    case 'ledger':
      orderState = placeOrderByLedger.orderState
      break;
    case 'metaMask':
      orderState = placeOrderByMetaMask.orderState
      break;
    case 'loopr':
      const hashItem = getSocketAuthorizationByHash(placeOrderByLoopr.hash, circulrNotify)
      if(hashItem) {
        switch (hashItem.status) { //init received accept reject
          case 'accept':
            orderState = 1
            break;
          case 'reject':
            orderState = 2
            break;
          case 'txFailed':
            orderState = 2
            break;
        }
      }
      break;
  }
  const gotToTrade = () => {
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderSteps'}})
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderByLoopr'}})
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderByMetamask'}})
    dispatch({type:'layers/hideLayer', payload:{id:'placeOrderByLedger'}})
    routeActions.gotoPath('/trade');
  }
  return (
    <div className="zb-b">
        {
          orderState === 1 &&
          <div className="text-center p35">
            <i className={`fs50 icon-success`}></i>
            <div className="fs18 color-black-1">{intl.get('place_order_result.submit_success')}</div>
            <div className="mt10">
              <Button className="m5" type="default"> {intl.get('place_order_result.view_order')} </Button>
              <Button className="m5" type="default" onClick={gotToTrade}> {intl.get('place_order_result.continue_place_order')} </Button>
            </div>
          </div>
        }
        {
          orderState === 2 &&
          <div className="text-center p35">
            <Icon type="close-circle" className="fs50 text-error" />
            <div className="fs18 color-black-1 mt15 mb10">{intl.get('place_order_result.submit_failed')}</div>
            {placeOrder.resultMsg && <Alert message={placeOrder.resultMsg} size="small" type="error" theme="light" icon={false}/>}
            <div className="mt10">
              <Button className="m5" type="default" onClick={gotToTrade}> {intl.get('place_order_result.back_to_trade')} </Button>
            </div>
          </div>
        }
    </div>
  );
};

function mapToProps(state) {
  return {
    wallet:state.wallet,
    placeOrder:state.placeOrder,
    placeOrderByMetaMask:state.placeOrderByMetaMask,
    placeOrderByLoopr:state.placeOrderByLoopr,
    placeOrderByLedger:state.placeOrderByLedger,
    circulrNotify:state.sockets.circulrNotify
  }
}

export default connect(mapToProps) (PlaceOrderResult);



