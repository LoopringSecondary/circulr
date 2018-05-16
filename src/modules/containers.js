import {getContainers} from 'common/redux'
import models from './models'
import Currency from './settings/CurrencyContainer'
export {Currency}

export default {
  ...getContainers(models),
  Currency,
}


