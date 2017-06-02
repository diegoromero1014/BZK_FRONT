import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    contextClient: null,
    validateInfoCreditStudy: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_CONTEXT_CLIENT:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('contextClient', response.data)
            });
        case actions.VALIDATE_INFO_CREDIT_STUDY:
            const responseInfo = action.payload.data;
            return state.withMutations(map => {
                map.set('validateInfoCreditStudy', responseInfo.data)
            });
        default:
            return state;
    }
}
