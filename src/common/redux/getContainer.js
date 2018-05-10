import React, { Component } from 'react'
import { connect } from 'dva'
import { bindActionCreators } from 'redux'
import getActionCreators from './getActionCreators'
const getWrapper = (namespace,keys)=>{
  return class Container extends React.Component {
    shouldComponentUpdate(nextProps, nextState){
      const { id } = this.props
      if(id){
        if(nextProps[namespace][id] === this.props[namespace][id]){
          return false
        }else{
          return true
        }
      }else{
        return true
      }
    }
    render() {
      const { children,dispatch,[namespace]:data,id,render,...rest} = this.props
      const actionCreators = getActionCreators({namespace,keys,id})
      const actions = bindActionCreators(actionCreators,dispatch)
      const thisData = data[id] || {}
      let childProps = {}
      if(id){
        childProps = {
          ...rest,
          [id]:{
            ...thisData,
            ...actions,
          }
        }
      }else{
         childProps = {
          ...rest,
          [namespace]:{
            ...data,
            ...actions,
          }
        }
      }
      window[namespace]=actions
      if(render){
        return render.call(this,childProps)
      }
      return (
        <div>
          {
            React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {...childProps})
            })
          }
        </div>
      )
    }
  }
}
const getContainer = ({model,path=''})=>{
  const namespace = model.namespace
  const reducersKeys = Object.keys(model.reducers)
  const effectsKeys = Object.keys(model.effects)
  let keys = [...reducersKeys,...effectsKeys]
  keys = keys.map(key=>key.replace(`${namespace}/`,''))
  if(!path){
    path = namespace
  }else{
    // TODO flat nest
  }
  return connect(({[path]:value})=>({[path]:value}))(getWrapper(path,keys))
}
export default getContainer
