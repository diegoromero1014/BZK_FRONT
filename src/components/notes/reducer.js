import Immutable from 'immutable';
import {UPDATE_NOTE, CREATE_NOTE, DELETE_NOTE, SET_NOTES, CLEAR_NOTES} from './constants';
import _ from 'lodash';


const initialState = Immutable.OrderedMap();

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_NOTE:
        const note = state.get(action.index);
        const newNote = _.set(note, action.prop, action.value);
        return state.set(action.index, newNote);
    case CREATE_NOTE:
        return state.set(action.uid, {body: '', combo: ''});
    case DELETE_NOTE:
        return state.delete(action.index);
    case SET_NOTES:
        const notes = action.notes;
        notes.map(map => {
          const uid = _.uniqueId('note_');
          state.set(uid, {body: map.note, combo: map.typeOfNote});
        });
        return state.withMutations(map => {
          notes.forEach(map2 => {
            const uid = _.uniqueId('note_');
            map.set(uid, {body: map2.note, combo: map2.typeOfNote});
          });
        });
    case CLEAR_NOTES:
        return state.clear();
    default:
        return state;
    }
}
