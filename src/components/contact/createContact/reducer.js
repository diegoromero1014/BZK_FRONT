import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false,
    status: false,
    responseCreateContact: {},
    validateLogin: false,
    isClientContact: false,
    findContact: false,
    responseSearchContactData: {}
});

export default function (state = initialState, action) {
    switch (action.type) {
        case actions.TOGGLE_MODAL_CONTACT:
            const actualState = state.get('modalState');
            const newState = actualState === false ? true : false;
            return state.set('modalState', newState);
        case actions.CREATE_CONTACT:
            const { responseCreateContact } = action.payload.data;
            return state.set('responseCreateContactData', responseCreateContact);
        case actions.SEARCH_CONTACT:                    
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('status', response.status)
                    .set('isClientContact', response.data.isClientContact)
                    .set('findContact', response.data.findContact)
                    .set('validateLogin', response.validateLogin)
                    .set('responseSearchContactData', response.data);

            });
        case actions.CLEAR_SEARCH_CONTACT:
            return state.set('responseSearchContactData', {});
        default:
            return state;
    }
}
