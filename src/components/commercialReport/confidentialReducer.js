import Immutable from 'immutable';
import { IS_CONFIDENTIAL } from "./constants";

const initialState = Immutable.Map({
    confidential: false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case IS_CONFIDENTIAL:
            return state.set('confidential', action.payload);
        default:
            return state;
    }
}
