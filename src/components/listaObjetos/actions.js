import { UPDATE_LIST } from "./constants";

export const updateElementFromList = (name, elements) => {
  return {
    type: UPDATE_LIST,
    name,
    elements
  };
};
