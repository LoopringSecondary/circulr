import dva from 'dva';
import { models } from './modules'
import './assets/css/index.less'

// 1. Initialize
const app = dva()
window.config = {}
window.config.address = "0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00";
window.config.host = "//relay1.loopring.io"
window.config.rpc_host = "//relay1.loopring.io/rpc/v2"
// 2. Plugins
// app.use({})

// 3. Model
models.map(model=>{
  app.model(model)
})

// 4. Router
app.router(require('./router').default)


// 5. Start
app.start('#root')

// STORE is available when current route has rendered
// Becarefull to use STORE in render funtion
window.STORE = app._store
export const sotre = app._store
export default app
