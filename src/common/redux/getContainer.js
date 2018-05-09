import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import getActionCreators from './getActionCreators';
const getComponent = (namespace,keys)=>{
  return class Container extends React.Component {
    render() {
      const { children,dispatch,[namespace]:data,...rest} = this.props
      const actionCreators = getActionCreators(namespace,keys)
      const actions = bindActionCreators(actionCreators,dispatch)
      window[namespace]=actions
      const childProps = {
        ...rest,
        [namespace]:{
          ...data,
          ...actions,
        }
      }
      const modalProps = {
        visible:thisModal.visible,
        width,
        destroyOnClose:true,
        title:null,
        footer:null,
        closable,
        maskClosable,
        // wrapClassName:"rs", // reset modal
        className:"rs", // reset modal
        onCancel:hideModal.bind(this,{id}),
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
