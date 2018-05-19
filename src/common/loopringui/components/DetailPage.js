import React, { PropTypes } from 'react';





export const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <li>
      <span>
        {label}
      </span>
      <div className="text-lg-control break-word text-right">
        {render ? render(value) : value}
      </div>
    </li>
  )
}
export const MetaList = (props)=>(
  <ul className="list list-label list-dark list-justify-space-between divided">
    {props.children}
  </ul>
)
export const DetailHeader = (props)=>{
  if(props.title){
    return <div className="modal-header text-dark"><h3>{props.title}</h3></div>
  }else{
    return <div className="modal-header text-dark">{props.children}</div>
  }
}


export default {
  DetailHeader,
  MetaItem,
  MetaList,
}
