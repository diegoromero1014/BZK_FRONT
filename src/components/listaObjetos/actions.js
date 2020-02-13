import { UPDATE_LIST,UPDATE_ACTIVE_FIELD_OBJECT, UPDATE_ELEMENT_ASOCIADO,
  DISCARD_TEMPORAL_CHANGES, SAVE_TEMPORAL_CHANGES, OPEN_LINK_MODAL, ADD_INITIAL_LINKED_ELEMENTS} from "./constants";

export const updateElementFromList = (name, elements) => ({
  type: UPDATE_LIST,
  name,
  elements
});

export const updateActiveFieldObject = (status, name) => ({
  type: UPDATE_ACTIVE_FIELD_OBJECT,
  name,
  status
});

export const updateElementoAsociado = (id, name, value) => ({
  type: UPDATE_ELEMENT_ASOCIADO,
  payload : {
    id,
    name,
    value
  }
});

export const saveTemporalChanges = (name) => ({
  type: SAVE_TEMPORAL_CHANGES,
  payload : {
    name
  }
})

export const discardTemporalChanges = (name) => ({
  type: DISCARD_TEMPORAL_CHANGES,
  payload: {
    name
  }
});

export const openLinkModal = (name) => ({
  type: OPEN_LINK_MODAL,
  payload: {
    name
  }
})

export const addInitialLinkedElements = (name, elements) => ({
  type: ADD_INITIAL_LINKED_ELEMENTS,
  payload: {
    name,
    elements
  }
})
