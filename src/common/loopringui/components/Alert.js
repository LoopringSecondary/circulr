import React, { PropTypes } from 'react';
import {Button,Icon} from 'antd';
import './Alert.less';

const Alert = ({title,description,type='info',theme='dark',actions,size="medium",className="",...rest})=>{
  return (
    <div className={`loopring-alert t-${type} t-${theme} s-${size} ${className}`} {...rest}>
      <div className="row align-items-center no-gutters">
        {
          type &&
          <div className="col-auto alert-gutter">
            {
              type === 'success' &&
              <i className="loopring-icon loopring-icon-success alert-icon"  />
            }
            {
              type === 'info' &&
              <i className="loopring-icon loopring-icon-warn alert-icon"  />
            }
            {
              type === 'warning' &&
              <i className="loopring-icon loopring-icon-warn alert-icon"  />
            }

            {
              type === 'error' &&
              <i className="loopring-icon loopring-icon-close alert-icon"  />
            }
          </div>
        }
        <div className="col alert-gutter">
          <div className="alert-title">{title}</div>
          {
            description &&
            <div className="alert-description">{description}</div>
          }
          {
            actions &&
            <div className="alert-actions">{actions}</div>
          }
        </div>
      </div>

    </div>
  )
}

export default Alert
