import { UPDATE_LIST } from "./constants";

const initialState = {
  Oportunidades: {
    elements: []
  },
  Debilidades: {
    elements: []
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LIST:
      const list = state[action.name];
      const newList = Object.assign({}, list, { elements: action.elements });
      const newState = Object.assign({}, state, { [action.name]: newList });
      return newState;
    default:
      return state;
  }
}
