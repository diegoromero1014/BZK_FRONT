import Immutable from 'immutable';
import {UPDATE_NOTE, CREATE_NOTE, DELETE_NOTE, SET_NOTES, CLEAR_NOTES} from './constants';
import _ from 'lodash';


const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_NOTE:
        const noteToUpdate = state.find(item => item.uid === action.index);
        const indexNoteToUpdate = state.findIndex(item => item.uid === action.index);
        return state.set(indexNoteToUpdate, _.set(noteToUpdate, action.prop, action.value));
    case CREATE_NOTE:
        const newNote = _.assign({}, {
            body: '',
            combo: '',
            uid: action.uid
        });
        return state.push(newNote);
    case DELETE_NOTE:
        const index = state.findIndex(item => item.uid === action.index);
        return state.delete(index);
    case SET_NOTES:
        const notes = action.notes;
        const list = Immutable.List(notes);
        return state.withMutations(list => {

          notes.map(item => {
            const uid = _.uniqueId('note_');
            list.push(
              {
                uid,
                body: item.note,
                combo: String(item.typeOfNote)
              }
            )
          });
      });
    case CLEAR_NOTES:
        return state.clear();
    default:
        return state;
    }
}
