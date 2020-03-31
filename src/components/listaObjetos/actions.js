import { UPDATE_LIST,UPDATE_ACTIVE_FIELD_OBJECT } from "./constants";

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
