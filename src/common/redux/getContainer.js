import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import getActionCreators from './getActionCreators';
const getComponent = (namespace,keys)=>{
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
      const { children,dispatch,[namespace]:data,id,...rest} = this.props
      const actionCreators = getActionCreators({namespace,keys,id})
      const actions = bindActionCreators(actionCreators,dispatch)
      let childProps = {}
      if(id){
        childProps = {
          ...rest,
          [id]:{
            ...data[id],
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
  const namespace =  model.namespace
  const reducersKeys = Object.keys(model.reducers)
  const stateKeys = Object.keys(model.reducers)
  const effectsKeys = Object.keys(model.effects)
  let keys = [...reducersKeys,...reducersKeys]
  keys = keys.map(key=>key.replace(`${namespace}/`,''))
  if(!path){
    path = namespace
  }else{
    // TODO flat nest
  }
  return connect(({[path]:value})=>({[path]:value}))(getComponent(path,keys))
}
export default getContainer
