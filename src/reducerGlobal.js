import Immutable from 'immutable';
import * as constants from './constantsGlobal';

const initialState = Immutable.Map({
    validateEnter: true,
    permissionsPropsect: [],
    permissionsClients: [],
    permissionsContacts: [],
    permissionsShareholders: [],
    permissionsPrevisits: [],
    permissionsTasks: [],
    permissionsPipeline: [],
    permissionsBussinessPlan: [],
    permissionsManagerialView: [],
    permissionsRiskGroup: [],
    permissionsBoardMembers: [],
    permissionsCovenants: [],
    permissionsStudyCredit: [],
    securityMessage: ''
});

export default (state = initialState, action) => {
    switch (action.type) {
        case constants.NON_VALIDATE_ENTER:
            return state.set('validateEnter', action.payload);
        case constants.MODULE_PROSPECT:
            const permissionsPropsect = action.payload.data.data.permissions;
            return state.set('permissionsPropsect', permissionsPropsect);
        case constants.MODULE_CLIENTS:
            const permissionsClients = action.payload.data.data.permissions;
            return state.set('permissionsClients', permissionsClients);
        case constants.MODULE_CONTACTS:
            const permissionsContacts = action.payload.data.data.permissions;
            return state.set('permissionsContacts', permissionsContacts);
        case constants.MODULE_SHAREHOLDERS:
            const permissionsShareholders = action.payload.data.data.permissions;
            return state.set('permissionsShareholders', permissionsShareholders);
        case constants.MODULE_PREVISITS:
            const permissionsPrevisits = action.payload.data.data.permissions;
            return state.set('permissionsPrevisits', permissionsPrevisits);
        case constants.CLEAR_PERMISSIONS_MODULE_PREVISITS:
            return state.set('permissionsPrevisits', [])
        case constants.MODULE_VISITS:
            const permissionsVisits = action.payload.data.data.permissions;
            return state.set('permissionsVisits', permissionsVisits);
        case constants.MODULE_TASKS:
            const permissionsTasks = action.payload.data.data.permissions;
            return state.set('permissionsTasks', permissionsTasks);
        case constants.MODULE_PIPELINE:
            const permissionsPipeline = action.payload.data.data.permissions;
            return state.set('permissionsPipeline', permissionsPipeline);
        case constants.MODULE_BUSSINESS_PLAN:
            const permissionsBussinessPlan = action.payload.data.data.permissions;
            return state.set('permissionsBussinessPlan', permissionsBussinessPlan);
        case constants.MODULE_MANAGERIAL_VIEW:
            const permissionsManagerialView = action.payload.data.data.permissions;
            return state.set('permissionsManagerialView', permissionsManagerialView);
        case constants.MODULE_QUALITATIVE_VARIABLES:
            const permissionsQualitativeV = action.payload.data.data.permissions;
            return state.set('permissionsQualitativeV', permissionsQualitativeV);
        case constants.MODULE_RISK_GROUP:
            const permissionsRiskGroup = action.payload.data.data.permissions;
            return state.set('permissionsRiskGroup', permissionsRiskGroup);
        case constants.MODULE_BOARD_MEMBERS:
            const permissionsBoardMembers = action.payload.data.data.permissions;
            return state.set('permissionsBoardMembers', permissionsBoardMembers);
        case constants.MODULE_COVENANTS:
            const permissionsCovenants = action.payload.data.data.permissions;
            return state.set('permissionsCovenants', permissionsCovenants);
        case constants.MODULE_STUDY_CREDIT:
            const permissionsStudyCredit = action.payload.data.data.permissions;
            return state.set('permissionsStudyCredit', permissionsStudyCredit);
        case constants.BLOCK_REPORT_CONSTANT:
            return state;
        case constants.STOP_BLOCK_REPORT:
            return state;
        case constants.MESSAGE_SECURITY_FORM:
            return state.set('securityMessage', action.message);
        default:
            return state;
    }
}