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

export default {
  MetaItem,
  MetaList,
}
