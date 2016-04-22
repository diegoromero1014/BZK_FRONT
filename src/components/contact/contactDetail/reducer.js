import Immutable from 'immutable';
import {GET_CONTACT_DETAILS} from '../constants';

const initialContactDetail = Immutable.Map({
	contactDetail: {}
});

export default (state = initialContactDetail, action) => {
    switch (action.type) {
        case GET_CONTACT_DETAILS:
        	const response = action.payload.data;
            return state.withMutations(map => {
                console.log('Respuesta del reducer -> ');
                console.log(JSON.parse(response.contactDetail));
                map.set('contactDetail', JSON.parse(response.contactDetail));
            });
            break;
        default:
            return state;
    }
}