import Immutable from 'immutable';
import {
    UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER,
    CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE, UPDATE_ERROR_NOTES, UPDATE_ERROR_LINK_ENTITIES,
    CONSULT_MANAGEMENT_DOCUMENTARY
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
    listDocumentsManagementDocumentary: null
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
        case CONSULT_MANAGEMENT_DOCUMENTARY:
            return state.set("listDocumentsManagementDocumentary", _.get(action.payload, 'data.data',  null) );
        case VALIDATE_CONTACT_SHAREHOLDER:
            const response = action.payload.data.data;
            return state.withMutations(map => {
                map.set('errorConstact', (response[0] === null || response[0] === undefined || response[0] === "") ? false : true)
                    .set('errorShareholder', (response[1] === null || response[1] === undefined || response[1] === "") ? false : true);
            });
        default:
            return state;
    }
}
