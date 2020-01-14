import { CREATE_LIST, ADD_LIST, DELETE_LIST, CLEAN_LIST } from "./constants";

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