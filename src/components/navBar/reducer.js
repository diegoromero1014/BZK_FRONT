import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    status: "closed",
    titleNavBar: 'Mis clientes'
});

export default (state = initialState, action) => {
    switch (action.type) {
    case actions.TOGGLE_MENU:
        const currentState = state.get('status');
        const newStatus = currentState === "closed" ? "opened" : "closed";
        return state.set("status", newStatus);
    case actions.UPDATE_TITLE_NAV_BAR:
        return state.set("titleNavBar", action.newTitle);
    default:
        return state;
    }
}
