import React, { Component } from 'react';
import { connect } from 'dva';
import { bindActionCreators } from 'redux';
import {Modal} from 'antd';
import getActionCreators from './getActionCreators';

const getComponent = (namespace,keys)=>{
  return class Container extends React.Component {
    render() {
      const {
        children,dispatch,[namespace]:data,id,
        width,mask,closable=true,maskClosable=false,
        ...rest
      } = this.props
      const {...rest} = this.props
      const actionCreators = getActionCreators(namespace,keys)
      const actions = bindActionCreators(actionCreators,dispatch)
      const thisData = data[id] || {}
      const modalProps = {
        destroyOnClose:true,
        title:null,
        footer:null,
        visible:thisData.visible,
        width,
        closable, // if u want to custom onCancel for x , set this false
        maskClosable,
        onCancel:actions.hideModal.bind(this,{id}),
      }
      const childProps = {
        ...rest,
        modal:{
          ...thisData,
          ...actions,
        }
      }
      return (
        <Modal {...modalProps}>
          {
            React.Children.map(this.props.children, child => {
                return React.cloneElement(child, {...childProps})
            })
          }
        </Modal>
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
