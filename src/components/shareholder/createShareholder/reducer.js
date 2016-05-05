import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false,
    status: false
});

export default function(state = initialState, action){
    switch(action.type){
    case actions.TOGGLE_MODAL_SHAREHOLDER:
        const actualState = state.get('modalState');
        const newState = actualState === false ? true : false;
        return state.set('modalState', newState);
    case actions.CLEAR_SEARCH_SHAREHOLDER:
        return state;
    default:
        return state;
    }
}
