import {getContainers} from 'common/redux'
import models from './models'
import Currency from './settings/CurrencyContainer'

export default {
  ...getContainers(models),
  Currency,
}


