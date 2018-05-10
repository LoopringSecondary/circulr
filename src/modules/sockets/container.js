import redux from 'common/redux'
import SocketsModel from './SocketsModel'
import SocketModel from './SocketModel'
export default {
  SocketContainer:redux.getContainer({model:SocketModel})
  SocketsContainer:redux.getContainer({model:SocketsModel})
}

