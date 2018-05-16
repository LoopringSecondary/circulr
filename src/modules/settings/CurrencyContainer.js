import React from 'react'
import {connect} from 'react-redux'
class CurrencyContainer extends React.Component {
  shouldComponentUpdate(nextProps){
    return nextProps.currency !== this.props.currency;
  }
  render() {
    let currency = {};
    if(this.props.currency === 'USD'){
        return '$'
    }else{
      return "￥"
    }
  }
}

export default connect(({settings})=>({currency:settings.preference.currency}))(CurrencyContainer)
