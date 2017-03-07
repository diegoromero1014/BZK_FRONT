import * as constants from './constants';

export function deleteBusiness(index){
  return {
      type: constants.DELETE_BUSINESS,
      index
    };
}

export function addBusiness(business){
  return {
      type: constants.ADD_BUSINESS,
      data : business
    };
}

export function editBusiness(business){
  return {
      type: constants.EDIT_BUSINESS,
      data : business
    };
}

export function clearBusiness(){
  return {
      type: constants.CLEAR_BUSINESS
    };
}
