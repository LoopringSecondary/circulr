import redux from 'common/redux'
import ListModel from './ListModel'
import PlaceOrderModel from './PlaceOrderModel'
export default {
	ListContainer:redux.getContainer({model:ListModel}),
	PlaceOrderContainer:redux.getContainer({model:PlaceOrderModel}),
}

