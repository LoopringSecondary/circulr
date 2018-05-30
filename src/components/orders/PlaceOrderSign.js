import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps,Collapse} from 'antd'
import Alert from 'LoopringUI/components/Alert'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'

const PlaceOrderSign = (props) => {
  const {placeOrder, wallet, dispatch} = props
  const {signed, unsigned} = placeOrder
  const isUnlocked =  wallet.address && wallet.unlockType && wallet.unlockType !== 'locked' && wallet.unlockType !== 'address'

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
      <div className="row pl0 pr0 pt10 pb10 align-items-center">
        <div className="col">
          <div className="fs18 color-black-1">
            <Button type="primary" shape="circle" className="mr10">{index+1}</Button>
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
      <div className="row pl0 pr0 ">
        <div className="col-6 pr5">
          <Input.TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} value={JSON.stringify(unsigned[index])}/>
        </div>
        <div className="col-6 pl5">
          <Input.TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} value={signed && signed[index] ? JSON.stringify(signed[index]) : ''}/>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="pb10 fs18 color-black-1 zb-b-b">交易签名</div>

      <div className="mb15"></div>
      <Alert type="info" title={`您需要通过 ${wallet.unlockType} 完成下面 ${unsigned.length} 个交易的签名：`} theme="light" size="small" />
      <div className="mb15"></div>
      <Collapse defaultActiveKey={[]}>
        {
          isUnlocked && unsigned.map((item, index)=>{
            return (
              <Collapse.Panel header={<TxHeader tx={item} index={index} />} key={index} showArrow={false}>
                <TxContent tx={item} index={index}/>
              </Collapse.Panel>
            )
          })
        }
      </Collapse>
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


