import dva from 'dva';
import './assets/css/index.less'

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
let models  = [
  require('./modules/modals/model').default,
  require('./modules/sockets/SocketsModel').default,
  require('./modules/orders/ListModel').default,
  require('./modules/orders/PlaceOrderModel').default,
  require('./modules/tokens/ListModel').default,
  require('./modules/tokens/TransferModel').default,
  require('./modules/tokens/ConvertModel').default,
  require('./modules/transactions/ListModel').default,
  require('./modules/wallet/airdropModel').default,
  require('./modules/wallet/model').default,
  require('./modules/wallet/mnemonicModel').default,
  require('./modules/wallet/keystoreModel').default,
  require('./modules/wallet/hardwareWalletModel').default,
  require('./modules/account/model').default,
  require('./modules/settings/model').default,
];

models.map(model=>{
  app.model(model)
});

// 4. Router
app.router(require('./router').default);


// 5. Start
app.start('#root');

// STORE is available when current route has rendered
// Becarefull to use STORE in render funtion
window.STORE = app._store
