import React from 'react';

function LayoutHome(props) {
  return (
    <div>
    	<div className="home-header clearfix">
    	    <div className="container relative">
    	        <div className="row justify-content-between">
    	            <div className="col-auto">
    	                <div className="brand"><a href="index.html"><img src={require('../assets/images/logo.png')} /></a></div>
    	            </div>
    	            <div className="col-auto language"><a href="#"><i className="icon en"></i></a></div>
    	        </div>
    	        <ul className="language dropdown" id="language" style={{display: "none"}}>
    	            <li><a href=""><i className="icon en"></i>English</a></li>
    	            <li><a href=""><i className="icon cn"></i>简体中文</a></li>
    	        </ul>
    	    </div>
    	</div>
    	{props.children}
    </div>
  )
}
export default LayoutHome
