import * as constants from './constants';

export function deleteArea(index){
  return {
      type: constants.DELETE_AREA,
      index
    };
}

export function addArea(area){
  return {
      type: constants.ADD_AREA,
      data : area
    };
}

export function editArea(area){
  return {
      type: constants.EDIT_AREA,
      data : area
    };
}

export function clearArea(){
  return {
      type: constants.CLEAR_AREA
    };
}
