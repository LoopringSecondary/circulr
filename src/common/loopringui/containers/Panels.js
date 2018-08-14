import React from 'react'
import Drawer from 'rmc-drawer'
import './Panels.less'
const PanelsWrapper = (props)=>{
  const {
    children,id,
    docked,width='30vw',position='left',sidebarClassName='panel-default-theme',className='',
    ...rest
  } = props
  const {[id]:layer={}} = props
  const layerProps = {
    open: layer.visible,
    onOpenChange:layer.hideLayer.bind(this,{id}),
    docked: false,
    touch:  false,
    enableDragHandle: layer.enableDragHandle || true,
    position,
    className,
    transitions: true,
    dragToggleDistance:layer.dragToggleDistance || 30,

  }
  const childProps = {...rest}
  const sidebar = ()=>{
    if(layer.visible){
      if(!props.render){
        return (
          <div className={sidebarClassName} style={{width}}>
            {
              React.Children.map(props.children, child => {
                return React.cloneElement(child, {...childProps})
              })
            }
          </div>
        )
      }else{
        return (
          <div className={sidebarClassName}>
            {props.render && props.render.call(this,childProps)}
          </div>
        )
      }
    }else{
      return <span></span>
    }
  }
  if(layer.visible){
    return <Drawer sidebar={sidebar()} {...layerProps} children={<div></div>}/>
  }else{
    return <span></span>
  }

}
export default PanelsWrapper
