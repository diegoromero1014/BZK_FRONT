import * as constants from './constants';

export function deleteNeed(index) {
  return {
    type: constants.DELETE_NEED,
    index
  };
}

export function addNeed(need) {
  return {
    type: constants.ADD_NEED,
    data: need
  };
}

export function editNeed(need) {
  return {
    type: constants.EDIT_NEED,
    data: need
  };
}

export function clearNeed() {
  return {
    type: constants.CLEAR_NEED
  };
}
