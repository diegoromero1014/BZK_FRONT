import Immutable from 'immutable';
import { INITIAL_MENU, CHANGE_ITEM_ACTIVE_MENU } from './constants';

const initialState = Immutable.Map({
    menuListItem: [],
    activeItem: ''
});

export default (state = initialState, action) => {
    switch (action.type) {
        case INITIAL_MENU:
            return state.set("menuListItem", action.menu);
        case CHANGE_ITEM_ACTIVE_MENU:
            return state.set("activeItem", action.activeItem);
        default:
            return state;
    }
}