import { APP_URL } from '../../constantsGlobal';
import axios from 'axios';
import * as constants from './constants';


export function contactsFindServer(keyword, limInf, limSup) {
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
            "keyword": keyword,
            "limInf": limInf,
            "limSup": limSup
        }
    };

    var request = axios.post(APP_URL + "/contactListFilter", json);
    return {
        type: constants.FILTER_CONTACTS,
        payload: request
    }
}

export function changePage(page) {
    return {
        type: constants.CHANGE_PAGE,
        currentPage: page
    }
}

export function changeKeyword(keyword) {
    return {
        type: constants.CHANGE_KEYWORD,
        keyword: keyword
    }
}

export function clearContacts() {
    return {
        type: constants.CLEAR_CONTACTS
    }
}

export function changeValueOpenModal(value) {
    return {
        type: constants.CHANGE_VALUE_IS_OPEN,
        payload: value
    }
}

export function setEditRelationship(entityClientContact) {
    return {
        type: constants.SET_EDIT_RELATIONSHIP,
        payload: entityClientContact
    }
}

export function updateRelationshipClientcontact(jsonBody) {
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
        "messageBody": jsonBody
    };

    var request = axios.post(APP_URL + "/updateRelationshipClientcontact", json);
    return {
        type: constants.UPDATE_VALUES_RELATIONSHIP,
        payload: request
    }
}