import React, { Component } from 'react'
import { connect } from 'dva'
import { bindActionCreators } from 'redux'
import getActionCreators from './getActionCreators'
const getWrapper = (namespace,keys)=>{
  return class Wrapper extends React.Component {
    constructor(props){
      super(props)
    }
    shouldComponentUpdate(nextProps, nextState){
      // const { id } = this.props
      // if(id){
      //   if(nextProps[namespace][id] === this.props[namespace][id]){
      //     console.log(id,'wrapper not render')
      //     return false
      //   }else{
      //     console.log(id,'wrapper render')
      //     return true
      //   }
      // }else{
      //   return true
      // }
      return true
    }
    componentDidMount() {
      if(this.props[namespace] && this.props.actions.init){
        const initState = this.props.initState || {}
        this.props.actions.init({...initState,id:this.props.id})
      }
    }
    render() {
      const { children,dispatch,[namespace]:data,id,alias=false,render,...rest} = this.props
      delete rest.actions
      const actionCreators = getActionCreators({namespace,keys,id})
      const actions = bindActionCreators(actionCreators, dispatch)
      const thisData = data[id] || {}
      let childProps = {}
      if(alias){
        childProps = {
          ...rest,
          [alias]:{
            ...thisData,
            ...actions,
          },
          dispatch,
        }
      }else if(id){
        childProps = {
          ...rest,
          [id]:{
            ...thisData,
            ...actions,
          },
          dispatch,
        }
      }else{
        childProps = {
          ...rest,
          [namespace]:{
            ...data,
            ...actions,
          },
          dispatch,
        }
      }
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
export const getContainer = ({model,path=''})=>{
  const namespace = model.namespace
  const reducersKeys = Object.keys(model.reducers || {})
  const effectsKeys = Object.keys(model.effects || {})
  let keys = [...reducersKeys,...effectsKeys]
  const actionCreators = getActionCreators({namespace,keys})
  return connect(
    ({[namespace]:value})=>({[namespace]:value}),
    dispatch => ({actions: bindActionCreators(actionCreators, dispatch),dispatch})
  )(getWrapper(namespace,keys))
}

export const getContainers =  models => {
  let Containers = {}
  models.forEach(model=>{
    let { namespace } = model
    Containers[namespace[0].toUpperCase() + namespace.slice(1)] = getContainer({model})
  })
  return Containers
}

export default {
  getContainer,
  getContainers,
}


