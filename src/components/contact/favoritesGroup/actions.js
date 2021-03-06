import axios from 'axios';

import { APP_URL } from '../../../constantsGlobal';
import * as constant from './constants';

export function groupFindServer(keyWordName, pageNum, maxRows) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
            "keyWordName": keyWordName,
            "pageNum": pageNum,
            "maxRows": maxRows
        }
    };

    const request = axios.post(APP_URL + "/getGroupsFavoriteContact", json);
    return {
        type: constant.FIND_GROUP_FAVORITE_CONTACTS,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: constant.CHANGE_PAGE_FOR_GROUP,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: constant.CHANGE_KEYWORD_NAME_GROUP,
        keywordName: keyword
    }
}

export function changeKeywordNameNewGroup(keyword) {
    return {
        type: constant.CHANGE_KEYWORD_NAME_NEW_GROUP,
        keywordName: keyword
    }
}

export function clearFilterGroup() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "",
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
            "keyWordName": '',
            "pageNum": 1,
            "maxRows": constant.NUMBER_RECORDS,
            "order": 0,
            "columnOrder": null
        }
    };
    const request = axios.post(APP_URL + "/getGroupsFavoriteContact", json);
    return {
        type: constant.INITIAL_VALUES_GROUPS,
        payload: request
    }
}

export function getGroupForId(id) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "messageBody": id
    };

    const request = axios.post(APP_URL + "/getGroupForId", json);
    return {
        type: constant.GET_GROUP_FOR_ID,
        payload: request
    }
}

export function getListContactGroupForId(id) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "messageBody": id
    };

    const request = axios.post(APP_URL + "/getListContactGroupForId", json);
    return {
        type: constant.GET_LIST_CONTACT_GROUP_FOR_ID,
        payload: request
    }
}



export function getValidateExistGroup(name) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "messageBody": name
    };

    let request = axios.post(APP_URL + "/getValidateExistGroup", json);
    return {
        type: constant.VALID_EXISTS_GROUP,
        payload: request
    }
}

export function searchContactForGroup(typeDocument, numberDocument, clientId) {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "lmejias",
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
            "typeDocument": typeDocument,
            "numberDocument": numberDocument,
            "clientId": clientId
        }
    }
    var request = axios.post(APP_URL + "/getContactByDocument", json);

    return {
        type: constant.SEARCH_CONTACT_FOR_GROUP,
        payload: request
    }
}

export function addContactList() {
    return {
        type: constant.ADD_CONTACT_LIST
    }
}

export function clearContactName() {
    return {
        type: constant.CLEAR_CONTACT_NAME
    }
}

export function deleteContactList(idContact) {
    return {
        type: constant.DELETE_CONTACT_LIST,
        idContact
    }
}

export function saveGroupFavoriteContacts(group) {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "lmejias",
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": group
    }
    var request = axios.post(APP_URL + "/saveGroupFavoriteContacts", json);
    return {
        type: constant.SAVE_GROUP_FAVORITE_CONTACTS,
        payload: request
    }
}

export function resetModal() {
    return {
        type: constant.RESET_MODAL
    }
}

export function saveNameGroup(name) {
    return {
        type: constant.SAVE_NAME_GROUP,
        name: name
    }
}

export function clearEmails() {
    return {
        type: constant.CLEAR_EMAILS
    }
}

export function getEmailsForGroup(group) {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "lmejias",
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": group
    }
    var request = axios.post(APP_URL + "/getEmailsForGroup", json);
    return {
        type: constant.VIEW_EMAIL_CONTACTS,
        payload: request
    }
}

export function getContactsByTypeOrFunction(obj) {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "username": "lmejias",
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": obj
    }
    var request = axios.post(APP_URL + "/getContactsByTypeOrFunction", json);
    return {
        type: constant.GET_CONCTACTS_BY_FUNCTIONS_OR_TYPE,
        payload: request
    }
}

export function changeStateContactByFunctionOrType(idContact) {
    return {
        type: constant.CHANGE_STATE_CONTACT_BY_FUNCTION_OR_TYPE,
        idContact
    }
}

export function associateContactsByFunctionOrType(listContactsByFunctionOrType) {
    return {
        type: constant.ASSOCIATE_CONTACTS_BY_FUNCTION_OR_TYPE,
        listContactsByFunctionOrType
    }
}

export function pageNumContactsByFunctionOrType(pageNum) {
    return {
        type: constant.CHANGE_PAGE_CONTACTS_BY_FUNCTION_OR_TYPE,
        pageNum
    }
}

export function lowerLimitContactsByFunctionOrType(lowerLimit) {
    return {
        type: constant.LOWER_LIMIT_CONTACTS_BY_FUNCTION_OR_TYPE,
        lowerLimit
    }
}

export function setKeywordContactsByFunctionOrType(keyword) {
    return {
        type: constant.SET_KEYWORD_CONTACTS_BY_FUNCTION_OR_TYPE,
        keyword
    }
}

export function setFunctionContactsByFunctionOrType(functionContact) {
    return {
        type: constant.SET_FUNCTION_CONTACTS_BY_FUNCTION_OR_TYPE,
        functionContact
    }
}

export function setTypeContactsByFunctionOrType(type) {
    return {
        type
    }
}

export function setContactsByFunctionOrType(listContacts) {
    return {
        type: constant.SET_CONTACTS_BY_FUNCTION_OR_TYPE,
        listContacts
    }
}

export function getListContactGroupById() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
    };

    const request = axios.post(APP_URL + "/getGroupsFavoriteContactById", json);
    return {
        type: constant.LIST_CONTACT_GROUP_FOR_ID,
        payload: request
    }
}