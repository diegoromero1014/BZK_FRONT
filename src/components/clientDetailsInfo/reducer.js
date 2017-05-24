import Immutable from 'immutable';
import {
    UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER,
    CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE, UPDATE_ERROR_NOTES, UPDATE_ERROR_LINK_ENTITIES,
    CONSULT_MANAGEMENT_DOCUMENTARY, CLEAR_MANAGEMENT_DOCUMENTARY, RESET_ACCORDION, CHANGE_ACCORDION, INACTIVE_TAB
} from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    status: "200",
    tabSelected: null,
    seletedButton: false,
    errorConstact: false,
    errorShareholder: false,
    modalErrorsIsOpen: false,
    errorsMessage: [],
    errorNotesEditClient: false,
    errorEditLinkEntitiesClient: false,
    listDocumentsManagementDocumentary: null,
    accordion: {
        economicActivity: INACTIVE_TAB,
        inventoryPolicy: INACTIVE_TAB,
        mainCustomer: INACTIVE_TAB,
        mainSupplier: INACTIVE_TAB,
        mainCompetition: INACTIVE_TAB,
        ubicationCorrespondence: INACTIVE_TAB,
        infoFinanciera: INACTIVE_TAB,
        dataComercial: INACTIVE_TAB,
        notes: INACTIVE_TAB,
        declarationOfOrigin: INACTIVE_TAB,
        internationalOperations: INACTIVE_TAB,
        documentInformationServices: INACTIVE_TAB,
        foreignProducts: INACTIVE_TAB
    },
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB:
            return state.set("tabSelected", action.payload);
        case CLICK_BUTTON_UPDATE_EDIT:
            return state.set("seletedButton", action.payload);
        case UPDATE_ERROR_LINK_ENTITIES:
            return state.set("errorEditLinkEntitiesClient", action.payload);
        case UPDATE_ERROR_NOTES:
            return state.set("errorNotesEditClient", action.payload);
        case CHANGE_VALUE_MODAL_ERRORS:
            return state.set("modalErrorsIsOpen", action.payload);
        case MESSAGE_ERRORS_UPDATE:
            return state.set("errorsMessage", action.payload);
        case CLEAR_MANAGEMENT_DOCUMENTARY:
            return state.set("listDocumentsManagementDocumentary", null);
        case CONSULT_MANAGEMENT_DOCUMENTARY:
            if (_.get(action.payload, 'data.status', null) === 500) {
                return state.set("listDocumentsManagementDocumentary", null);
            } else {
                return state.set("listDocumentsManagementDocumentary", _.get(action.payload, 'data.data', null));
            }
        case VALIDATE_CONTACT_SHAREHOLDER:
            const response = action.payload.data.data;
            return state.withMutations(map => {
                map.set('errorConstact', (response[0] === null || response[0] === undefined || response[0] === "") ? false : true)
                    .set('errorShareholder', (response[1] === null || response[1] === undefined || response[1] === "") ? false : true);
            });
        case RESET_ACCORDION:
            const resetAccordion = {
                economicActivity: INACTIVE_TAB,
                inventoryPolicy: INACTIVE_TAB,
                mainCustomer: INACTIVE_TAB,
                mainSupplier: INACTIVE_TAB,
                mainCompetition: INACTIVE_TAB,
                ubicationCorrespondence: INACTIVE_TAB,
                infoFinanciera: INACTIVE_TAB,
                dataComercial: INACTIVE_TAB,
                notes: INACTIVE_TAB,
                declarationOfOrigin: INACTIVE_TAB,
                internationalOperations: INACTIVE_TAB,
                documentInformationServices: INACTIVE_TAB,
                foreignProducts: INACTIVE_TAB
            };
            return state.set("accordion", resetAccordion);

        case CHANGE_ACCORDION:
            return state.set("accordion", action.accordion);

        default:
            return state;
    }
}
