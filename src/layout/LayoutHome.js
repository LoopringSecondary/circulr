import React from 'react';
import {Select} from 'antd'


function LayoutHome(props) {

  const localeChange = (value)=>{
    props.dispatch({
      type:'locales/setLocale',
      payload:{
        locale:value
      }
    });
    let currency = value.startsWith('en' ) ? 'USD' : 'CNY';
    props.dispatch({
      type:'settings/preferenceChange',
      payload:{
        language: value,
        currency: currency,
      }
    })
  }

  return (
    <div>
    	<div className="home-header clearfix">
    	    <div className="container relative">
    	        <div className="row justify-content-between">
    	            <div className="col-auto">
    	                <div className="brand"><a href="index.html"><img src={require('../assets/images/logo.png')} /></a></div>
    	            </div>
                <Select className="col-auto language dropdown"  showArrow={false} dropdownMatchSelectWidth={false} defaultValue="cn" onChange={localeChange}>
                  <Select.Option value='en'> <i className="icon en"/> English </Select.Option>
                  <Select.Option value='cn'> <i className="icon cn"/> 简体中文 </Select.Option>
                </Select>
    	        </div>
    	    </div>
    	</div>
    	{props.children}
    </div>
  )
}
export default LayoutHome
