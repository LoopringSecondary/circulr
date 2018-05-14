import React from 'react'
import {Modal} from 'antd'

const ModalsWrapper = (props)=>{
  const {
    children,id,
    width,mask,closable=true,maskClosable=false,apisOnly=false,
    ...rest
  } = props
  const {[id]:module={}} = props
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
  const childProps = {...rest}
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
export default ModalsWrapper
