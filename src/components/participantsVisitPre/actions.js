import * as constants from './constants';

export function deleteParticipant(index){
  return {
      type: constants.DELETE_PARTICIPANT,
      index
    };
}

export function addParticipant(participant){
  return {
      type: constants.ADD_PARTICIPANT,
      data : participant
    };
}

export function clearParticipants(){
  return {
      type: constants.CLEAR_PARTICIPANTS
    };
}
