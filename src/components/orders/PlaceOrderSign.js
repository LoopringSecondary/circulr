import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Collapse} from 'antd'
import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'

const PlaceOrderSign = (props) => {
  const {placeOrder, wallet, dispatch} = props
  // const {signed,unsigned} = placeOrder
  const unsigned = [{"type":"order","data":{"owner":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5","delegateAddress":"0x17233e07c67d086464fD408148c3ABB56245FA64","protocol":"0x8d8812b72d1e4ffCeC158D25f56748b7d67c1e78","tokenB":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","tokenS":"0xEF68e7C694F40c8202821eDF525dE3782458639f","amountB":"0x10a741a462780000","amountS":"0xa688906bd8b00000","lrcFee":"0x12751bf40f450000","validSince":"0x5b176f81","validUntil":"0x5b18c101","marginSplitPercentage":50,"buyNoMoreThanAmountB":false,"walletAddress":"0xb94065482ad64d4c2b9252358d746b39e820a582","orderType":"market_order","authAddr":"0x084f0ff385b78d33105d8f8bc8abfb17cd7b9943","authPrivateKey":"48451ed89ce6834fb4e6c47112740b51ceab15423aa746de4c282110bc65f6a0"},"completeOrder":{"owner":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5","delegateAddress":"0x17233e07c67d086464fD408148c3ABB56245FA64","protocol":"0x8d8812b72d1e4ffCeC158D25f56748b7d67c1e78","tokenB":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","tokenS":"0xEF68e7C694F40c8202821eDF525dE3782458639f","amountB":"0x10a741a462780000","amountS":"0xa688906bd8b00000","lrcFee":"0x12751bf40f450000","validSince":"0x5b176f81","validUntil":"0x5b18c101","marginSplitPercentage":50,"buyNoMoreThanAmountB":false,"walletAddress":"0xb94065482ad64d4c2b9252358d746b39e820a582","orderType":"market_order","authAddr":"0x084f0ff385b78d33105d8f8bc8abfb17cd7b9943","authPrivateKey":"48451ed89ce6834fb4e6c47112740b51ceab15423aa746de4c282110bc65f6a0"},"description":"Sign Order","address":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5"},{"type":"tx","data":{"to":"0xEF68e7C694F40c8202821eDF525dE3782458639f","value":"0x0","data":"0x095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000000000000000000000000000000000000","gasPrice":"0x2540be400","gasLimit":"0x30d40","nonce":"0x21","chainId":1},"description":"Cancel LRC allowance","address":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5"},{"type":"tx","data":{"to":"0xEF68e7C694F40c8202821eDF525dE3782458639f","value":"0x0","data":"0x095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000006f05b59d3b1ffffe43e9298b1380000","gasPrice":"0x2540be400","gasLimit":"0x30d40","nonce":"0x22","chainId":1},"description":"Approve LRC allowance","address":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5"},{"type":"tx","data":{"to":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","value":"0x0","data":"0x095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000000000000000000000000000000000000","gasPrice":"0x2540be400","gasLimit":"0x30d40","nonce":"0x23","chainId":1},"description":"Cancel WETH allowance","address":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5"},{"type":"tx","data":{"to":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","value":"0x0","data":"0x095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000006f05b59d3b1ffffe43e9298b1380000","gasPrice":"0x2540be400","gasLimit":"0x30d40","nonce":"0x24","chainId":1},"description":"Approve WETH allowance","address":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5"}]
  // const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'
  // const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'
  const isUnlocked =  true
  const signed = [{"type":"order","data":{"owner":"0x23bD9CAfe75610C3185b85BC59f760f400bd89b5","delegateAddress":"0x17233e07c67d086464fD408148c3ABB56245FA64","protocol":"0x8d8812b72d1e4ffCeC158D25f56748b7d67c1e78","tokenB":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","tokenS":"0xEF68e7C694F40c8202821eDF525dE3782458639f","amountB":"0x10a741a462780000","amountS":"0xa688906bd8b00000","lrcFee":"0x12bc29d8eec70000","validSince":"0x5b17a5d6","validUntil":"0x5b18f756","marginSplitPercentage":50,"buyNoMoreThanAmountB":false,"walletAddress":"0xb94065482ad64d4c2b9252358d746b39e820a582","orderType":"market_order","authAddr":"0xc06894dddd0c0734f0b19eea4bca7820fe8007a4","authPrivateKey":"4dd0320e85a7c9929ee3e01c09f864762fb0a344fa09e1b2aed5a25ea78c9d07","v":28,"r":"0x764cfaf81b9287fee7647f5d8bc55975332c2b77deed1962005174b8f2433a5e","s":"0x14a4403a4481de6172d14cd6b50824dbc71a8e8c94b4e7a72777430bd0aaa598","powNonce":100}},{"type":"tx","data":"0xf8aa218502540be40083030d4094ef68e7c694f40c8202821edf525de3782458639f80b844095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa64000000000000000000000000000000000000000000000000000000000000000025a0c05ac772004a72bdf9bd9588c2532d3550da3dbd89b60d4950c15b6bf26b748da0068935b1f92827d1d39f7770184377d479b570853818c85f92824f53ef60eb97"},{"type":"tx","data":"0xf8aa228502540be40083030d4094ef68e7c694f40c8202821edf525de3782458639f80b844095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000006f05b59d3b1ffffe43e9298b138000026a046182bff801cf5cb377b8aaeb6eaf770184068d3ace893a9b727f984d0c68372a02cf8845b769ab895970c63bd73dbdd4ba711d9f863d5028802acd2eeaf6955e1"},{"type":"tx","data":"0xf8aa238502540be40083030d4094c02aaa39b223fe8d0a0e5c4f27ead9083c756cc280b844095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa64000000000000000000000000000000000000000000000000000000000000000025a003c9c47d2bac6aa786bae0ec258aeb3553ffc7001b97577c453f748d1df8ae61a01e46b5916f2f1e13a3ed8308a8a6e843c6130143bd403599e02920d30867fba7"},{"type":"tx","data":"0xf8aa248502540be40083030d4094c02aaa39b223fe8d0a0e5c4f27ead9083c756cc280b844095ea7b300000000000000000000000017233e07c67d086464fd408148c3abb56245fa640000000000000000000000000000000006f05b59d3b1ffffe43e9298b138000025a0f13b6218626c9f8d7ff9d0c5ca6c774b49535adf5c111bc3955922f7fc29e69aa0046c93597a80c942bec3f3740cb7eb2c18872f68b915cc4911a33effc8d4dfe1"}]

  async function sign(item, index, e) {
    e.preventDefault()
    const account = wallet.account || window.account
    if(!account || wallet.unlockType === 'address') {
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: 'to unlock'
      });
      return
    }
    try {
      console.log(item.address, wallet.address)
      if(item.address !== wallet.address) {
        Notification.open({
          message: intl.get('trade.place_order_failed'),
          type: "error",
          description: 'your address in original order is not the same as unlocked, please replace order'
        });
        return
      }
      if(item.type === 'order') {
        const signedOrder = await account.signOrder(item.data)
        signedOrder.powNonce = 100;
        signed[index] = {type: 'order', data:signedOrder};
      } else {
        signed[index] = {type: 'tx', data: await account.signEthereumTx(item.data)};
      }
      dispatch({type:'placeOrder/signedChange',payload:{signed}})
    } catch(e) {
      console.error(e)
      Notification.open({
        message: intl.get('trade.place_order_failed'),
        type: "error",
        description: e.message
      });
    }
  }

  const TxHeader = ({tx,index})=>{
    return (
      <div className="row pl0 pr0 align-items-center">
        <div className="col">
          <div className="fs14 color-black-2">
            <Button type="primary" shape="circle" size="small" className="mr10">{index+1}</Button>
            {tx.description}
          </div>
        </div>
        <div className="col-auto pr20">
          {signed[index] &&
            <div className="text-up">
               Signed <Icon className="ml5" type="check-circle"  />
            </div>
          }
          {!signed[index] &&
            <div className="color-black-3">
              <a onClick={sign.bind(this, tx, index)}>Sign<Icon className="ml5" type="right"  /></a>
            </div>
          }
        </div>
      </div>
    )
  }
  const TxContent = ({tx,index})=>{
    return (
      <div className="row p5 zb-b-t">
        <div className="col-6 pr5">
          <div className="fs12 color-black-2 mt5">Unsigned Tx</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={JSON.stringify(unsigned[index])}/>
        </div>
        <div className="col-6 pl5">
          <div className="fs12 color-black-2 mt5">Signed Tx</div>
          <Input.TextArea disabled placeholder="" className="fs12 lh20 border-none" autosize={{ minRows: 6, maxRows: 10 }} value={signed && signed[index] ? JSON.stringify(signed[index]) : ''}/>
        </div>
      </div>
    )
  }

  return (
    <div className="zb-b">
      { false && <Alert type="info" title={`您需要通过 ${wallet.unlockType} 完成下面 ${unsigned.length} 个交易的签名：`} theme="light" size="small" /> }
      <Collapse accordion bordered={false} defaultActiveKey={[]}>
        {
          isUnlocked && unsigned.map((item, index)=>{
            return (
              <Collapse.Panel  header={<TxHeader tx={item} index={index} />} key={index} showArrow={false}>
                <TxContent tx={item} index={index}/>
              </Collapse.Panel>
            )
          })
        }
      </Collapse>
      <div className="p10">
        <Button className="w-100 d-block" size="large" type="primary"> 发送交易 </Button>
      </div>

    </div>
  );
};

function mapToProps(state) {
  return {
    placeOrder:state.placeOrder,
    wallet:state.wallet
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderSign));


