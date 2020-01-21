import { UPDATE_LIST, UPDATE_ACTIVE_FIELD_OBJECT } from "./constants";

const initialState = {
  Oportunidades: {
    elements: [],
    open: false
  },
  Debilidades: {
    elements: [],
    open: false
  }
};

export default function reducer(state, action) {

  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case UPDATE_LIST:
      const list = state[action.name];
      const newList = Object.assign({}, list, { elements: action.elements });
      const newState = Object.assign({}, state, { [action.name]: newList });
      return newState;
    case UPDATE_ACTIVE_FIELD_OBJECT:
      let element = Object.assign({}, state[action.name], {
        open: action.status
      });

      return Object.assign({}, state, { [action.name]: element });
    default:
      return state;
  }
}
