import * as constants from './constants';

export function updateEvent(index, prop, value){
  return {
      type: constants.UPDATE_EVENT,
      prop,
      value,
      index
    };
}

export function deleteEvent(index){
  return {
      type: constants.DELETE_EVENT,
      index
    };
}

export function addEvent(uid){
  return {
      type: constants.CREATE_EVENT,
      uid
    };
}

export function setEvents(events){
  return {
      type: constants.SET_EVENTS,
      events
    };
}

export function clearEvents(){
  return {
      type: constants.CLEAR_EVENTS,
    };
}
