import { UPDATE_LIST, UPDATE_ACTIVE_FIELD_OBJECT, UPDATE_ELEMENT_ASOCIADO,
  SAVE_TEMPORAL_CHANGES, DISCARD_TEMPORAL_CHANGES, OPEN_LINK_MODAL } from "./constants";

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

function changeCheckedFromElement(state, name, id, value) {
  const elements = state[name].elements.map((element) => {
    let editedElement = Object.assign({}, element);

    if (element.id == id) {
      editedElement["temporalChecked"] = value;
    }
    return editedElement;
  });

  return getNewStateFromElements(state, name, elements);

}

function getNewStateFromElements(state, name, elements) {
  let newState = Object.assign({}, state, {
    [name]: Object.assign({}, state[name], {
      elements: elements
    })
  });
  return newState;
}

export default function reducer(state, action) {

  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case UPDATE_LIST:
      {
        const list = state[action.name];
        const newList = Object.assign({}, list, { elements: action.elements });
        const newState = Object.assign({}, state, { [action.name]: newList });
        return newState;
      }

    case UPDATE_ACTIVE_FIELD_OBJECT:
      let element = Object.assign({}, state[action.name], {
        open: action.status
      });
      return Object.assign({}, state, { [action.name]: element });

    case UPDATE_ELEMENT_ASOCIADO:
      return changeCheckedFromElement(state, action.payload.name, action.payload.id, action.payload.value);

    case SAVE_TEMPORAL_CHANGES:
      {
        let newElements = state[action.payload.name].elements.map(element => {
          let newElement = Object.assign({}, element);
          if (typeof newElement["temporalChecked"] != "undefined") {
            newElement["checked"] = newElement["temporalChecked"];
          }
          delete newElement.temporalChecked;
          return newElement;
        })

        return getNewStateFromElements(state, action.payload.name, newElements);

      }

    case DISCARD_TEMPORAL_CHANGES:
      {
        let newElements = state[action.payload.name].elements.map(element => {
          let newElement = Object.assign({}, element);
          delete newElement.temporalChecked;
          return newElement
        })
        return getNewStateFromElements(state, action.payload.name, newElements);
      }
    case OPEN_LINK_MODAL: 
      {
        let newElements = state[action.payload.name].elements.map(
          element => {
            let newElement = Object.assign({}, element);
            newElement['temporalChecked'] = newElement['checked'];
            return newElement;
          }
        )
        return getNewStateFromElements(state, action.payload.name, newElements);
      }
    default:
      return state;
  }
}
