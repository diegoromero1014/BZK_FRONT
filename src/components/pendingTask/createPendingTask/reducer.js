import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    status: false,
    responseCreate : []
});

export default function(state = initialState, action){
    switch(action.type){
    case actions.CREATE_PENDING:
            const {responseCreate} = action.payload.data;
            return state.set('responseCreate', responseCreate);
    default:
        return state;
    }
}
