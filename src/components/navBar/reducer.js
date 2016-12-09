import Immutable from 'immutable';
import * as constants from './constants';

const initialState = Immutable.Map({
    status: constants.MENU_OPENED,
    titleNavBar: 'Mis clientes',
    viewAlertClient:false,
    mapModulesAccess: []
});

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.TOGGLE_MENU:
        const currentState = state.get('status');
        const newStatus = currentState === constants.MENU_CLOSED ? constants.MENU_OPENED : constants.MENU_CLOSED;
        return state.set("status", newStatus);
    case constants.UPDATE_TITLE_NAV_BAR:
        return state.set("titleNavBar", action.newTitle);
    case constants.CONSULT_MODULE_ACCESS:
        return state.set("mapModulesAccess", action.payload.data.data);
    case constants.VIEW_ALERT_CLIENT:
        return state.set("viewAlertClient", action.viewAlertClient);
    default:
        return state;
    }
}
