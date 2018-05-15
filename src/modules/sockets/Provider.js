import React from 'react'
import {connect} from 'dva'


class SocketProvider extends React.Component {
  constructor(props) {
    super(props)
    props.dispatch({
      type:'sockets/connect',
    })

  }
  render() {
    return React.Children.only(this.props.children)
  }
}

export default connect()(SocketProvider)
