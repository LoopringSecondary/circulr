import React, { Component } from 'react'
import { connect } from 'dva'
import { bindActionCreators } from 'redux'

export const getReducer = (state,action,type)=>{
  console.log('getReducer',state)
  const { payload } = action
  const { id } = payload
  const data = state[id] || {}
  delete payload.id
  return {
    ...state,
    [id]:{
     ...data,
     ...payload,
    }
  }
}
export const getModel = ()=>{
  // TODO
}



