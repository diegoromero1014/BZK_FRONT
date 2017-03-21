import {Map} from 'immutable';

export const ADD_BUSINESS = "ayax/pipeline-business/ADD";
export const DELETE_BUSINESS = "ayax/pipeline-business/DELETE";
export const EDIT_BUSINESS = "ayax/pipeline-business/EDIT";
export const CLEAR_BUSINESS = "ayax/pipeline-business/CLEAR";

const initialState = Map();
export default function (state = initialState, action = {}) {
    switch (action.type) {
    case ADD_BUSINESS:
        const {data: business} = action;
        return state.set(business.uuid, business);
    case DELETE_BUSINESS:
        return state.delete(action.index);
    case CLEAR_BUSINESS:
        return state.clear();
    case EDIT_BUSINESS:
        const businessEdit = action.data;
        const editKey = businessEdit.uuid;
        return state.set(editKey, Object.assign({}, state.get(editKey), businessEdit));
    default:
        return state;
    }
}

export function deleteBusiness(index) {
    return {
        type: DELETE_BUSINESS,
        index
    };
}

export function addBusiness(business) {
    return {
        type: ADD_BUSINESS,
        data: business
    };
}

export function editBusiness(business) {
    return {
        type: EDIT_BUSINESS,
        data: business
    };
}

export function clearBusiness() {
    return {
        type: CLEAR_BUSINESS
    };
}
