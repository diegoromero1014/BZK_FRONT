import {SAVE_DATA_LOADING} from './constants';

export function changeStateSaveData(value, message){
  return {
    type: SAVE_DATA_LOADING,
    value: value,
    message: message
  }
}
