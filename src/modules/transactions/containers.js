import redux from 'common/redux'
import ListModel from './ListModel'

export default {
	ListContainer:redux.getContainer({model:ListModel}),
}

