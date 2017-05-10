import { APP_URL } from '../../constantsGlobal';
import {
    UPDATE_ACTIVE_TAB, CLICK_BUTTON_UPDATE_EDIT, VALIDATE_CONTACT_SHAREHOLDER, UPDATE_CLIENT,
    CHANGE_VALUE_MODAL_ERRORS, MESSAGE_ERRORS_UPDATE, UPDATE_ERROR_NOTES, UPDATE_ERROR_LINK_ENTITIES,
    CONSULT_MANAGEMENT_DOCUMENTARY, CLEAR_MANAGEMENT_DOCUMENTARY, RESET_ACCORDION,
    CHANGE_ACCORDION_ECONOMIC_ACTIVITY,CHANGE_ACCORDION_UBICATION_CORRESPONDENCE,CHANGE_ACCORDION_INFO_FINANCIERA,
    CHANGE_ACCORDION_DATA_COMERCIAL,CHANGE_ACCORDION_NOTES,CHANGE_ACCORDION_DECLARATION_OF_ORIGIN,
    CHANGE_ACCORDION_INTERNATIONAL_OPERATIONS,CHANGE_ACCORDION_DOCUMENT_INFORMATION_SERVICES,CHANGE_ACCORDION_FOREING_PRODUCTS
} from './constants';
import axios from 'axios';

export function updateTabSeleted(tabActive) {
    return {
        type: UPDATE_ACTIVE_TAB,
        payload: tabActive
    }
}

export function seletedButton(idButton) {
    return {
        type: CLICK_BUTTON_UPDATE_EDIT,
        payload: idButton
    }
}

export function updateErrorsNotes(errorNotes) {
    return {
        type: UPDATE_ERROR_NOTES,
        payload: errorNotes
    };
}

export function updateErrorsLinkEntities(errorLinkEntities) {
    return {
        type: UPDATE_ERROR_LINK_ENTITIES,
        payload: errorLinkEntities
    }
}

export function showHideModalErros(value) {
    return {
        type: CHANGE_VALUE_MODAL_ERRORS,
        payload: value
    }
}

export function sendErrorsUpdate(erros) {
    return {
        type: MESSAGE_ERRORS_UPDATE,
        payload: erros
    }
}

export function clearManagementDocumentary() {
    return {
        type: CLEAR_MANAGEMENT_DOCUMENTARY
    }
}

export function validateContactShareholder() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "timestamp": new Date().getTime(),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": window.localStorage.getItem('idClientSelected')
    };

    const request = axios.post(APP_URL + "/validateInfoClient", json);
    return {
        type: VALIDATE_CONTACT_SHAREHOLDER,
        payload: request
    }
}

export function updateClient(typeConsult) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "timestamp": new Date().getTime(),
            "service": typeConsult,
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": window.localStorage.getItem('idClientSelected')
    };

    const request = axios.post(APP_URL + "/updateDataClient", json);
    return {
        type: UPDATE_CLIENT,
        payload: request
    }
}

export function consultManagementDocumentaryService() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "timestamp": new Date().getTime(),
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": window.localStorage.getItem('idClientSelected')
    };

    const request = axios.post(APP_URL + "/managementDocumentaryService", json);
    return {
        type: CONSULT_MANAGEMENT_DOCUMENTARY,
        payload: request
    }
}

export function resetAccordion(){
    return{
        type: RESET_ACCORDION
    }
}


export function changeEconomicActivity(){
    console.log('changeEconomicActivity');
    return{
        type: CHANGE_ACCORDION_ECONOMIC_ACTIVITY
    }
}

export function changeUbicationCorrespondence(){
    console.log('changeUbicationCorrespondence');
    return{
        type: CHANGE_ACCORDION_UBICATION_CORRESPONDENCE
    }
}

export function changeInfoFinanciera(){
    console.log('changeInfoFinanciera');
    return{
        type: CHANGE_ACCORDION_INFO_FINANCIERA
    }
}

export function changeDataComercial(){
    console.log('changeDataComercial');
    return{
        type: CHANGE_ACCORDION_DATA_COMERCIAL
    }
}

export function changeNotes(){
    console.log('changeNotes');
    return{
        type: CHANGE_ACCORDION_NOTES
    }
}

export function changeDeclarationOfOrigin(){
    console.log('changeDeclarationOfOrigin');
    return{
        type: CHANGE_ACCORDION_DECLARATION_OF_ORIGIN
    }
}

export function changeInternationalOperations(){
    console.log('changeInternationalOperations');
    return{
        type: CHANGE_ACCORDION_INTERNATIONAL_OPERATIONS
    }
}

export function changeDocumentInformationServices(){
    console.log('changeDocumentInformationServices');
    return{
        type: CHANGE_ACCORDION_DOCUMENT_INFORMATION_SERVICES
    }
}

export function changeForeingProducts(){
    console.log('changeForeingProducts');
    return{
        type: CHANGE_ACCORDION_FOREING_PRODUCTS
    }
}