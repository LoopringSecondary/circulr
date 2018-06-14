import React from 'react'
import {connect} from 'dva';
import {Card} from 'antd';
import intl from 'react-intl-universal';





function SignByMetaMask(props) {


  return (
    <Card title={intl.get('metamask_sign.title')}>



    </Card>
  )
}


function mapStateToProps(state) {
  return {

  }
}

export default connect(mapStateToProps)(SignByMetaMask)
