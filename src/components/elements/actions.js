import { CREATE_LIST, ADD_LIST, DELETE_LIST, CLEAN_LIST, SET_TO_SHOW, LINKED_RECORDS, RESET_RECORDS } from "./constants";

export const createList = payload => ({
    type: CREATE_LIST,
    payload
});

export const addToList = payload => ({
    type: ADD_LIST,
    payload
});

export const removeFromList = payload => ({
    type: DELETE_LIST,
    payload
});

export const cleanList = payload => ({
    type: CLEAN_LIST,
    payload
});

export const setToShow = payload => ({
    type: SET_TO_SHOW,
    payload
})

export const linkedRecords = payload => ({
    type: LINKED_RECORDS,
    payload
});

export const resetRecords = payload => ({
    type: RESET_RECORDS,
    payload
});