import Immutable from 'immutable';
import {
    UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER,
    CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE, UPDATE_ERROR_NOTES, UPDATE_ERROR_LINK_ENTITIES,
    CONSULT_MANAGEMENT_DOCUMENTARY, CLEAR_MANAGEMENT_DOCUMENTARY,RESET_ACCORDION,
    CHANGE_ACCORDION_ECONOMIC_ACTIVITY,CHANGE_ACCORDION_UBICATION_CORRESPONDENCE,CHANGE_ACCORDION_INFO_FINANCIERA,
    CHANGE_ACCORDION_DATA_COMERCIAL,CHANGE_ACCORDION_NOTES,CHANGE_ACCORDION_DECLARATION_OF_ORIGIN,
    CHANGE_ACCORDION_INTERNATIONAL_OPERATIONS,CHANGE_ACCORDION_DOCUMENT_INFORMATION_SERVICES,CHANGE_ACCORDION_FOREING_PRODUCTS
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
        economicActivity: -1,
        UbicationCorrespondence: 0,
        InfoFinanciera: 0,
        DataComercial: 0,
        notes: 0,
        DeclarationOfOrigin: 0,
        InternationalOperations: 0,
        DocumentInformationServices: 0,
        foreignProducts: 0
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
                economicActivity: 0,
                UbicationCorrespondence: 0,
                InfoFinanciera: 0,
                DataComercial: 0,
                notes: 0,
                DeclarationOfOrigin: 0,
                InternationalOperations: 0,
                DocumentInformationServices: 0,
                foreignProducts: 0
            };
            return state.set("accordion", resetAccordion);



























        case CHANGE_ACCORDION_ECONOMIC_ACTIVITY:
            const changeEconomicActivity = {
                economicActivity: (state.get('accordion').economicActivity==0)?-1:0,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeEconomicActivity);

        case CHANGE_ACCORDION_UBICATION_CORRESPONDENCE:
            const changeUbicationCorrespondence = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: (state.get('accordion').UbicationCorrespondence==0)?-1:0,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeUbicationCorrespondence);

        case CHANGE_ACCORDION_INFO_FINANCIERA:
            const changeInfoFinanciera = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: (state.get('accordion').InfoFinanciera==0)?-1:0,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeInfoFinanciera);

        case CHANGE_ACCORDION_DATA_COMERCIAL:
            const changeDataComercial = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: (state.get('accordion').DataComercial==0)?-1:0,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeDataComercial);

        case CHANGE_ACCORDION_NOTES:
            const changeNotes = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: (state.get('accordion').notes==0)?-1:0,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeNotes);

        case CHANGE_ACCORDION_DECLARATION_OF_ORIGIN:
            const changeDeclarationOfOrigin = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: (state.get('accordion').DeclarationOfOrigin==0)?-1:0,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeDeclarationOfOrigin);

        case CHANGE_ACCORDION_INTERNATIONAL_OPERATIONS:
            const changeInternationalOperations = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: (state.get('accordion').InternationalOperations==0)?-1:0,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeInternationalOperations);

        case CHANGE_ACCORDION_DOCUMENT_INFORMATION_SERVICES:
            const changeDocumentInformationServices = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: (state.get('accordion').DocumentInformationServices==0)?-1:0,
                foreignProducts: state.get('accordion').foreignProducts
            };
            return state.set("accordion", changeDocumentInformationServices);

        case CHANGE_ACCORDION_FOREING_PRODUCTS:
            const changeForeingProducts = {
                economicActivity: state.get('accordion').economicActivity,
                UbicationCorrespondence: state.get('accordion').UbicationCorrespondence,
                InfoFinanciera: state.get('accordion').InfoFinanciera,
                DataComercial: state.get('accordion').DataComercial,
                notes: state.get('accordion').notes,
                DeclarationOfOrigin: state.get('accordion').DeclarationOfOrigin,
                InternationalOperations: state.get('accordion').InternationalOperations,
                DocumentInformationServices: state.get('accordion').DocumentInformationServices,
                foreignProducts: (state.get('accordion').foreignProducts==0)?-1:0
            };
            return state.set("accordion", changeForeingProducts);































        default:
            return state;
    }
}
