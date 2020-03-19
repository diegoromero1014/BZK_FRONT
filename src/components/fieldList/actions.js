import {
    CREATE_LIST,
    ADD_FIELD_TO_LIST,
    SET_FIELDS_TO_LIST,
    CHANGE_LIST_STATE,
    REMOVE_ELEMENT_FROM_LIST,
    UPDATE_ELEMENT_FROM_LIST,
    EDIT_ELEMENT_FROM_LIST
} from './constants';

export function createList(name, defaultValues = {
    childrenList: []
}) {
    return {
        type: CREATE_LIST,
        name,
        defaultValues
    }
}

export const addFieldToList = list => (field, value) => {
    return {
        type: ADD_FIELD_TO_LIST,
        list,
        field,
        value
    }
}

export const setFieldsToList = list => (fields) => {
    return {
        type: SET_FIELDS_TO_LIST,
        list,
        fields
    }
}

export const changeListState = list => (newState) => {
    return {
        type: CHANGE_LIST_STATE,
        list,
        newState
    }
}

export const updateElementFromList = list => (key) => {
    return {
        type: UPDATE_ELEMENT_FROM_LIST,
        list,
        key
    }
}

export const removeElementFromList = list => (elementToDelete) => {
    return {
        type: REMOVE_ELEMENT_FROM_LIST,
        list,
        elementToDelete
    }
}

export const editElementFromList = list => element => {
    return {
        type: EDIT_ELEMENT_FROM_LIST,
        list,
        element
    }
}