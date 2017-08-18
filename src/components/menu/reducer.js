import Immutable from 'immutable';
import { INITIAL_MENU } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    menuListItem: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case INITIAL_MENU:
            console.log("action.menu", action.menu);
            return state.set("menuListItem", action.menu);
        default:
            return state;
    }
}