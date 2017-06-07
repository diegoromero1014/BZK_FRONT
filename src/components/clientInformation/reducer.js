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
    listParticipation: [],
    listDistribution: [],
    listMainCustomer: [],
    listMainSupplier: [],
    listMainCompetitor: [],
    listOperations: [],
    noAppliedLineOfBusiness: false,
    noAppliedDistributionChannel: false,
    noAppliedMainClients: false,
    noAppliedMainSuppliers: false,
    noAppliedMainCompetitors: false,
    noAppliedIntOperations: false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case CONSULT_INFO_CLIENT:
            const { status, validateLogin, data } = action.payload.data;
            const dataClient = isEmpty(data) ? [] : JSON.parse(data);
            const contextClient = _.isUndefined(dataClient) || _.isNull(dataClient) ? null : dataClient.contextClient;
            const listParticipation = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listParticipation) ? [] : contextClient.listParticipation;
            const listDistribution = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listDistribution) ? [] : contextClient.listDistribution;
            const listMainCustomer = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listMainCustomer) ? [] : contextClient.listMainCustomer;
            const listMainSupplier = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listMainSupplier) ? [] : contextClient.listMainSupplier;
            const listMainCompetitor = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listMainCompetitor) ? [] : contextClient.listMainCompetitor;
            const listOperations = _.isUndefined(contextClient) || _.isNull(contextClient) || _.isNull(contextClient.listOperations) ? [] : contextClient.listOperations;
            const noAppliedLineOfBusiness = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedLineOfBusiness;
            const noAppliedDistributionChannel = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedDistributionChannel;
            const noAppliedMainClients = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedMainClients;
            const noAppliedMainSuppliers = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedMainSuppliers;
            const noAppliedMainCompetitors = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedMainCompetitors;
            const noAppliedIntOperations = _.isUndefined(contextClient) || _.isNull(contextClient) ? false : contextClient.noAppliedIntOperations;
            return state.withMutations(map => {
                map
                    .set('status', status)
                    .set('validateLogin', validateLogin)
                    .set('responseClientInfo', dataClient)
                    .set('listParticipation', listParticipation)
                    .set('listDistribution', listDistribution)
                    .set('listMainCustomer', listMainCustomer)
                    .set('listMainSupplier', listMainSupplier)
                    .set('listMainCompetitor', listMainCompetitor)
                    .set('listOperations', listOperations)
                    .set('noAppliedLineOfBusiness', noAppliedLineOfBusiness)
                    .set('noAppliedDistributionChannel', noAppliedDistributionChannel)
                    .set('noAppliedMainClients', noAppliedMainClients)
                    .set('noAppliedMainSuppliers', noAppliedMainSuppliers)
                    .set('noAppliedMainCompetitors', noAppliedMainCompetitors)
                    .set('noAppliedIntOperations', noAppliedIntOperations);
            });
        case CLAER_CLIENT_INFO:
            return state.set("responseClientInfo", {});

        case CHANGE_CHECK_CLIENT:
            const dataClientResponse = action.payload;
            let responseClientInfo = state.get('responseClientInfo');
            if (responseClientInfo !== null && responseClientInfo !== undefined) {
                responseClientInfo.certificateNoShareholder = dataClientResponse;
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
