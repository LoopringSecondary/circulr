import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
const getComponent = (namespace)=>{
  return class Container extends React.Component {
    render() {
      const { children,dispatch,[namespace]:data,...rest} = this.props
      const actions = bindActionCreators(actionCreators,dispatch)
      const childProps = {
        ...rest,
        [namespace]:{
          ...data,
          ...actions,
        }
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

function getContainer({model,path=''}) {
  const namespace =  model.namespace
  const reducersKeys = Object.keys(model.reducers)
  const stateKeys = Object.keys(model.reducers)
  const effectsKeys = Object.keys(model.effects)
  let keys = [reducersKeys,reducersKeys]
  keys = keys.map(key=>key.replace(`${namespace}/`,''))
  const actionCreators = getActionCreators(namespace,keys)
  const dispatch 
  const actions = bindActionCreators(actionCreators,dispatch)
  if(path){
    // TODO flat nest 
    path = config.path
  }else{
    path = namespace
  }
  return connect(({[path]:value})=>({[path]:value}))(getComponent(path))
}
export default getContainer
