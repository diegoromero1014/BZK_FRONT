import Immutable from 'immutable';
import {
    UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER,
    CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE, UPDATE_ERROR_NOTES, UPDATE_ERROR_LINK_ENTITIES,
    CONSULT_MANAGEMENT_DOCUMENTARY, CLEAR_MANAGEMENT_DOCUMENTARY, RESET_ACCORDION, CHANGE_ACCORDION, OPEN_TAB
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
        opportunitiesWeaknesses: OPEN_TAB,
        clientObjetives: OPEN_TAB,
        economicActivity: OPEN_TAB,
        inventoryPolicy: OPEN_TAB,
        controlLinkedPayments: OPEN_TAB,
        mainCustomer: OPEN_TAB,
        mainSupplier: OPEN_TAB,
        mainCompetition: OPEN_TAB,
        ubicationCorrespondence: OPEN_TAB,
        infoFinanciera: OPEN_TAB,
        dataComercial: OPEN_TAB,
        notes: OPEN_TAB,
        declarationOfOrigin: OPEN_TAB,
        internationalOperations: OPEN_TAB,
        documentInformationServices: OPEN_TAB,
        foreignProducts: OPEN_TAB
    },
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACTIVE_TAB:
            return state.set("tabSelected", action.payload);
        case CLICK_BUTTON_UPDATE_EDIT:
            return state.set("seletedButton", action.payload);
        case UPDATE_ERROR_LINK_ENTITIES:
            // return state.set("errorEditLinkEntitiesClient", action.payload);
            return state.withMutations(map => {
                map.set('errorEditLinkEntitiesClient', action.payload.isError)
                    .set('errorEditLinkEntitiesClientMessage', action.payload.message);
            });
        case UPDATE_ERROR_NOTES:
            return state.withMutations(map => {
                map.set('errorNotesEditClient', action.payload.status)
                    .set('errorNotesEditClientMessage', action.payload.message);
            });

        // state.set("errorNotesEditClient", action.payload);
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
                opportunitiesWeaknesses: OPEN_TAB,
                clientObjetives: OPEN_TAB,
                economicActivity: OPEN_TAB,
                inventoryPolicy: OPEN_TAB,
                controlLinkedPayments: OPEN_TAB,
                mainCustomer: OPEN_TAB,
                mainSupplier: OPEN_TAB,
                mainCompetition: OPEN_TAB,
                ubicationCorrespondence: OPEN_TAB,
                infoFinanciera: OPEN_TAB,
                dataComercial: OPEN_TAB,
                notes: OPEN_TAB,
                declarationOfOrigin: OPEN_TAB,
                internationalOperations: OPEN_TAB,
                documentInformationServices: OPEN_TAB,
                foreignProducts: OPEN_TAB
            };
            return state.set("accordion", resetAccordion);

        case CHANGE_ACCORDION:
            return state.set("accordion", action.accordion);

        default:
            return state;
    }
}
