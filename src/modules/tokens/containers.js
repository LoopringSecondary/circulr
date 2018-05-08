import redux from 'common/redux'
import ListModel from './ListModel'
import TransferModel from './TransferModel'
import ConvertModel from './ConvertModel'

export default {
	ListContainer:redux.getContainer({model:ListModel}),
	TransferContainer:redux.getContainer({model:TransferModel}),
	ConvertContainer:redux.getContainer({model:ConvertModel}),
}
