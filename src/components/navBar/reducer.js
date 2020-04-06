import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
    status: "opened",
    titleNavBar: 'Dashboard',
    viewAlertClient:false,
    mapModulesAccess: [],
    confidential: false
});

export default (state = initialState, action) => {
    switch (action.type) {
    case actions.TOGGLE_MENU:
        const currentState = state.get('status');
        const newStatus = currentState === "closed" ? "opened" : "closed";
        return state.set("status", newStatus);
    case actions.UPDATE_TITLE_NAV_BAR:
        return state.withMutations(map => {
            map.set("titleNavBar", action.newTitle);
            map.set('confidential', false);
        });
    case actions.CONSULT_MODULE_ACCESS:
        return state.set("mapModulesAccess", action.payload.data.data);
    case actions.VIEW_ALERT_CLIENT:
        return state.set("viewAlertClient", action.viewAlertClient);
    case actions.SHOW_BRAND_CONFIDENTIAL:
        return state.set('confidential', action.payload);
    default:
        return state;
    }
}
