import React from 'react'
import {connect} from 'dva'
import {Modal} from 'antd'
import redux from 'common/redux'
import model from './model'
const Container = redux.getContainer({model})
const ModalContainer = (props)=>{
  const {
    children,id,
    width,mask,closable=true,maskClosable=false,apisOnly=false,
  } = props
  return (
    <Container id={id} render={(renderProps)=>{
      const childProps = {...renderProps}
      if(apisOnly){
        return (
          <div>
            {
              React.Children.map(children, child => {
                  return React.cloneElement(child, {...childProps})
              })
            }
          </div>
        )
      }else{
        const {[id]:module} = renderProps
        const modalProps = {
          destroyOnClose:true,
          title:null,
          footer:null,
          visible:module.visible,
          width,
          closable,
          maskClosable,
          mask,
          onCancel:module.hideModal.bind(this,{id}),
        }
        return (
          <Modal {...modalProps}>
            {
              React.Children.map(children, child => {
                  return React.cloneElement(child, {...childProps})
              })
            }
          </Modal>
        )
      }

    }}/>
  )
}
export default ModalContainer
