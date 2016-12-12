import Immutable from 'immutable';
import * as constants from './constants';


const initialState = Immutable.Map({
    showCloseMenu: false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case constants.SHOW_CLOSE_MENU:
            return state.set("showCloseMenu", action.value);
        default:
            return state;
    }
}
