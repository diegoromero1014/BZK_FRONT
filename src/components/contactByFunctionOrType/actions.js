/**
 * Created by ahurtado on 12/06/2016.
 */
import {APP_URL} from '../../constantsGlobal';
import {
    FIND_CONTACTS_BY_FUNCTION_OR_TYPE,
    CHANGE_PAGE_FOR_CONTACTS_BY_FUNCTION_OR_TYPE,
    CLEAR_ORDER_CONTACTS_BY_FUNCTION_OR_TYPE,
    CLEAR_PAGINATION_CONTACTS_BY_FUNCTION_OR_TYPE,
    ORDER_COLUMN_CONTACTS_BY_FUNCTION_OR_TYPE,
    CLEAR_FILTERS_CONTACTS_BY_FUNCTION_OR_TYPE,
    NUMBER_RECORDS,
    CHANGE_FUNCTION_CONTACTS_BY_FUNCTION_OR_TYPE,
    CHANGE_TYPE_CONTACTS_BY_FUNCTION_OR_TYPE
} from './constants';
import axios from 'axios';

export function contactsByFunctionOrTypeFindServer(idFunction, idType, pageNum, maxRows, order, columnOrder) {

    console.log('llegue desde el ordenamiento')
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
        "messageBody": {
            "functionId": idFunction,
            "typeOfContactId": idType,
            pageNum,
            maxRows,
            order,
            columnOrder
        }
    };

    const request = axios.post(APP_URL + "/getContactsByFunctionOrType", json);
    return {
        type: FIND_CONTACTS_BY_FUNCTION_OR_TYPE,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: CHANGE_PAGE_FOR_CONTACTS_BY_FUNCTION_OR_TYPE,
        currentPage: page
    }
}

export function clearFilter() {

    return {
        type: CLEAR_FILTERS_CONTACTS_BY_FUNCTION_OR_TYPE
    }
}

export function changeFunction(idFunction) {

    return {
        type: CHANGE_FUNCTION_CONTACTS_BY_FUNCTION_OR_TYPE,
        idFunction
    }
}
export function changeType(idType) {
    return {
        type: CHANGE_TYPE_CONTACTS_BY_FUNCTION_OR_TYPE,
        idType
    }
}

export function clearContactsOrder() {
    return {
        type: CLEAR_ORDER_CONTACTS_BY_FUNCTION_OR_TYPE
    };
}

export function clearContactsByFunctionPagination() {
    return {
        type: CLEAR_PAGINATION_CONTACTS_BY_FUNCTION_OR_TYPE
    };
}

export function orderColumnContactsByFunctionOrType(orderContacts, columnContact) {
    return {
        type: ORDER_COLUMN_CONTACTS_BY_FUNCTION_OR_TYPE,
        orderContacts,
        columnContact
    };
}