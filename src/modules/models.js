export default [
  require('./sockets/SocketsModel').default,
  require('./orders/ListModel').default,
  require('./orders/PlaceOrderModel').default,
  require('./tokens/ListModel').default,
  require('./tokens/TransferModel').default,
  require('./tokens/ConvertModel').default,
  require('./transactions/ListModel').default,
  require('./account/model').default,
  require('./settings/model').default,
  require('LoopringUI/modules/ModalsModel').default,
  require('LoopringUI/modules/TabsModel').default,
]


