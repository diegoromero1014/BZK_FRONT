import Immutable from 'immutable';
import { UPDATE_ACTIVE_TAB_CS, VALIDATE_CLIENTS } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    tabSelected: null,
    listClientsDelivery: Immutable.List()
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB_CS:
            return state.set("tabSelected", action.payload);
        case VALIDATE_CLIENTS:
            const listClients = _.get(action, 'payload.data.data', []);
            const list = state.get('listClientsDelivery');
            listClients.map(item => {
                const uid = _.uniqueId('note_');
                list.push({
                    uid,
                    clientNumber: item.clientNumber,
                    nameClient: item.nameClient,
                    updateClient: item.nameClient,
                    deliveryComplete: item.deliveryComplete
                })
            });
            return state.set('listClientsDelivery', list);
        default:
            return state;
    }
}
