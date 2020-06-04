import Immutable from 'immutable';
import * as actions from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    riskGroupClients: null,
    hasRiskGroup: false,
    showModal: false
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.CONSULT_RISK_GROUP:
            let response = action.payload.data.data;
            return state.withMutations(map => {
                map.set('riskGroupClients', response);
            });
        case actions.HAS_RISK_GROUP:
            return state.withMutations(map => {
                map.set('hasRiskGroup', action.payload.data.data);
            });
        case actions.UPDATE_NAME_RISK_GROUP:
            const editRiskGroup = action.riskGroup;
            let riskGroupOld = state.get('riskGroupClients');
            _.set(riskGroupOld, 'code', editRiskGroup.code);
            _.set(riskGroupOld, 'name', editRiskGroup.name);
            _.set(riskGroupOld, 'observation', editRiskGroup.observation);
            return state.withMutations(map => {
                map.set('riskGroupClients', riskGroupOld);
            });
        case actions.CHANGE_PENDING:
            const isPending = action.isPending;
            let riskGroupTmp = state.get('riskGroupClients');
            _.set(riskGroupTmp, 'isPending', isPending);
            return state.withMutations(map => {
                map.set('riskGroupClients', riskGroupTmp);
            });
        case actions.SHOW_MODAL_RISK_GROUP:
            const show = action.show;
            return state.withMutations(map => {
                map.set('showModal', show);
            });
        case actions.LIST_NOVELTIES_RISK_GROUP:
            const riskGroup = action.payload.data.data;
            return state.withMutations(map => {
                map.set('listNoveltiesRiskGroup', riskGroup);
            });
        case actions.GET_OBSERVATIONS_BY_RISK_GROUP:
            const observationRiskGoup = action.payload.data.data;
            return state.withMutations(map => {
                map.set('observtionsRiskGroup', observationRiskGoup);
            });
        default:
            return state;
    }
}
