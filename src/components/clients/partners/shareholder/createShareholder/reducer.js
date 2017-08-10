import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false,
    status: false,
    validateLogin: true,
    shareholderExist: true,
});

export default function(state = initialState, action){
    switch(action.type){

    case actions.TOGGLE_MODAL_SHAREHOLDER:
        const actualState = state.get('modalState');
        const newState = actualState === false ? true : false;
        return state.set('modalState', newState);

    case actions.CLEAR_SEARCH_SHAREHOLDER:
        return state.withMutations( map => {
          map
            .set('validateLogin', true)
            .set('shareholderExist', true)
            .set('status', "OK");
        });

    case actions.SEARCH_SHAREHOLDER:
        const {status, validateLogin, shareholderExist} = action.payload.data;
        return state.withMutations( map => {
          map
            .set('validateLogin', validateLogin)
            .set('shareholderExist', shareholderExist)
            .set('status', status);
        });

    default:
        return state;
    }
}
