import Immutable from 'immutable';
import {CONSULT_INFO_CLIENT, CHANGE_CHECK_CLIENT, CLAER_CLIENT_INFO, UPDATE_FIELD_INFO_CLIENT} from './constants';
import {isEmpty, set} from 'lodash';

const initialState = Immutable.Map({
    status: "200",
    validateLogin: true,
    responseClientInfo: {},
    economicGroup: null
});

export default(state = initialState, action) => {
    switch (action.type) {
        case CONSULT_INFO_CLIENT:
            const {status, validateLogin, clientInformation} = action.payload.data;
            const dataClient = isEmpty(clientInformation) ? [] : JSON.parse(clientInformation);
            return state.withMutations(map => {
                map
                    .set('status', status)
                    .set('validateLogin', validateLogin)
                    .set('responseClientInfo', dataClient);
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
        default:
            return state;
    }
}
