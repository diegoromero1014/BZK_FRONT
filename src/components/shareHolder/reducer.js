import Immutable from 'immutable';
import {FIND_SHAREHOLDER, KEEP_KEYWORD} from './constants';

const initialState = Immutable.Map({
	status: 'whithoutProcessing',
	keyword: '',
	page: 0,
	rowCount: 0,
	responseShareHolder: []
});

export default (state = initialState, action) => {
	switch(action.type) {

		case FIND_SHAREHOLDER:
			const response = action.payload.data;
			return state.withMutations(map => {
				map.set('status', 'processed')
				.set('rowCount', response.messageBody.rowCount)
				.set('responseShareHolder',response.messageBody.rows);
			});
			break;
		case KEEP_KEYWORD:
			return state.set('keyword', action.keyword);
			break;
		default:
			return state;
	}
}
