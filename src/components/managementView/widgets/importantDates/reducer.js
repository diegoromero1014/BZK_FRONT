import { IMPORTANT_DATES } from "./constants"
import { get } from 'lodash';

const initialState = {
    rowCount: null,
    rows: []
}

export default (state = initialState, action = {}) => {
  if(action.type == IMPORTANT_DATES) {
    return Object.assign({}, state, {rows: get(action.payload, 'data.data.rows', []), rowCount: get(action.payload, 'data.data.rowCount', 0)});
  } else {
    return state;
  }
}