import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    status: "closed",
    titleNavBar: 'Mis clientes',
    mapModulesAccess: []
});

export default (state = initialState, action) => {
    switch (action.type) {
    case actions.TOGGLE_MENU:
        const currentState = state.get('status');
        const newStatus = currentState === "closed" ? "opened" : "closed";
        return state.set("status", newStatus);
    case actions.UPDATE_TITLE_NAV_BAR:
        return state.set("titleNavBar", action.newTitle);
    case actions.CONSULT_MODULE_ACCESS:
        return state.set("mapModulesAccess", action.payload.data.data);
    default:
        return state;
    }
}
