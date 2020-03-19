import { uniqueId, isEmpty, find, indexOf } from 'lodash'

import {
    CREATE_LIST,
    ADD_FIELD_TO_LIST,
    SET_FIELDS_TO_LIST,
    CHANGE_LIST_STATE,
    REMOVE_ELEMENT_FROM_LIST,
    UPDATE_ELEMENT_FROM_LIST,
    EDIT_ELEMENT_FROM_LIST
} from './constants';

const ID = "fieldlist-id";

const initialState = {};

const defaultListState = {
    fields: {},
    elements: [],
    showAddSection: false,
    isEditing: false,
    editElement: {},
    childrenList: [],
    errors: {}
}

function addNewListToState(name, state, list) {
    let newState = Object.assign({}, state);
    newState[name] = list;
    return Object.freeze(newState)
}


function addIdToElement(element) {
    let modifiedFiels = Object.assign({}, element);
    if (!element.hasOwnProperty(ID)) {
        modifiedFiels[ID] = uniqueId();
    }
    return modifiedFiels;
}

function replaceElementInArray(arr, searchFunction, newElement) {
    var match = find(arr, searchFunction);
    if(match){
        var index = indexOf(arr, find(arr, searchFunction));
        arr.splice(index, 1, newElement);
    } else {
        arr.push(newElement);
    }
    return arr;
}

function mergeElements(elements, newElement) {
    return replaceElementInArray(elements, (element) => element[ID] == newElement[ID], newElement );
}

/**
 * Añadir los elementos de la lista hija a la lista padre
 * @param {*} state 
 * @param {*} list 
 * @param {*} element 
 */
function addChildrenList(state, list, element) {
    const childrenList = list.childrenList;
    for (let index = 0; index < childrenList.length; index++) {
        const childList = childrenList[index];
        const listName = childList.name;
        const elements = state[listName].elements.map(element => Object.assign({}, element, {
            associated: true
        }));
        element[childList.alias] = elements;
    }
}
/**
 * Agregar la lista de elementos hijos (listas ligadas) al state y poderlas editar
 * @param {*} state 
 * @param {*} list 
 * @param {*} element 
 */
function addElementsToChildrenState(state, list, element) {
    const children = list.childrenList;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childName = child.name;
        const childList = state[childName];
        childList.elements = element[child.alias];
        childList.fields = childList.initialValues;
        childList.errors = {};
        state = addNewListToState(childName, state, childList);
    }
}

function clearElementsFromChild(state, list) {
    const children = list.childrenList;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childName = child.name;
        const childList = state[childName];
        //Verificar que la lista este creada
        if (!childList) {
            return;
        }
        childList.elements = [];
        childList.fields = childList.initialValues;
        childList.errors = {}
        childList.showAddSection = true;
        state = addNewListToState(childName, state, childList);
    }
}

function addElementToList(state, listName, elementsKey) {
    let list = state[listName];
    const element = addIdToElement(list.fields);
    addChildrenList(state, list, element);
    const newElements = mergeElements(list[elementsKey], element);
    let newList = Object.assign({}, list, {
        [elementsKey]: newElements
    });
    return addNewListToState(listName, state, newList);
}

export default (state, action) => {

    if (!state) {
        state = initialState
    }

    switch (action.type) {
        case CREATE_LIST: {
            //Lista ya se encuentra creada
            if (state.hasOwnProperty(action.name)) {
                return state;
            }
            let newState = Object.assign({}, state);
            newState[action.name] = Object.assign({}, defaultListState, action.defaultValues);
            return newState;
        }
        case ADD_FIELD_TO_LIST: {
            let list = state[action.list];
            let fields = Object.assign({}, list.fields, { [action.field]: action.value });
            let newList = Object.assign({}, list, {
                fields
            });
            return addNewListToState(action.list, state, newList);
        }
        case SET_FIELDS_TO_LIST: {
            let list = state[action.list];
            let fields = Object.assign({}, action.fields);
            if (isEmpty(action.fields) || action.fields == list.initialValues) {   
                clearElementsFromChild(state, list);
            }
            let newList = Object.assign({}, list, {
                fields,
                errors: {}
            });
            return addNewListToState(action.list, state, newList);
        }
        case CHANGE_LIST_STATE: {
            let list = state[action.list];
            let newList = Object.assign({}, list, action.newState);
            return addNewListToState(action.list, state, newList);
        }
        case UPDATE_ELEMENT_FROM_LIST: {
            let newState = addElementToList(state, action.list, action.key);
            return newState;
        }
        case REMOVE_ELEMENT_FROM_LIST: {
            let list = state[action.list];
            const elements = list.elements.filter(
                (element) => element[ID] != action.elementToDelete[ID]
            )
            let newList = Object.assign({}, list, {
                elements
            });
            return addNewListToState(action.list, state, newList);
        }
        // Click al boton editar (solo mostrar información, no se ha editado)
        case EDIT_ELEMENT_FROM_LIST: {
            let list = state[action.list];
            let newList = Object.assign({}, list, {
                errors: {},
                fields: action.element,
                showAddSection: true,
                isEditing: true
            });
            addElementsToChildrenState(state, newList, action.element);
            return addNewListToState(action.list, state, newList);
        }
        
        default:
            return state;
    }
}