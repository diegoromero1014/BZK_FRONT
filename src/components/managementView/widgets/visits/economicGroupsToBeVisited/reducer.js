import { ACTION_ECONOMIC_GROUPS_TO_BE_VISITED } from "../constants"
import { get } from 'lodash';

const initialState = {
    rows: [],
    rowCount: 0
}

export default (state = initialState, action = {}) => {
  if (action.type == ACTION_ECONOMIC_GROUPS_TO_BE_VISITED) {
    return Object.assign({}, state, {rows: get(action.payload, 'data.data.rows', []), rowCount: get(action.payload, 'data.data.rowCount', 0)});
  } else {
    return state;
  }
}