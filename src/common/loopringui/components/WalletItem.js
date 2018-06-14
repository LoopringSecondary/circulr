import React from 'react'
import {Spin,Icon} from 'antd'

export default function WalletItem(props) {
  const {title, description,icon,layout,showArrow,loading=false} = props;
  if(layout === 'vertical'){
    return (
      <div className="mt5 mb5">
        <div className="text-center">
          <i className={`fs24 icon-${icon}`}/>
        </div>
        <div className="">
          <div className="fs14">{title}</div>
        </div>
      </div>
    )
  }else{
    return (
      <div className="row pt10 pb10 pl0 pr0 align-items-center zb-b-b">
        <div className="col-auto pr5 text-right text-primary">
          <i className={`fs20 icon-${icon}`}/>
        </div>
        <div className="col pl10">
          <Spin spinning={loading}>
            <div className="fs14 color-black-1 text-wrap">{title}</div>
            <div className="fs12 color-black-2">{description}</div>
          </Spin>
        </div>
        {showArrow &&
        <div className="col-auto text-right">
          <Icon type="right" />
        </div>
        }
      </div>
    )
  }
}
