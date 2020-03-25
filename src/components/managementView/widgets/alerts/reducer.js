import { OUTDATED_CONTACTS } from "./constants"
import { get } from 'lodash';

const initialState = {
    rows: [],
    rowCount: 0
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
  case OUTDATED_CONTACTS:
    return Object.assign({}, state, {rows: get(payload, 'data.data.rows', []), rowCount: get(payload, 'data.data.rowCount', 0)});
  default:
    return state
  }
}