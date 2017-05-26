import Immutable from 'immutable';
import {
    CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, CLAER_CLIENT_INFO, UPDATE_FIELD_INFO_CLIENT,
    CHANGE_VALUE_LIST_CLIENT
} from './constants';
import { isEmpty, set } from 'lodash';

const initialState = Immutable.Map({
    status: "200",
    validateLogin: true,
    responseClientInfo: {},
    economicGroup: null,
    listParticipation: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case CONSULT_INFO_CLIENT:
            const { status, validateLogin, clientInformation } = action.payload.data;
            const dataClient = isEmpty(clientInformation) ? [] : JSON.parse(clientInformation);
            const { contextClient } = dataClient;
            const listParticipation = _.isUndefined(contextClient) || _.isNull(contextClient) ? [] : contextClient.listParticipation;
            return state.withMutations(map => {
                map
                    .set('status', status)
                    .set('validateLogin', validateLogin)
                    .set('responseClientInfo', dataClient)
                    .set('listParticipation', listParticipation);
            });
        case CLAER_CLIENT_INFO:
            return state.set("responseClientInfo", {});

        case CHANGE_CHECK_CLIENT:
            const data = action.payload;
            let responseClientInfo = state.get('responseClientInfo');
            if (responseClientInfo !== null && responseClientInfo !== undefined) {
                responseClientInfo.certificateNoShareholder = data;
                return state.set("responseClientInfo", responseClientInfo);
            } else {
                return state;
            }
        case UPDATE_FIELD_INFO_CLIENT:
            const infoClient = state.get('responseClientInfo');
            if (infoClient !== null && infoClient !== undefined) {
                const infoClientUpdated = set(infoClient, action.field, action.value);
                return state.set("responseClientInfo", infoClientUpdated);
            } else {
                return state;
            }
        case CHANGE_VALUE_LIST_CLIENT:
            return state.set(action.field, action.list);
        default:
            return state;
    }
}
