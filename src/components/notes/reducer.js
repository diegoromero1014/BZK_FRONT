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
        console.log(state.push(newNote));
        return state.push(newNote);
    case DELETE_NOTE:
        const index = state.findIndex(item => item.uid === action.index);
        return state.delete(index);
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
