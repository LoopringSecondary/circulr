import {getContainer} from '@/common/redux'
import ListModel from './ListModel'
import PlaceOrderModel from './PlaceOrderModel'

export default {
	ListContainer:getContainer({model:ListModel}),
	PlaceOrderContainer:getContainer({model:PlaceOrderModel}),
}

