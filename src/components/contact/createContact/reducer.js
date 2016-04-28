import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false,
    status: false,
    responseCreateContact : {},
    validateLogin: false,
    responseSearchContactData:{}
});

export default function(state = initialState, action){
    switch(action.type){
    case actions.TOGGLE_MODAL_CONTACT:
        const actualState = state.get('modalState');
        const newState = actualState === false ? true : false;
        return state.set('modalState', newState);
    case actions.CREATE_CONTACT:
            const {responseCreateContact} = action.payload.data;
            return state.set('responseCreateContactData', responseCreateContact);
    case actions.SEARCH_CONTACT:
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                .set('status', response.status)
                .set('validateLogin', response.validateLogin)
                .set('responseSearchContactData', JSON.parse(response.contactDetail));
            });
    default:
        return state;
    }
}
