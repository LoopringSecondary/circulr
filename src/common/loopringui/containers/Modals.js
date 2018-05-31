import React from 'react'
import {Modal} from 'antd'
import './Modals.less'

const ModalsWrapper = (props)=>{
  const {
    children,id,
    width,mask,closable=true,maskClosable=true,apisOnly=false,wrapClassName="",className="",
    ...rest
  } = props
  const {[id]:module={}} = props
  const modalProps = {
    className,
    wrapClassName,
    destroyOnClose:true,
    title:null,
    footer:null,
    visible:module.visible,
    width,
    closable,
    maskClosable,
    mask,
    onCancel:module.hideLayer && module.hideLayer.bind(this),
    zIndex:'1002',
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
