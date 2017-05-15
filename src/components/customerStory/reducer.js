import Immutable from 'immutable';
import { UPDATE_ACTIVE_TAB_CS, VALIDATE_CLIENTS, GET_ALL_TEAMS } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    tabSelected: null,
    listClientsDelivery: [],
    listTeams: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB_CS:
            return state.set("tabSelected", action.payload);
        case VALIDATE_CLIENTS:
            const listClients = _.get(action, 'payload.data.data', []);
            return state.set('listClientsDelivery', listClients);
        case GET_ALL_TEAMS:
            const listTeams = _.get(action, 'payload.data.data', []);
            return state.set('listTeams', listTeams);
        default:
            return state;
    }
}
