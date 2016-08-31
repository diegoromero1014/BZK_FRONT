import Immutable from 'immutable';
import {GET_CONTACT_DETAILS, CLEAR_EDIT_CONTACT} from '../constants';

const initialContactDetail = Immutable.Map({
	contactDetailList: {}
});

export default (state = initialContactDetail, action) => {
    switch (action.type) {
        case GET_CONTACT_DETAILS:
        	const response = action.payload.data;
            return state.withMutations(map => {
                map.set('contactDetailList', JSON.parse(response.contactDetail));
            });
            break;

				case CLEAR_EDIT_CONTACT:
					return state.set('contactDetailList', {});
        default:
            return state;
    }
}
