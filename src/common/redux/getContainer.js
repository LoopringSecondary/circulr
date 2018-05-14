import React, { Component } from 'react'
import { connect } from 'dva'
import { bindActionCreators } from 'redux'
import getActionCreators from './getActionCreators'
const getWrapper = (namespace,keys)=>{
  return class Wrapper extends React.Component {
    constructor(props){
      super(props)
      if(props[namespace]){
          const initState = props.initState || {}
          props.dispatch({
            type:`${namespace}/init`,
            payload:{...initState,id:props.id}
          })
      }
    }
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
    componentDidMount() {
      // TODO
    }
    render() {
      const { children,dispatch,[namespace]:data,id,alias=false,render,...rest} = this.props
      const actionCreators = getActionCreators({namespace,keys,id})
      const actions = bindActionCreators(actionCreators,dispatch)
      const thisData = data[id] || {}
      let childProps = {}
      if(alias){
        childProps = {
          ...rest,
          id, // for wrapper
          [alias]:{
            ...thisData,
            ...actions,
          },
          dispatch,
        }
      }else if(id){
        childProps = {
          ...rest,
          id, // for wrapper
          [id]:{
            ...thisData,
            ...actions,
          },
          dispatch,
        }
      }else{
         childProps = {
          ...rest,
          id, // for wrapper
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
  // keys = keys.map(key=>key.replace(`${namespace}/`,''))
  // if(!path){
  //   path = namespace
  // }else{
  //   // flat nest
  // }
  return connect(({[namespace]:value})=>({[namespace]:value}))(getWrapper(namespace,keys))
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


