import * as constants from './constants';

export function updateNote(index, prop, value){
  return {
      type: constants.UPDATE_NOTE,
      prop,
      value,
      index
    };
}

export function deleteNote(index){
  return {
      type: constants.DELETE_NOTE,
      index
    };
}

export function addNote(uid){
  return {
      type: constants.CREATE_NOTE,
      uid
    };
}
