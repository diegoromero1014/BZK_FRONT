import * as constants from './constants';

export function updateNote(index, prop, value){
  return {
      type: constants.UPDATE_NOTE,
      prop,
      value,
      index
    };
}

export function addNote(){
  return {
      type: constants.CREATE_NOTE
    };
}
