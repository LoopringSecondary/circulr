import {getContainer} from 'common/redux'
import ListModel from './ListModel'
import TransferModel from './TransferModel'
import ConvertModel from './ConvertModel'

export default {
	ListContainer:getContainer({model:ListModel}),
	TransferContainer:getContainer({model:TransferModel}),
	ConvertContainer:getContainer({model:ConvertModel}),
}