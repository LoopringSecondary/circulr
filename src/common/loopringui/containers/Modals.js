import React from 'react'
import {Modal} from 'antd'

const ModalsWrapper = (props)=>{
  const {
    children,id,
    width,mask,closable=true,maskClosable=true,apisOnly=false,wrapClassName="right-panel-modal",
    ...rest
  } = props
  const {[id]:module={}} = props
  const modalProps = {
    wrapClassName,
    destroyOnClose:true,
    title:null,
    footer:null,
    visible:module.visible,
    width,
    closable,
    maskClosable,
    mask,
    onCancel:module.hideModal && module.hideModal.bind(this),
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
