import React from 'react';
import {Select} from 'antd'
import {connect} from "dva";
import {locales} from '../common/config/data'

function LayoutHome(props) {

  const {locale,dispatch} = props;
  const localeChange = (value)=>{
    dispatch({
      type:'locales/setLocale',
      payload:{
        locale:value
      }
    });
    let currency = value.startsWith('en' ) ? 'USD' : 'CNY';
    dispatch({
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
                <Select className="col-auto language dropdown"  showArrow={false} dropdownMatchSelectWidth={false} defaultValue={locale} onChange={localeChange}>
                  {locales.map(item => {
                  return (
                    <Select.Option value={item.value} key={item.value}> <i className="icon en"/> {item.name}</Select.Option>
                  )
                  })}
                </Select>
    	        </div>
    	    </div>
    	</div>
    	{props.children}
    </div>
  )
}

function mapStateToProps(state) {
  return {
    locale:state.locales.locale
  }
}

export default connect(mapStateToProps)(LayoutHome)
