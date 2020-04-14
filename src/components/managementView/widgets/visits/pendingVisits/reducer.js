import { REQUEST_PENDING_VISITS } from "../constants"
import { mapDateValueFromTaskByFormat } from "../../../../../actionsGlobal";
import { REVIEWED_DATE_FORMAT_HOUR } from '../../../../../constantsGlobal';
import { get } from 'lodash';

const initialState = {
	rows: [],
	rowCount: 0
}

const pendingVisits = (state = initialState, action = {}) => {

	if (action.type == REQUEST_PENDING_VISITS) {
		let newState = Object.assign({}, state, { rows: get(action.payload, 'data.data.rows', []), rowCount: get(action.payload, 'data.data.rowCount', 0) })
		const newRows = newState.rows.map(element => 
			element = Object.assign(
				{},
				element, 
				{ visitTime: mapDateValueFromTaskByFormat(element.visitTime, REVIEWED_DATE_FORMAT_HOUR) })
			)
		return Object.assign({}, newState, { rows: newRows })
	} else {
		return state;
	}
}

export default pendingVisits;