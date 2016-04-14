import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false
});

export default function(state = initialState, action){
    switch(action.type){
    case actions.TOGGLE_MODAL:
        const actualState = state.get('modalState');
        const newState = actualState === false ? true : false;
        return state.set('modalState', newState);
    default:
        return state;
    }
}
