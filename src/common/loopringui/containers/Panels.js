import React from 'react'
import Drawer from 'rmc-drawer'
import './Panels.less'
const PanelsWrapper = (props)=>{
  const {
    children,id,docked,...rest
  } = props
  const {[id]:layer={}} = props
  const layerProps = {
    open: layer.visible,
    onOpenChange:layer.hideLayer.bind(this,{id}),
    docked: false,
    touch:  false,
    enableDragHandle: layer.enableDragHandle || true,
    position: layer.position || 'left',
    transitions: true,
    dragToggleDistance:layer.dragToggleDistance || 30,
  }
  const childProps = {...rest}
  const sidebar = ()=>{
    if(!props.render){
      return (
        React.Children.map(props.children, child => {
            return React.cloneElement(child, {...childProps})
        })
      )
    }else{
      props.render && props.render.call(this,childProps)
    }
  }
  return <Drawer sidebar={sidebar()} {...layerProps} children={<div></div>}/>
}
export default PanelsWrapper
