import dva from 'dva';
// import './index.css';
// import './assets/css/index.less'

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

let models  = [
  require('./modules/orders/ListModel').default,
  require('./modules/orders/PlaceOrderModel').default,
  require('./modules/tokens/ListModel').default,
  require('./modules/tokens/TransferModel').default,
  require('./modules/tokens/ConvertModel').default,
]
models.map(model=>{
  app.model(model)
});

// 5. Start
app.start('#root');

// STORE is available when current route has rendered
// Becarefull to use STORE in render funtion
window.STORE = app._store
