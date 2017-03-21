/**
 * Created by Andres Hurtado on 16/03/2017.
 */
import * as constants from './constants';

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

export function setEntities(notes){
    return {
        type: constants.SET_ENTITIES,
        notes
    };
}

export function clearEntities(){
    return {
        type: constants.CLEAR_ENTITIES,
    };
}
