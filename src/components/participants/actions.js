import { ADD_PARTICIPANT, CLEAR_PARTICIPANTS, ADD_LIST_PARTICIPANT, DELETE_PARTICIPANT } from './constants';

export const addParticipant = data => ({ type: ADD_PARTICIPANT, data });
export const clearParticipants = () => ({ type: CLEAR_PARTICIPANTS })

export const addListParticipant = listParticipant => ({ type: ADD_LIST_PARTICIPANT, listParticipant });
export const deleteParticipant = (index, tab) => ({ type: DELETE_PARTICIPANT, index, tab });