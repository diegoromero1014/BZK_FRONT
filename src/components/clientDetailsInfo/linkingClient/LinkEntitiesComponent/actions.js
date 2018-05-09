/**
 * Created by Andres Hurtado on 16/03/2017.
 */
import * as constants from './constants';
import {APP_URL} from '../../../../constantsGlobal';
import axios from 'axios';

export function updateLinkEntity(index, prop, value){
    return {
        type: constants.UPDATE_ENTITY,
        prop,
        value,
        index
    };
}

export function deleteLinkEntity(index){
    return {
        type: constants.DELETE_ENTITY,
        index
    };
}

export function addEntity(uid){
    return {
        type: constants.CREATE_ENTITY,
        uid
    };
}

export function setEntities(entitiesLinkedClient){
    return {
        type: constants.SET_ENTITIES,
        entitiesLinkedClient
    };
}

export function clearEntities(){
    return {
        type: constants.CLEAR_ENTITIES
    };
}

export function saveLinkClient(jsonLinkEntityClient){
    const jsonComplete = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        messageBody: jsonLinkEntityClient
    };
    const request = axios.post(APP_URL + "/saveLinkingClient", jsonComplete);
    return {
        type: constants.SAVE_LINK_CLIENT,
        payload: request
    }
}
