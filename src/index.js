import dva from 'dva';
import { models } from './modules'
import './assets/css/index.less'

// 1. Initialize
const app = dva()

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
