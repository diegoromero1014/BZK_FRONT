import { ACTION_OUTDATED_CONTACTS } from "./constants"
import { get } from 'lodash';

const initialState = {
    rows: [],
    rowCount: 0
}

export default (state = initialState, action = {}) => {
  if(action.type == ACTION_OUTDATED_CONTACTS) {
    return Object.assign({}, state, {rows: get(action.payload, 'data.data.rows', []), rowCount: get(action.payload, 'data.data.rowCount', 0)});
  } else {
    return state;
  }
}