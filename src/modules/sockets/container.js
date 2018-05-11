import redux from 'common/redux'
import SocketsModel from './SocketsModel'
export default {
  SocketsContainer:redux.getContainer({model:SocketsModel})
}

