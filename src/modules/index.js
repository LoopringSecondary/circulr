import redux from 'common/redux'

export const models  = [
  require('./ui/ModalsModel').default,
  require('./ui/TabsModel').default,
  require('./sockets/SocketsModel').default,
  require('./orders/ListModel').default,
  require('./orders/PlaceOrderModel').default,
  require('./tokens/ListModel').default,
  require('./tokens/TransferModel').default,
  require('./tokens/ConvertModel').default,
  require('./transactions/ListModel').default,
  require('./account/model').default,
  require('./settings/model').default,
]

export const Containers = redux.getContainers(models)

export default {
  models,
  Containers,
}

